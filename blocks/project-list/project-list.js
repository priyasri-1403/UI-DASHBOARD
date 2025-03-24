export default function decorate(block) {
  const tableContainer = block.querySelector('div');
  const url = block.querySelector('.button-container a');

  const lastElement = block.lastElementChild;
  const regions = lastElement.querySelector('p').textContent;
  const regionList = regions.split(',').map((region) => region.trim());

  lastElement.remove();

  setTimeout(() => {
    const navButton = document.querySelector('.nav-hamburger button');
    const projectContainer = block.closest('.project-list-container');
    const nav = document.getElementById('nav');

    if (navButton && projectContainer) {
      // Initial check
      if (nav.getAttribute('aria-expanded') === 'true') {
        projectContainer.classList.add('table-right-shift');
      }
      navButton.addEventListener('click', () => {
        projectContainer.classList.toggle('table-right-shift');
      });
    }
  }, 150);

  const title = document.querySelector('.project-list-container p');
  title.className = 'page-heading';

  async function fetchProjectData() {
    try {
      const response = await fetch(url);
      const jsondata = await response.json();

      return jsondata.data;
    } catch (error) {
      console.error('Error fetching data:', error);
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
    'Project Status Notes (Project)',
    'Status As on 3rd Mar 2025',
    'Status As on 10th Mar 2025',
    'Status As on 17th Mar 2025',
  ];

  fetchProjectData().then((data) => {
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

    const gridOptions = {
      columnDefs,
      rowData: data,
    };

    // eslint-disable-next-line no-undef
    // agGrid.createGrid(gridDiv, gridOptions);
    // eslint-disable-next-line no-undef
    const gridApi = agGrid.createGrid(gridDiv, gridOptions);

    searchBox.addEventListener('input', () => gridApi.setGridOption('quickFilterText', document.getElementById('searchBox').value));

    regionList.forEach((region) => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      regionDropdown.appendChild(option);
    });

    regionDropdown.addEventListener('change', () => {
      const selectedRegion = regionDropdown.value;
      gridApi.setGridOption('rowData', selectedRegion ? data.filter((row) => row['Region (Project)'] === selectedRegion) : data);
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
