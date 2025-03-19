export default function decorate(block) {
    const tableContainer = block.querySelector("div");
    const url = block.querySelector(".button-container a");

    console.log(url);

    async function fetchProjectData() {
        try {
            const response = await fetch(url);
            const jsondata = await response.json();
            console.log(jsondata.data);
            return jsondata.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
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
        console.log(columnDefs);
        

    

        const gridOptions = {
            columnDefs: columnDefs,
            rowData: data
        };

        console.log("Checking AG Grid:", agGrid);
        // agGrid.createGrid(gridDiv, gridOptions);
       const gridApi = agGrid.createGrid(gridDiv, gridOptions);


        

        searchBox.addEventListener("input",() =>
            // agGrid.setQuickFilter(searchBox.value)
        gridApi.setGridOption("quickFilterText", document.getElementById("searchBox").value)
        )
    })
}
