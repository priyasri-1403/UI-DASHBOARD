import {  fetchProjectData} from '../../utils/datafetch.js';

export default function decorate(block) {
    const container = document.createElement('div');
    container.id = 'dataContainer';
    container.innerHTML = '<h3>Project Data</h3><p>Loading project data...</p>';
    block.textContent = '';
    block.appendChild(container);
    
    if (!window._appData) {
        window._appData = {};
        console.log('Initialized window._appData in line-chart');
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    let projectName = urlParams.has('project-name') ? urlParams.get('project-name') : '';
    const dataSourceUrl = urlParams.has('data-source') ? urlParams.get('data-source') : '';
    
    console.log('Project name from URL:', projectName);
    console.log('Data source URL from URL params:', dataSourceUrl);
    
    if (projectName) {
        if (dataSourceUrl) {
            fetchProjectData(dataSourceUrl, projectName, 'projectData')
                .then(data => {
                    displayProjectData(data.data, container);
                })
                .catch(error => {
                    console.error('Error fetching project data:', error);
                    container.innerHTML = '<h3>Project Data</h3><p>Error loading project data</p>';
                });
        } else {
            console.log('No data source URL provided, trying to find one in the page');
            findAndFetchSpecificProject(container, projectName);
        }
    } else {
        container.innerHTML = '<h3>Project Data</h3><p>No project specified</p>';
    }
}

function findAndFetchSpecificProject(container, projectName) {
    let dataUrl = null;
    
    if (window._appData && window._appData.dataSourceUrl) {
        dataUrl = window._appData.dataSourceUrl;
        console.log('Using data source URL from window._appData:', dataUrl);
        
        fetchProjectData(dataUrl, projectName, 'projectData')
            .then(data => {
                displayProjectData(data.data, container);
            })
            .catch(error => {
                console.error('Error fetching project data:', error);
                container.innerHTML = '<h3>Project Data</h3><p>Error loading project data</p>';
            });
    } else {
        container.innerHTML = '<h3>Project Data</h3><p>No data source available</p>';
    }
}

function displayProjectData(projectData, container) {
    if (!projectData) {
        container.innerHTML = '<h3>Project Data</h3><p>Project not found</p>';
        return;
    }
    
    container.innerHTML = '<h3>Project Data</h3>';
    const dataList = document.createElement('ul');
    for (const [key, value] of Object.entries(projectData)) {
        const item = document.createElement('li');
        item.textContent = `${key}: ${value}`;
        dataList.appendChild(item);
    }
    container.appendChild(dataList);
}