import { fetchAndStoreData, getStoredData, hasStoredData } from '../../utils/datafetch.js';

export default function decorate(block) {
    const tableContainer = block.querySelector("div");
    const url = block.querySelector(".button-container a");

    console.log(url);

    // Ensure window._appData is initialized
    if (!window._appData) {
        window._appData = {};
    }

    // Store the data source URL globally so other components can use it
    window._appData.dataSourceUrl = url;
    console.log("Set data source URL in window._appData:", url);

    async function fetchProjectData() {

            // Check if we already have the data in storage
            const storageKey = 'projectData';
            if (hasStoredData(storageKey)) {
                console.log("Using cached project data from getStoredData");
                const data = getStoredData(storageKey);
                return data.data;
            }
            
            const jsondata = await fetchAndStoreData(url, storageKey);
            return jsondata.data;
    }

    tableContainer.innerHTML = `
        <input type="text" id="searchBox" placeholder="Search" />
        <div id="myGrid" class="ag-theme-alpine" style="height: 400px; width: 600px;"></div>
    `;

    const searchBox = block.querySelector("#searchBox");
    const gridDiv = block.querySelector("#myGrid");
    const nonHeaders = ["Region (Project)",
        "Project Status Notes (Project)",   
        "Status As on 3rd Mar 2025",
        "Status As on 10th Mar 2025",
        "Status As on 17th Mar 2025"
          ]

    fetchProjectData().then(data => {
        if (data.length === 0) {
            console.warn("No data available for AG Grid.");
            return;
        }
          
        const columnDefs = Object.keys(data[0]).filter((key)=>
            !nonHeaders.includes(key)
        ).map((key) => ({
            headerName: key,
            field: key,
            sortable: true,
            filter: true
        }));
        
        const gridOptions = {
            columnDefs: columnDefs,
            rowData: data,
            rowSelection: 'single',
            getRowClass: () => 'clickable-row'
        };

        const gridApi = agGrid.createGrid(gridDiv, gridOptions);
        
        const style = document.createElement('style');
        style.textContent = `
            .clickable-row {
                cursor: pointer;
            }
            .clickable-row:hover {
                background-color: #f0f0f0 !important;
            }
        `;
        document.head.appendChild(style);
        
        gridApi.addEventListener('rowClicked', (event) => {
            const projectNameColumn = columnDefs.find(col => 
                col.field.includes('Project')
            )?.field || columnDefs[0].field;
            
            const projectName = event.data[projectNameColumn];
            if (projectName) {
                const dataUrlParam = url ? `&data-source=${encodeURIComponent(url)}` : '';
                window.location.href = `/project/dashboard?project-name=${encodeURIComponent(projectName)}${dataUrlParam}`;
            }
        });
        
        searchBox.addEventListener("input",() =>
            gridApi.setGridOption("quickFilterText", document.getElementById("searchBox").value)
        )
    })
}
