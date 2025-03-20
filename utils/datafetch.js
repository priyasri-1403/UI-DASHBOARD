/**
 * Utility functions for fetching and storing data using the window object
 */

export const fetchAndStoreData = async (url, key, options = {}) => {
  try {
    if (!url) {
      throw new Error('No URL provided for data fetching');
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store the data in the window object
    if (!window._appData) {
      window._appData = {};
    }
    
    window._appData[key] = data;
    
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

export const getStoredData = (key) => {
  if (!window._appData || !window._appData[key]) {
    return null;
  }
  
  return window._appData[key];
};

export const hasStoredData = (key) => {
  return Boolean(window._appData && window._appData[key]);
};

export const fetchProjectData = async (url, projectName, storageKey = null) => {

  const projectKey = `project_${projectName}`;
  
  if (hasStoredData(projectKey)) {
    return getStoredData(projectKey);
  }
  
  if (hasStoredData(storageKey)) {
    const allData = getStoredData(storageKey);
    const project = findProjectByName(allData.data, projectName);
    
    if (project) {
      if (!window._appData) window._appData = {};
      window._appData[projectKey] = { data: project };
      return { data: project };
    }
  }
  const allData = await fetchAndStoreData(url, storageKey );
  const project = findProjectByName(allData.data, projectName);

  if (!window._appData) window._appData = {};
  window._appData[projectKey] = { data: project };
  
  return { data: project };
};

export const findProjectByName = (data, projectName) => {
  return data.find(item => {
    for (const key in item) {
      if (key.includes('Project') && item[key] === projectName) {
        return true;
      }
    }
    return false;
  });
};



