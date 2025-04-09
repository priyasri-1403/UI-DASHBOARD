export default function decorate(block) {
    // Create container for the grid
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('team-details-wrapper');

    const teamData = [
        {
            name: "John Doe",
            role: "Developer",
            email: "john.doe@example.com",
        },
        {
            name: "Jane Smith",
            role: "Designer",
            email: "jane.smith@example.com",
        },
        {
            name: "Mike Johnson",
            role: "Project Manager",
            email: "mike.johnson@example.com",
        },
        {
            name: "Lisa Wang",
            role: "Tester",
            email: "lisa.wang@example.com",
        },
        {
            name: "Alex Brown",
            role: "DevOps Engineer",
            email: "alex.brown@example.com",
        },
        {
            name: "Emily Jones",
            role: "Data Scientist",
            email: "emily.jones@example.com",
        },
        {
            name: "Charles Taylor",
            role: "System Administrator",
            email: "charles.taylor@example.com",
        },
        {
            name: "Sarah Miller",
            role: "Marketing Specialist",
            email: "sarah.miller@example.com",
        },
        {
            name: "Olivia White",
            role: "HR Manager",
            email: "olivia.white@example.com",
        }
    ];

    // Create the header with controls
    const headerHTML = `
        <div class="grid-header">
            <div class="grid-title">
                <h2>Team Members</h2>
            </div>
            <div class="grid-controls">
                <div class="column-visibility-wrapper">
                    <button class="control-btn column-visibility" title="Show/Hide Columns">
                        <img class = "filter-icon" src="../../icons/filter-list.svg"/>                    </button>
                    <div class="columns-menu">
                        <div class="columns-menu-header">Show Columns</div>
                        <div class="columns-list"></div>
                    </div>
                </div>
                <button class="control-btn refresh" title="Refresh">
                    <svg class="refresh-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                        <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                    </svg>
                </button>
            </div>
        </div>
        <div id="teamGrid" class="ag-theme-alpine-dark" style="width: 100%;"></div>
    `;

    gridContainer.innerHTML = headerHTML;

    // Clear existing content and append the new grid
    block.textContent = '';
    block.appendChild(gridContainer);

    const gridDiv = block.querySelector("#teamGrid");
    const refreshBtn = block.querySelector(".refresh");
    const columnVisibilityBtn = block.querySelector(".column-visibility-wrapper .control-btn");
    const columnsMenu = block.querySelector(".columns-menu");
    const columnsList = block.querySelector(".columns-list");

    // Function to update column visibility menu
    function updateColumnVisibilityMenu() {
        // Get all columns except checkbox
        const columns = columnDefs.filter(col => col.field);
        
        let menuHTML = '';
        columns.forEach(colDef => {
            menuHTML += `
                <div class="column-item">
                    <label>${colDef.headerName}</label>
                    <input type="checkbox" class="checkbox" data-field="${colDef.field}" ${!colDef.hide ? 'checked' : ''}>
                </div>
            `;
        });
        
        columnsList.innerHTML = menuHTML;

        // Add event listeners to checkboxes after they are created
        const checkboxes = columnsList.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (gridApi) {
                    gridApi.applyColumnState({
                        state: [{ colId: checkbox.dataset.field, hide: !checkbox.checked }],
                        applyOrder: true
                    });
                    gridApi.sizeColumnsToFit();
                }
            });
        });
    }

    // Column visibility toggle
    columnVisibilityBtn.addEventListener("click", () => {
        columnsMenu.classList.toggle('show');
        if (columnsMenu.classList.contains('show')) {
            updateColumnVisibilityMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!columnsMenu.contains(e.target) && !columnVisibilityBtn.contains(e.target)) {
            columnsMenu.classList.remove('show');
        }
    });

    // Function to generate column definitions from data
    function generateColumnDefs(data) {
        const columnDefs = [];
        const isMobile = window.innerWidth < 768;
        
        const fields = Object.keys(data[0]);
        fields.forEach(field => {
            const colDef = {
                headerName: field.charAt(0).toUpperCase() + field.slice(1),
                field: field,
                width: isMobile ? 130 : 150,
                hide: isMobile && (field === 'department' || field === 'mobile'),
                minWidth: isMobile ? 100 : 120
            };
            columnDefs.push(colDef);
        });

        return columnDefs;
    }

    const columnDefs = generateColumnDefs(teamData);

    const gridOptions = {
        columnDefs: columnDefs,
        rowData: teamData,
        pagination: true,
        paginationPageSize: window.innerWidth < 768 ? 5 : 10,
        paginationPageSizeSelector: window.innerWidth < 768 ? [5, 10, 20] : [10, 20, 50, 100],
        domLayout: 'autoHeight',
        defaultColDef: {
            sortable: false,
            filter: false,
            resizable: true,
            menuTabs: []
        },
        rowHeight: window.innerWidth < 768 ? 50 : 60,
        headerHeight: window.innerWidth < 768 ? 40 : 48,
        onGridReady: (params) => {
            gridApi = params.api;
            params.api.sizeColumnsToFit();
            updateColumnVisibilityMenu();
        }
    };

    // Create the grid
    let gridApi = agGrid.createGrid(gridDiv, gridOptions);

    
    // Handle window resize
    window.addEventListener('resize', () => {
        gridApi.sizeColumnsToFit();
    });
}
