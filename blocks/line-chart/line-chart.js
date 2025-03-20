import { getStoredData, fetchAndStoreData } from '../../utils/datafetch.js';

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
    const dataSourceUrl = urlParams.has('data-source') ? urlParams.get('data-source') : null;
    
    console.log('Project name from URL:', projectName);
    console.log('Data source URL from URL params:', dataSourceUrl);
    console.log('Current window._appData state:', window._appData);
    
    console.log(projectName);
    let projectData = getStoredData('projectData');
    
    if (projectData) {
        console.log('Found project data in window._appData');
        processProjectData(projectData, projectName, container);
        return;
    }
    
    if (dataSourceUrl) {
        fetchAndStoreData(dataSourceUrl, 'projectData')
            .then(data => {
                console.log(data);
                processProjectData(data, projectName, container);
            })
    } else {
        console.log('No data source URL provided, trying to find one in the page');
        findAndFetchData(container, projectName);
    }
}

function findAndFetchData(container, projectName) {
    let dataUrl = null;
    
    if (window._appData && window._appData.dataSourceUrl) {
        dataUrl = window._appData.dataSourceUrl;
        console.log('Using data source URL from window._appData:', dataUrl);
    }
    
    fetchAndStoreData(dataUrl, 'projectData')
        .then(data => {
            console.log(data);
            processProjectData(data, projectName, container);
        })
}

function processProjectData(projectData, projectName, container) {
    
    let currentProjectData = findProject(projectData.data, projectName);
    
        container.innerHTML = '<h3>Project Data</h3>';
        const dataList = document.createElement('ul');
        for (const [key, value] of Object.entries(currentProjectData)) {
            const item = document.createElement('li');
            item.textContent = `${key}: ${value}`;
            dataList.appendChild(item);
        }
        container.appendChild(dataList);
        
        console.log(projectName);
}

function findProject(data, projectName) {
    let project = data.find(item => {
        for (const key in item) {
            if (key.includes('Project') && item[key] === projectName) {
                return true;
            }
        }
        return false;
    });
    return project;
}