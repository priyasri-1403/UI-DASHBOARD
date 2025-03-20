/**
 * Utility functions for fetching and storing data using the window object
 */

export const fetchAndStoreData = async (url, key, options = {}) => {
  try {
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


