export default function decorate(block) {
  console.log(document); 
  
  const navBox = document.querySelector('.nav-wrapper');
  console.log(navBox);
  // if (navBox.querySelector('[aria-expanded = "true"]')) {
  //   document.querySelector('.project-list-container').classList.add('table-right-shift');
  // }

  const tableContainer = block.querySelector('div');
  const url = block.querySelector('.button-container a');

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
        </div>
        <div id="myGrid" class="ag-theme-alpine" style="height: 580px;"></div>
    `;

  const searchBox = block.querySelector('#searchBox');
  const gridDiv = block.querySelector('#myGrid');
  const nonHeaders = ['Region (Project)',
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
  });
}
