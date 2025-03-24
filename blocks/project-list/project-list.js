export default function decorate(block) {

  const tableContainer = block.querySelector('div');
  const url = block.querySelector('.button-container a');
  
  const lastElement = block.lastElementChild;
  const regions = lastElement.querySelector('p').textContent;
  const regionList = regions.split(',').map((region) => region.trim());
  console.log(regionList);

  lastElement.remove();
  
  setTimeout(() => {
    const navButton = document.querySelector('.nav-hamburger button');
    const projectContainer = block.closest('.project-list-container');
    const nav = document.getElementById('nav');
    
    if (navButton && projectContainer) {
      // Initial check
      if(nav.getAttribute('aria-expanded') === 'true'){
        projectContainer.classList.add('table-right-shift');
      }
      navButton.addEventListener('click', () => {
        projectContainer.classList.toggle("table-right-shift");      
      
      });
    }
  }, 150);

  //   console.log(url);

  const title = document.querySelector('.project-list-container p');
  title.className = 'page-heading';

  async function fetchProjectData() {
    try {
      const response = await fetch(url);
      const jsondata = await response.json();
      //   console.log(jsondata.data);
      return jsondata.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  tableContainer.innerHTML = `
       
        <div class="input-container">
           <input type="text" id="searchBox" placeholder="Search" />
           <img class = "search-icon" src="../../icons/search.svg"/>
           <div class = "filter-box">
             <select id="regionDropdown">
              <option value="">Select Region</option>
             </select>

           <div class = 'column-filterBox'> <img src="../../icons/filter-list.svg"/>
            <div id='column-filters' class = "toggle-column hide">Show/Hide column</div>
           </div>
          </div>
          </div>
        <div id="myGrid" class="ag-theme-alpine" style="height: 580px;"></div>
    `;

  const searchBox = block.querySelector('#searchBox');
  const gridDiv = block.querySelector('#myGrid');
  const regionDropdown = block.querySelector('#regionDropdown');

  const nonHeaders = [
    'Project Status Notes (Project)',
    'Status As on 3rd Mar 2025',
    'Status As on 10th Mar 2025',
    'Status As on 17th Mar 2025',
  ];

  fetchProjectData().then((data) => {
    console.log(data)
    if (data.length === 0) {
      console.warn('No data available for AG Grid.');
      return;
    }

    const columnDefs = Object.keys(data[0])
      .filter((key) => !nonHeaders.includes(key))
      .map((key) => ({
        headerName: key,
        field: key,
        sortable: true,
        filter: true,
      }));
    // console.log(columnDefs);

    const gridOptions = {
      columnDefs,
      rowData: data,
    };

    // eslint-disable-next-line no-undef
    // console.log('Checking AG Grid:', agGrid);
    // agGrid.createGrid(gridDiv, gridOptions);
    // eslint-disable-next-line no-undef
    const gridApi = agGrid.createGrid(gridDiv, gridOptions);

    searchBox.addEventListener('input', () => gridApi.setGridOption('quickFilterText', document.getElementById('searchBox').value));

    regionList.forEach(region => {
      const option = document.createElement("option");
      option.value=region;
      option.textContent = region;
      regionDropdown.appendChild(option);
    })
   
    regionDropdown.addEventListener('change',() =>{
      const selectedRegion = regionDropdown.value;
      gridApi.setGridOption("rowData",selectedRegion ? data.filter(row => row["Region (Project)"] === selectedRegion) : data)
    })

    const columnFilterBox = document.querySelector('.column-filterBox');
    const columnCheckBox = document.getElementById('column-filters');
    // columnFilterBox.addEventListener('click',columnCheckBox.classList.toggle('hide'))

    columnDefs.forEach((col) => {
      const checkbox = document.createElement('input');
      checkbox.type='checkbox';
      checkbox.checked=!col.hide; 
      checkbox.dataset.field = col.field;

      const label = document.createElement('label');
      label.textContent = col.headerName;
      label.appendChild(checkbox);
      columnCheckBox.appendChild(label);

      checkbox.addEventListener('change',() =>{
        gridApi.applyColumnState({
          state: [{ colId: col.field, hide: !checkbox.checked }],
          applyOrder: true,
        });
      });

    });


  });
 
 
  
}
