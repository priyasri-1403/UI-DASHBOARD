import { getStoredData } from '../../utils/datafetch.js';

export default async function decorate(block) {
    // Create the graph container
    const graphContainer = document.createElement('div');
    graphContainer.classList.add('graph-container');
    
    // Clear existing content in the block and append the graph container
    block.textContent = '';
    block.appendChild(graphContainer);

    // Show loading indicator
    graphContainer.innerHTML = '<div class="loading">Loading bug data...</div>';
    
    // Get project name and DR number from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('project-name');
    let drNumber = urlParams.get('dr-number');
    
    // Extract DR number from project name if not provided directly
    if (!drNumber && projectName) {
        const drMatch = projectName.match(/DR\d+/);
        if (drMatch && drMatch[0]) {
            drNumber = drMatch[0];
        }
    }
    
    console.log('Using DR number:', drNumber);
    
    let bugData = [];
    
    // Try to get bug data from IndexedDB using the DR number
    if (drNumber) {
        try {
            // First try to get data specific to this DR number
            const drData = await getStoredData(`${drNumber}_data`);
            if (drData && drData[drNumber] && drData[drNumber].data) {
                console.log('Found bug data for', drNumber, drData[drNumber].data);
                bugData = drData[drNumber].data;
            } else {
                // If not found, try the projectData
                const projectData = await getStoredData('projectData');
                if (projectData && projectData[drNumber] && projectData[drNumber].data) {
                    console.log('Found bug data in projectData for', drNumber);
                    bugData = projectData[drNumber].data;
                    console.log(bugData)
                }
            }
        } catch (error) {
            console.error('Error fetching bug data:', error);
        }
    }
    
    // If no data found, show a message and return
    if (!bugData || bugData.length === 0) {
        graphContainer.innerHTML = '<div class="no-data">No bug data available for this project</div>';
        return;
    }
    
    // Extract the weeks, bugs, and fixed bugs data
    const weeks = bugData.map(item => item.weeks);
    const projectBugs = bugData.map(item => parseInt(item.bugs));
    const projectFixedBugs = bugData.map(item => parseInt(item["fixed bugs"]));

    // Create the chart options
    const options = {
        chart: {
            type: 'line',
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
                name: 'Bugs',
                data: projectBugs
            },
            {
                name: 'Fixed Bugs',
                data: projectFixedBugs
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

    // Render the chart
    setTimeout(() => {
        graphContainer.innerHTML = ''; // Clear loading message
        var chart = new ApexCharts(graphContainer, options);
        chart.render();
    }, 1000); // SetTimeout ensures chart is rendered after DOM update
}
