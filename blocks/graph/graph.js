function processChartData(sheetData, sheetName) {
  const weeks = sheetData.map((item) => item.weeks);
  const bugs = sheetData.map((item) => item.bugs);
  const fixedBugs = sheetData.map((item) => item['fixed bugs']);
  const graphBlock = document.querySelector('.graph.block');
  graphBlock.innerHTML = '';

  const chartContainer = document.createElement('div');
  chartContainer.classList.add('chart-container');
  graphBlock.appendChild(chartContainer);
  const options = {
    chart: {
      type: 'line',
      height: 350,
      foreColor: '#FFFFFF',
      toolbar: {
        show: true,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    legend: {
      show: true,
    },
    title: {
      text: `${sheetName} - Bugs`,
      align: 'left',
      style: {
        fontWeight: 'none',
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif',
      },
    },
    series: [
      {
        name: `${sheetName} - Bugs`,
        data: bugs,
      },
      {
        name: `${sheetName} - Fixed Bugs`,
        data: fixedBugs,
      },
    ],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 6,
      colors: ['#FF6347', '#32CD32'],
      strokeColor: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8,
        strokeWidth: 3,
      },
    },
    xaxis: {
      categories: weeks,
      title: {
        text: 'Weeks',
      },
    },
    yaxis: {
      title: {
        text: 'Bugs Count',
      },
      min: 0,
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 1,
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '14px',
        color: '#FFFFFF',
      },
    },
  };
  const chart = new ApexCharts(chartContainer, options);
  chart.render();
}

export default async function decorate(block) {
  const bugList = block.querySelector('a[href$=".json"]');
  if (!bugList) return;

  const url = new URL(bugList.href);
  console.log('Base URL:', url.href);

  // Get all sheet names from the URL query parameters
  const currentSheets = new URLSearchParams(window.location.search).getAll('sheet');
  console.log('All sheets:', currentSheets);

  // If no sheet is specified in the URL, return
  if (currentSheets.length === 0) {
    console.error('No sheet specified in the URL.');
    return;
  }

  // Decode sheet names from the query parameters
  const decodedSheets = currentSheets.map((sheet) => decodeURIComponent(sheet));
  console.log('Decoded sheets:', decodedSheets);

  decodedSheets.forEach((sheet) => {
    url.searchParams.append('sheet', sheet);
  });
  console.log('Updated URL with sheets:', url.href);

  try {
    // Fetching the JSON data from the updated URL
    const resp = await fetch(url.href);

    if (!resp.ok) {
      console.error('Failed to fetch data:', resp.statusText);
      return;
    }

    // Parse the JSON response
    const json = await resp.json();
    console.log('Fetched data:', json);

    // Loop through each sheet name and process the data
    decodedSheets.forEach((sheetName) => {
      if (json.data) {
        const sheetData = json.data;
        console.log(`Data for sheet ${sheetName}:`, sheetData);

        processChartData(sheetData, sheetName);
      } else {
        console.error(`Sheet '${sheetName}' not found in the data.`);
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
