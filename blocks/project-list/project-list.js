export default function decorate(block){
   const tableContainer =  block.querySelector("div");
   const url = block.querySelector(".button-container a");

   console.log(url);
   const gridOptions = {
    columnDefs: [],
    rowData: [],
    defaultColDef: {
        sortable:true,
        filter:true
    }
  
};

   async function fetchProjectData(){
        const response =  await fetch(url);
        const data = await response.json();
        console.log(data);
        const tableHeaders = Object.keys(data[0]).map(key=>{
            field:key
        })
        gridOptions.api.setColumnDefs(tableHeaders);
        gridOptions.api.setRowData(data);
   }
   


   tableContainer.innerHTML=`
   <h2>AG Grid Table with Hardcoded Data</h2>
    <div id="myGrid" class="ag-theme-alpine" style="height: 400px; width: 600px;"></div>
   `;



const gridDiv = block.querySelector("#myGrid");
// console.log(gridDiv)
console.log("Checking AG Grid:", agGrid);
agGrid.createGrid(gridDiv, gridOptions);
fetchProjectData();
}