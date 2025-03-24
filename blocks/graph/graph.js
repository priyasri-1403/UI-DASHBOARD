export default function decorate(block) {
    // Create the projects container
    const graphContainer = document.createElement('div');
    graphContainer.classList.add('graph-container');
    
    // Clear existing content in the block and append the graph container
    block.textContent = '';
    block.appendChild(graphContainer);

    
    // Replace block content with our projects container
    const project1 = {
        "data": [
            { "weeks": "week1", "bugs": 12, "fixed bugs": 8 },
            { "weeks": "week2", "bugs": 20, "fixed bugs": 17 },
            { "weeks": "week3", "bugs": 7, "fixed bugs": 4 },
            { "weeks": "week4", "bugs": 8, "fixed bugs": 7 }
        ]
    };

    console.log(project1);

    // Extract the weeks, bugs, and fixed bugs data for Project 1
    const weeks = project1.data.map(item => item.weeks);
    console.log(weeks);
    const project1Bugs = project1.data.map(item => item.bugs);
    console.log(project1Bugs);
    const project1FixedBugs = project1.data.map(item => item["fixed bugs"]);
    console.log(project1FixedBugs);

    // Create the chart options for Project 1
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
            text: 'Project Bugs',
            align: 'left',
            style: {
              fontWeight: 'none',
              fontSize: '20px',
              fontFamily: 'Arial, sans-serif',
            },
          },
        series: [
            {
                name: 'Project 1 Bugs',
                data: project1Bugs
            },
            {
                name: 'Project 1 Fixed Bugs',
                data: project1FixedBugs
            }
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
                text: 'Weeks'
            }
        },
        yaxis: {
            title: {
                text: 'Bugs Count'
            },
            min: 0
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

    // Ensure the graph container is available in the DOM before initializing the chart
    setTimeout(() => {
        var chart = new ApexCharts(block.querySelector(".graph-container"), options);
        chart.render();
    }, 1000); // SetTimeout ensures chart is rendered after DOM update
}
