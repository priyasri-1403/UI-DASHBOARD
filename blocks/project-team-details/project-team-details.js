export default function decorate(block) {
    // Create container for the grid
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('team-details-wrapper');

    const teamData = [
        {
            name: "John Doe",
            role: "Developer",
            department: "Java",
            mobile: "1234567890",
            email: "john.doe@example.com",
            gender: "Male",
        },
        {
            name: "Jane Smith",
            role: "Designer",
            department: "UI/UX",
            mobile: "2345678901",
            email: "jane.smith@example.com",
            gender: "Female"
        },
        {
            name: "Mike Johnson",
            role: "Project Manager",
            department: "Management",
            mobile: "3456789012",
            email: "mike.johnson@example.com",
            gender: "Male"
        },
        {
            name: "Lisa Wang",
            role: "Tester",
            department: "Quality Assurance",
            mobile: "4567890123",
            email: "lisa.wang@example.com",
            gender: "Female"
        },
        {
            name: "Alex Brown",
            role: "DevOps Engineer",
            department: "Operations",
            mobile: "5678901234",
            email: "alex.brown@example.com",
            gender: "Male"
        },
        {
            name: "Emily Jones",
            role: "Data Scientist",
            department: "Data Analytics",
            mobile: "6789012345",
            email: "emily.jones@example.com",
            gender: "Female"
        },
        {
            name: "Charles Taylor",
            role: "System Administrator",
            department: "IT Support",
            mobile: "7890123456",
            email: "charles.taylor@example.com",
            gender: "Male"
        },
        {
            name: "Sarah Miller",
            role: "Marketing Specialist",
            department: "Marketing",
            mobile: "8901234567",
            email: "sarah.miller@example.com",
            gender: "Female"
        },
        {
            name: "Olivia White",
            role: "HR Manager",
            department: "Human Resources",
            mobile: "9012345678",
            email: "olivia.white@example.com",
            gender: "Female"
        }
    ];

    // Create the header with controls
    const headerHTML = `
        <div class="grid-header">
            <div class="grid-title">
                <h2>Employees</h2>
                <div class="search-container">
                    <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="searchBox" placeholder="Search" />
                </div>
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
                <button class="control-btn download" title="Download">
                    <svg class="download-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
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

    const searchBox = block.querySelector("#searchBox");
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
        
        const fields = Object.keys(data[0]);
        fields.forEach(field => {
            const colDef = {
                headerName: field.charAt(0).toUpperCase() + field.slice(1),
                field: field,
                width: 150,
                hide: false
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
        paginationPageSize: 10,
        paginationPageSizeSelector: [10, 20, 50, 100],
        domLayout: 'autoHeight',
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
            suppressMenu: true,
            suppressFiltersToolPanel: true,
            menuTabs: []
        },
        rowHeight: 60,
        headerHeight: 48,
        suppressContextMenu: true,
        suppressCellSelection: true,
        suppressMenuHide: true,
        icons: {
            menu: false
        },
        onGridReady: (params) => {
            gridApi = params.api;
            params.api.sizeColumnsToFit();
            // Initialize column visibility menu
            updateColumnVisibilityMenu();
        }
    };

    // Create the grid
    let gridApi = agGrid.createGrid(gridDiv, gridOptions);

    // Add search functionality
    searchBox.addEventListener("input", () => {
        gridApi.setGridOption("quickFilterText", searchBox.value);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        gridApi.sizeColumnsToFit();
    });
}
