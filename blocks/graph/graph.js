import { getStoredData } from '../../utils/datafetch.js';

export default async function decorate(block) {
    const graphContainer = document.createElement('div');
    graphContainer.classList.add('graph-container');

    const filterContainer = document.createElement('div');
    filterContainer.classList.add('custom-toolbar');

    const yearFilter = document.createElement('select');
    yearFilter.classList.add('year-filter');
    yearFilter.innerHTML = `
        <option value="" selected>All Years</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
    `;

    const quarterFilter = document.createElement('select');
    quarterFilter.classList.add('quarter-filter');
    quarterFilter.innerHTML = `
        <option value="" selected>All Quarters</option>
        <option value="Q1">Q1</option>
        <option value="Q2">Q2</option>
        <option value="Q3">Q3</option>
        <option value="Q4">Q4</option>
    `;

    filterContainer.appendChild(yearFilter);
    filterContainer.appendChild(quarterFilter);

    block.textContent = '';
    block.appendChild(graphContainer);

    graphContainer.innerHTML = '<div class="loading">Loading bugs data...</div>';

    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('project-name');
    let drNumber = urlParams.get('dr-number');

    if (!drNumber && projectName) {
        const drMatch = projectName.match(/DR\d+/);
        if (drMatch) drNumber = drMatch[0];
    }

    console.log('Using DR number:', drNumber);

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

        const filteredData = bugData.filter(item =>
            (selectedYear === '' || item.Year.toString() === selectedYear) &&
            (selectedQuarter === '' || item.Quarter === selectedQuarter)
        );
       // If no data matches the filter, display the "No data" message
    if (filteredData.length === 0) {
        graphContainer.innerHTML = ''; // Clear existing chart
        graphContainer.appendChild(filterContainer); // Re-append the filter dropdowns
        const noDataMessage = document.createElement('div');
        noDataMessage.classList.add('no-data');
        noDataMessage.textContent = 'No data available for the selected filters';
        graphContainer.appendChild(noDataMessage);
        return;
    }

        const weeks = filteredData.map(item => item.Sprint);
        const projectBugs = filteredData.map(item => parseInt(item.Bugs));
        const projectFixedBugs = filteredData.map(item => parseInt(item["Fixed bugs"]));

        if (window.chart) {
            window.chart.updateOptions({
                xaxis: { categories: weeks },
                series: [
                    { name: 'Bugs', data: projectBugs },
                    { name: 'Fixed Bugs', data: projectFixedBugs }
                ]
            });
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
                    download: false
                },
            },
            events: {
                mounted: insertFilters,
                updated: insertFilters,
            }
        },
        legend: { show: true },
        title: {
            text: 'Project Bugs',
            align: 'left',
            style: { fontWeight: 'none', fontSize: '20px', fontFamily: 'Arial, sans-serif' },
        },
        series: [],
        plotOptions: { bar: { horizontal: false, columnWidth: '45%', endingShape: 'flat' } },
        xaxis: { categories: [], title: { text: 'Sprint' } },
        yaxis: { title: { text: 'Bugs Count' }, min: 0 },
        grid: { borderColor: '#f1f1f1', strokeDashArray: 1 },
        tooltip: { theme: 'dark', style: { fontSize: '14px', color: '#FFFFFF' } },

        dataLabels: {
            enabled: true,  
            style: {
                fontSize: '6px', 
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                colors: ['#FFFFFF'] 
            },
        }
    };
    
    function insertFilters() {
        const toolbar = graphContainer.querySelector('.apexcharts-toolbar');
        if (toolbar && !toolbar.querySelector('.custom-toolbar')) {
            toolbar.prepend(filterContainer);
        }
    }

    setTimeout(() => {
        graphContainer.innerHTML = '';
        window.chart = new ApexCharts(graphContainer, options);
        window.chart.render().then(insertFilters);
        yearFilter.addEventListener('change', updateChart);
        quarterFilter.addEventListener('change', updateChart);
        updateChart();

    }, 1000);
}
