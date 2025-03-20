import { fetchAndStoreData, getStoredData, hasStoredData } from '../../utils/datafetch.js';

export default function decorate(block) {
    const tableContainer = block.querySelector("div");
    const urlElement = block.querySelector(".button-container a");
    const url = urlElement ? urlElement.href : null;
    
    // Store URL in global app data
    if (!window._appData) window._appData = {};
    window._appData.dataSourceUrl = url;

    // Initialize table UI
    tableContainer.innerHTML = `
        <input type="text" id="searchBox" placeholder="Search" />
        <div id="myGrid" class="ag-theme-alpine" style="height: 400px; width: 600px;"></div>
    `;

    const searchBox = block.querySelector("#searchBox");
    const gridDiv = block.querySelector("#myGrid");
    const nonHeaders = ["Region (Project)", "Project Status Notes (Project)", 
        "Status As on 3rd Mar 2025", "Status As on 10th Mar 2025", "Status As on 17th Mar 2025"];

    // Load and display data
    loadProjectData();
    
    async function loadProjectData() {
        try {
            const data = await fetchProjectData();
            if (!data || data.length === 0) {
                tableContainer.innerHTML = '<p>No project data available</p>';
                return;
            }
            
            createGrid(data);
        } catch (error) {
            console.error("Error loading project data:", error);
            tableContainer.innerHTML = '<p>Error loading project data</p>';
        }
    }
    
    async function fetchProjectData() {
        const storageKey = 'projectData';
        
        if (hasStoredData(storageKey)) {
            const data = getStoredData(storageKey);
            return data.data;
        }
        
        if (!url) return [];
        
        const jsondata = await fetchAndStoreData(url, storageKey);
        return jsondata.data;
    }
    
    function createGrid(data) {
        // Create column definitions
        const columnDefs = Object.keys(data[0])
            .filter(key => !nonHeaders.includes(key))
            .map(key => ({
                headerName: key,
                field: key,
                sortable: true,
                filter: true
            }));
        
        // Configure grid
        const gridOptions = {
            columnDefs: columnDefs,
            rowData: data,
            rowSelection: 'single',
            getRowClass: () => 'clickable-row'
        };
        
        // Create grid
        const gridApi = agGrid.createGrid(gridDiv, gridOptions);
        
        // Add styles for clickable rows
        addRowStyles();
        
        // Add click handler
        gridApi.addEventListener('rowClicked', handleRowClick);
        
        // Add search functionality
        searchBox.addEventListener("input", () => {
            gridApi.setGridOption("quickFilterText", searchBox.value);
        });
    }
    
    function addRowStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .clickable-row { cursor: pointer; }
            .clickable-row:hover { background-color: #f0f0f0 !important; }
        `;
        document.head.appendChild(style);
    }
    
    function handleRowClick(event) {
        // Find project name in the row data
        const projectKey = Object.keys(event.data).find(key => key.includes('Project'));
        const projectName = projectKey ? event.data[projectKey] : null;
        
        if (projectName) {
            // Create URL with encoded parameters
            const dataUrlParam = url ? `&data-source=${encodeURIComponent(url)}` : '';
            window.location.href = `/project/dashboard?project-name=${encodeURIComponent(projectName)}${dataUrlParam}`;
        }
    }
}
