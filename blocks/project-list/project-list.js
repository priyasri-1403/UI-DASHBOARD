/* eslint-disable no-underscore-dangle */
import { fetchAndStoreData, getStoredData, hasStoredData, storeProjectData } from '../../utils/datafetch.js';

export default function decorate(block) {
  const tableContainer = block.querySelector('div');
  const url = block.querySelector('.button-container a');

  if (!window._appData) {
    window._appData = {};
  }

  window._appData.dataSourceUrl = url;
  let regionList;

  const title = document.querySelector('.project-list-container p');
  title.className = 'page-heading';

  async function fetchProjectData() {
    // checking if we already have the data in storage
    const storageKey = 'projectData';
    const dataExists = await hasStoredData(storageKey);
    
    if (dataExists) {
      const data = await getStoredData(storageKey);
      console.log('Retrieved data from storage:', data);
      
      // Handle different data structures
      if (data.data) {
        return data.data;
      } else if (data.projectdata && data.projectdata.data) {
        return data.projectdata.data;
      }
    }
    
    try {
      console.log('Fetching data from URL using:', url);
      const jsondata = await fetchAndStoreData(url, storageKey);
      console.log('Fetched data:', jsondata);
      
      // Handle different data structures in the response
      if (jsondata.data) {
        return jsondata.data;
      } else if (jsondata.projectdata && jsondata.projectdata.data) {
        return jsondata.projectdata.data;
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      return [];
    }
  }

  tableContainer.innerHTML = `
       
        <div class="input-container">
        <div class ='search-container'>
        <img class = "search-icon" src="../../icons/search.svg"/>
             <input class = "search-input" type="text" id="searchBox" placeholder="Search" />
                 </div>
             <div class = "filter-box">
               <div class = 'column-filter-box'>
                  <img class = "filter-icon" src="../../icons/filter-list.svg"/>
               <div id='column-filters' class = "toggle-column hide">
               <span class ="toggle-title">Show/Hide Column</span>
               </div>
           </div>
           <select id="region-dropdown">
                 <option value="">Select Region</option>
               </select>
        </div>
      </div>
    <div id="my-grid" class="ag-theme-alpine" style="height: 580px;"></div>
    `;

  const searchBox = block.querySelector('#searchBox');
  const gridDiv = block.querySelector('#my-grid');
  const regionDropdown = block.querySelector('#region-dropdown');

  const nonHeaders = [
    'Skill/Framework',
    'Project Status Notes (Project)',
    'Status As on 3rd Mar 2025',
    'Status As on 10th Mar 2025',
    'Status As on 17th Mar 2025',
    'Total',
  ];

  function statuscellRenderer(params){
    const statusColor = {
      Green:"green",
      Red:"red",
      Yellow:"yellow",
      Ember:"orange",

    }
    const color = statusColor[params.value];
    const indicator = document.createElement("div");
    indicator.className="status-indicator";
    indicator.style.backgroundColor = color;
    return indicator;

  }

 
  fetchProjectData().then((data) => {
    console.log('Project data for grid:', data);
    
    if (!data || data.length === 0) {
      gridDiv.innerHTML = '<div class="no-data">No project data available</div>';
      return;
    }

    // Simple function to extract DR number from project name
    const getDRNumber = (projectName) => {
      const match = projectName.match(/DR\d+/);
      return match ? match[0] : '';
    };

    // Process data to clean project names by removing DR numbers and store original name
    const processedData = data.map(row => {
      if (row.Project) {
        const cleanName = row.Project.replace(/DR\d+/g, '').replace(/\|+/g, ' ').replace(/\s+/g, ' ').trim();
        return { ...row, Project: cleanName }; 
      }
      return row;
    });

    const columnDefs = Object.keys(processedData[0] || {}) 
      .filter((key) => !nonHeaders.includes(key))
      .map((key) => {
        const modifiedKey = key.includes(" (Project)")
         ? key.replace(" (Project)",'') 
         : key.includes("/ Team members")
          ? key.replace("/ Team members",'')
           : key;

        return {
        headerName: modifiedKey,
        field: key,
        sortable: true,
        filter: true,
        tooltipValueGetter: (params) => params.value,
        }
      });


    


      const regionIndex = columnDefs.findIndex((col) => col.field === 'Region (Project)');
      const managerIndex = columnDefs.findIndex((col) => col.field === 'Project manager (Project)');
      const [regionColumn] = columnDefs.splice(regionIndex, 1);
      columnDefs.splice(managerIndex, 0 , regionColumn);
      console.log(columnDefs);
      
      const originalData = JSON.parse(JSON.stringify(data));
      
      // Remove DR numbers from display data only
      data.forEach((row) => row.Project = row.Project.replace(/\|?\s*DR\d+/g,'').trim());
      console.log(data)
    const gridOptions = {
      columnDefs,
      rowData: processedData,
      rowSelection: 'single',
      pagination: true,
      paginationPageSizeSelector: [10,20,30],
      paginationPageSize: 10,
      getRowClass: () => 'clickable-row',
      tooltipShowDelay: 0,
      tooltipHideDelay:5000,
    };

    // eslint-disable-next-line no-undef
    const gridApi = agGrid.createGrid(gridDiv, gridOptions);
    const style = document.createElement('style');
    style.textContent = `
    .clickable-row {
      cursor: pointer;
    }
    .clickable-row:hover{
    background-color:var(--row-hover-color);
    }
    .ag-tooltip-custom, .ag-tooltip { /* Target default/custom tooltip classes */
      background-color: var(--toolpoint-color) !important;
      color: var(--toolpoint-txt-color) !important;
      border: 1px solid #555 !important;
      padding: 5px 10px !important;
      border-radius: 4px !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
      z-index: 9999 !important; /* Ensure tooltip is above other elements */
    }
    `;
    document.head.appendChild(style);
    gridApi.addEventListener('rowClicked', (event) => {
      const projectName = event.data.Project;
      if (projectName) {
        // Find the original data row with DR number from the preserved originalData array
        const originalRow = originalData.find(d => d.Project.includes(projectName));
        const drNumber = originalRow ? getDRNumber(originalRow.Project) : '';
        const drParam = drNumber ? `&dr-number=${drNumber}` : '';
        
        // Store the clicked project data before navigation
        storeProjectData(projectName, event.data);
        
        // Navigate to dashboard with project name and DR number
        window.location.href = `/project/dashboard?project-name=${encodeURIComponent(projectName)}${drParam}`;
      }
    });

    searchBox.addEventListener('input', () => gridApi.setGridOption('quickFilterText', document.getElementById('searchBox').value));
    regionList = [...new Set(processedData.map((row) => row['Region (Project)']))];
    regionList.forEach((region) => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      regionDropdown.appendChild(option);
    });

    regionDropdown.addEventListener('change', () => {
      const selectedRegion = regionDropdown.value;
      gridApi.setGridOption('rowData', selectedRegion ? processedData.filter((row) => row['Region (Project)'] === selectedRegion) : processedData);
    });

    const filterIcon = block.querySelector('.filter-icon');
    const columnCheckBox = document.getElementById('column-filters');
    const columnFilterBox = block.querySelector('.column-filter-box');

    filterIcon.addEventListener('click', () => columnCheckBox.classList.toggle('hide'));

    document.addEventListener('click', (e) => {
      if (!columnCheckBox.classList.contains('hide') && !columnFilterBox.contains(e.target)) {
        columnCheckBox.classList.add('hide');
      }
    });

    columnDefs.forEach((col) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'checkbox';
      checkbox.checked = !col.hide;
      checkbox.dataset.field = col.field;

      const label = document.createElement('label');
      label.textContent = col.headerName;

      const container = document.createElement('div');
      container.appendChild(label);
      container.appendChild(checkbox);
      container.className = 'project-filter-container-item';

      columnCheckBox.appendChild(container);
      checkbox.addEventListener('change', () => {
        gridApi.applyColumnState({
          state: [{ colId: col.field, hide: !checkbox.checked }],
          applyOrder: true,
        });
      });
    });
  });
}
