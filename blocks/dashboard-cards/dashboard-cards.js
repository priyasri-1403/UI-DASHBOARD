import { fetchProjectData, getProjectData, getStoredData } from '../../utils/datafetch.js';

export default async function decorate(block) {
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
    
    console.log('Using DR number for dashboard cards:', drNumber);
    
    let projectData = null;
    
    // Default card data in case project data isn't available
    const defaultCardData = [
        {
            title: 'Region',
            value: 'Not Available',
            icon: '/icons/home.svg',
            showTrend: false
        },
        {
            title: 'Revenue',
            value: 'Not Available',
            icon: '/icons/revenue.svg',
            showTrend: false
        },
        {
            title: 'Start Date',
            value: 'Not Available',
            icon: '/icons/employee.svg',
            showTrend: false
        },
        {
            title: 'Project Status',
            value: 'Not Available',
            icon: '/icons/project.svg',
            showTrend: false,
            showProgress: false
        }
    ];
    
    // Loading indicator while we get data
    block.innerHTML = '<div class="dashboard-cards-container loading">Loading project data...</div>';
    
    // Get project data from multiple sources
    if (projectName) {
        try {
            // Try to get project data from multiple sources
            
            // 1. First try to get project-specific data
            const storedProject = await getProjectData(projectName);
            if (storedProject && storedProject.data) {
                console.log('Found project data in project-specific storage');
                projectData = storedProject.data;
            } 
            // 2. If not found, check projectData general storage
            else {
                const projectsData = await getStoredData('projectData');
                if (projectsData && projectsData.projectdata && Array.isArray(projectsData.projectdata.data)) {
                    console.log('Looking for project in general projectData storage');
                    // Find project by name
                    const project = projectsData.projectdata.data.find(p => p.Project === projectName);
                    if (project) {
                        console.log('Found project in general projectData storage');
                        projectData = project;
                    }
                }
            }
            
            // 3. If still not found and we have a DR number, try that
            if (!projectData && drNumber) {
                console.log('Trying to find project data using DR number');
                const drData = await getStoredData(`${drNumber}_data`);
                if (drData && drData.projectdata && Array.isArray(drData.projectdata.data)) {
                    // Find project by DR number in name
                    const project = drData.projectdata.data.find(p => p.Project.includes(drNumber));
                    if (project) {
                        console.log('Found project using DR number');
                        projectData = project;
                    }
                }
            }
            
            // 4. If still not found, try fetching (this will use IndexedDB internally if available)
            if (!projectData) {
                console.log('No project data found in storage, trying fetchProjectData');
                const result = await fetchProjectData(null, projectName);
                if (result && result.data) {
                    projectData = result.data;
                }
            }
            
            console.log('Final project data:', projectData);
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    }
    
    // Prepare card data from project data or use default
    const cardData = projectData ? [
        {
            title: 'Region',
            value: projectData['Region (Project)'] || 'Not Available',
            icon: '/icons/home.svg',
            showTrend: false
        },
        {
            title: 'Revenue',
            value: projectData['Revenue Booked (Project)'] ? `$${Number(projectData['Revenue Booked (Project)']).toLocaleString()}` : 'Not Available',
            icon: '/icons/revenue.svg',
            trend: '4% Since last month',
            trendPositive: true,
            showTrend: true
        },
        {
            title: 'Project Manager',
            value: projectData['Project manager (Project)'] || 'Not Available',
            icon: '/icons/employee.svg',
            showTrend: false
        },
        {
            title: 'Project Status',
            value: projectData['Overall Project Status (Project)'] || 'Not Available',
            icon: '/icons/project.svg',
            showTrend: false,
            showProgress: true
        }
    ] : defaultCardData;

    let cardsHTML = '<div class="dashboard-cards-container">';
    
    cardData.forEach((data) => {
        cardsHTML += `
            <div class="dashboard-card">
                <div class="card-title">${data.title}</div>
                <div class="card-value">${data.value}</div>
                ${data.showProgress ? '<div class="card-progress"><div class="card-progress-fill"></div></div>' : ''}
                ${data.showTrend ? `
                    <div class="card-footer">
                        <span class="card-trend-icon">${data.trendPositive ? '&uarr;' : '&darr;'}</span>
                        <span class="card-trend">${data.trend}</span>
                    </div>
                ` : ''}
                <div class="card-background-image">
                    <img src="${data.icon}" alt="${data.title} icon">
                </div>
            </div>
        `;
    });
    
    cardsHTML += '</div>';
    
    // Replace block content with our cards container
    block.innerHTML = cardsHTML;
}