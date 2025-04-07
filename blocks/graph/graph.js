import { getStoredData } from '../../utils/datafetch.js';

export default async function decorate(block) {
  const graphContainer = document.createElement('div');
  graphContainer.classList.add('graph-container');

  const filterContainer = document.createElement('div');
  filterContainer.classList.add('custom-toolbar');

  const yearFilter = document.createElement('select');
  yearFilter.classList.add('year-filter');

  const quarterFilter = document.createElement('select');
  quarterFilter.classList.add('quarter-filter');
  function populateFilters(data) {
    const yearSet = new Set();
    const quarterSet = new Set();
    data.forEach((item) => {
      if (item.Year) yearSet.add(item.Year.toString());
      if (item.Quarter) quarterSet.add(item.Quarter);
    });
    const years = Array.from(yearSet).sort();
    const quarters = Array.from(quarterSet).sort();
    yearFilter.innerHTML = '<option value="" selected>Year</option>';
    years.forEach((year) => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    });
    quarterFilter.innerHTML = '<option value="">All Quarters</option>';
    quarters.forEach((quarter) => {
      const option = document.createElement('option');
      option.value = quarter;
      option.textContent = quarter;
      quarterFilter.appendChild(option);
    });
  }

  const expandbtn = document.createElement('button');
  expandbtn.classList.add('expand');
  expandbtn.title = 'Expand';

  const expandIcon = document.createElement('img');
  expandIcon.src = '../../icons/expand_icon.svg';
  expandbtn.setAttribute('aria-label', 'Expand');
  expandbtn.appendChild(expandIcon);

  filterContainer.appendChild(yearFilter);
  filterContainer.appendChild(quarterFilter);
  filterContainer.appendChild(expandbtn);

  expandbtn.addEventListener('click', () => {
    const targetSection = document.querySelector('.section.graph-container.project-insight-container[data-section-status="loaded"]');
    const projectInsightWrapper = document.querySelector('.project-insight-wrapper');
    if (targetSection && projectInsightWrapper) {
      targetSection.classList.toggle('expanded');
      const isNowExpanded = targetSection.classList.contains('expanded');
      expandIcon.src = isNowExpanded
        ? '../../icons/collapse_icon.svg'
        : '../../icons/expand_icon.svg';
      expandIcon.alt = isNowExpanded ? 'Collapse' : 'Expand';
      expandbtn.title = isNowExpanded ? 'Collapse' : 'Expand';
    }
  });

  block.textContent = '';
  block.appendChild(graphContainer);

  graphContainer.innerHTML = '<div class="loading">Loading bugs data...</div>';

  const urlParams = new URLSearchParams(window.location.search);
  const projectName = urlParams.get('project-name');
  let drNumber = urlParams.get('dr-number');

  if (!drNumber && projectName) {
    const drMatch = projectName.match(/DR\d+/);
    if (drMatch) [drNumber] = drMatch;
  }

  // console.log('Using DR number:', drNumber);

  let bugData = [];

  if (drNumber) {
    try {
      const drData = await getStoredData(`${drNumber}_data`);
      if (drData?.[drNumber]?.data) {
        bugData = drData[drNumber].data;
      } else {
        const projectData = await getStoredData('projectData');
        if (projectData?.[drNumber]?.data) {
          bugData = projectData[drNumber].data;
          populateFilters(bugData);
        }
      }
    } catch (error) {
      console.error('Error fetching bug data:', error);
    }
  }

  if (!bugData || bugData.length === 0) {
    graphContainer.innerHTML = '<div class="no-data">No bug data available for this project</div>';
    return;
  }

  function updateChart() {
    const selectedYear = yearFilter.value;
    const selectedQuarter = quarterFilter.value;

    const filteredData = bugData.filter((item) => (selectedYear === '' || item.Year.toString() === selectedYear)
            && (selectedQuarter === '' || item.Quarter === selectedQuarter));

    if (filteredData.length === 0) {
      graphContainer.innerHTML = '';
      graphContainer.appendChild(filterContainer);
      const noDataMessage = document.createElement('div');
      noDataMessage.classList.add('no-data');
      noDataMessage.textContent = 'No data available for the selected filters';
      graphContainer.appendChild(noDataMessage);
      return;
    }

    const weeks = filteredData.map((item) => item.Sprint);
    const projectBugs = filteredData.map((item) => parseInt(item.Bugs, 10));
    const projectFixedBugs = filteredData.map((item) => parseInt(item['Fixed bugs'], 10));

    if (window.chart) {
      window.chart.updateOptions({
        xaxis: { categories: weeks },
        series: [
          { name: 'Bugs', data: projectBugs },
          { name: 'Fixed Bugs', data: projectFixedBugs },
        ],
      });
    }
  }

  function insertFilters() {
    const toolbar = graphContainer.querySelector('.apexcharts-toolbar');
    if (toolbar && !toolbar.querySelector('.custom-toolbar')) {
      toolbar.prepend(filterContainer);
    }
  }
  const options = {
    chart: {
      type: 'bar',
      height: 405,
      foreColor: '#FFFFFF',
      toolbar: {
        show: true,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          menu: true,
          download: false,
        },
      },
      events: {
        mounted: insertFilters,
        updated: insertFilters,
      },
    },
    legend: { show: true },
    title: {
      text: 'Project Bugs',
      align: 'left',
      style: { fontWeight: 'none', fontSize: '20px', fontFamily: 'Arial, sans-serif' },
    },
    series: [],
    plotOptions: { bar: { horizontal: false, columnWidth: '50%', endingShape: 'flat' } },
    xaxis: {
      categories: [],
      title: { text: 'Sprint' },
      labels: { rotate: -45 },
      tooltip: { enabled: true },
    },
    yaxis: { title: { text: 'Bugs Count' }, min: 0 },
    grid: { borderColor: '#f1f1f1', strokeDashArray: 1 },
    tooltip: { theme: 'dark', style: { fontSize: '14px', color: '#FFFFFF' } },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '6px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#FFFFFF'],
      },
    },
  };

  setTimeout(() => {
    graphContainer.innerHTML = '';
    window.chart = new ApexCharts(graphContainer, options);
    window.chart.render().then(insertFilters);
    yearFilter.addEventListener('change', updateChart);
    quarterFilter.addEventListener('change', updateChart);
    updateChart();
  }, 1000);
}
