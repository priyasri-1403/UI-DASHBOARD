// IndexedDB Storage Manager
const StorageManager = (() => {
  const DB_NAME = 'projectDatabase';
  const DB_VERSION = 1;
  const STORE_NAME = 'projectStore';
  
  // Open database connection
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  };
  
  // Store data in IndexedDB
  const storeData = async (key, data) => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.put({ key, value: data });
        
        request.onsuccess = () => resolve(true);
        request.onerror = (event) => {
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      return false;
    }
  };
  
  // Retrieve data from IndexedDB
  const getData = async (key) => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.get(key);
        
        request.onsuccess = (event) => {
          const result = event.target.result;
          resolve(result ? result.value : null);
        };
        
        request.onerror = (event) => {
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      return null;
    }
  };
  
  // Check if key exists in IndexedDB
  const hasData = async (key) => {
    const data = await getData(key);
    return data !== null;
  };
  
  // Delete data from IndexedDB
  const removeData = async (key) => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.delete(key);
        
        request.onsuccess = () => resolve(true);
        request.onerror = (event) => {
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      return false;
    }
  };
  
  // Get all keys from IndexedDB
  const getAllKeys = async () => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.getAllKeys();
        
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        
        request.onerror = (event) => {
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      return [];
    }
  };
  
  // Clear all data from IndexedDB
  const clearDatabase = async () => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.clear();
        
        request.onsuccess = () => resolve(true);
        request.onerror = (event) => {
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      return false;
    }
  };
  
  return {
    storeData,
    getData,
    hasData,
    removeData,
    getAllKeys,
    clearDatabase
  };
})();

// Helper functions for projects
const ProjectHelpers = {
  // Find a project by name in an array of projects
  findProjectByName: (projects, projectName) => {
    if (!Array.isArray(projects)) return null;
    
    return projects.find(project => {
      for (const key in project) {
        if (key.includes('Project') && project[key] === projectName) {
          return true;
        }
      }
      return false;
    });
  },
  
  // Extract DR number from project name
  extractDRNumber: (projectName) => {
    if (!projectName) return null;
    
    // Match DR followed by digits
    const drMatch = projectName.match(/DR(\d+)/);
    if (drMatch && drMatch[0]) {
      return drMatch[0]; // Return the full DR number (e.g., DR3910334)
    }
    
    return null;
  }
};

// API Functions
export const fetchAndStoreData = async (url, key, options = {}) => {
  try {
    // If URL is not provided, just return data from storage if it exists
    if (!url) {
      const storedData = await StorageManager.getData(key);
      if (storedData) {
        return storedData;
      }
      return null;
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store data in IndexedDB
    await StorageManager.storeData(key, data);
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const getStoredData = async (key) => {
  return await StorageManager.getData(key);
};

export const hasStoredData = async (key) => {
  return await StorageManager.hasData(key);
};

export const storeProjectData = async (projectName, projectData) => {
  const projectKey = `project_${projectName}`;
  return await StorageManager.storeData(projectKey, { data: projectData });
};

export const getProjectData = async (projectName) => {
  const projectKey = `project_${projectName}`;
  
  // First try to get the specific project data
  const specificProject = await StorageManager.getData(projectKey);
  if (specificProject) {
    return specificProject;
  }
  
  // If not found, try to extract from the full project list
  const allProjects = await StorageManager.getData('projectData');
  if (allProjects && allProjects.data && Array.isArray(allProjects.data)) {
    const project = ProjectHelpers.findProjectByName(allProjects.data, projectName);
    if (project) {
      // Also store this project individually for faster access next time
      await storeProjectData(projectName, project);
      return { data: project };
    }
  }
  
  return null;
};

export const fetchProjectData = async (url, projectName, storageKey = 'projectData') => {
  // First check if we already have this project's data stored
  const storedProject = await getProjectData(projectName);
  if (storedProject) {
    return storedProject;
  }
  
  // If not, check if we have all projects data cached
  if (await hasStoredData(storageKey)) {
    const allData = await getStoredData(storageKey);
    const project = ProjectHelpers.findProjectByName(allData.data, projectName);
    
    if (project) {
      // Store this project individually for faster access next time
      await storeProjectData(projectName, project);
      return { data: project };
    }
  }
  
  // Extract DR number from project name for API call
  const drNumber = ProjectHelpers.extractDRNumber(projectName);
  
  // If we have a DR number, we can try to fetch project-specific data
  if (drNumber) {
    const apiUrl = `https://main--ui-dashboard--priyasri-1403.aem.page/weeklyprojectstatusupdates.json?${drNumber}`;
    try {
      const projectData = await fetchAndStoreData(apiUrl, `${drNumber}_data`);
      if (projectData) {
        return { data: projectData };
      }
    } catch (error) {
      console.error('Error fetching project data by DR number:', error);
    }
  }
  
  // Since we're only using IndexedDB, we won't fetch from URL if data isn't found
  return { data: null };
};

// Export the clearDatabase function
export const clearDatabase = async () => {
  return await StorageManager.clearDatabase();
};
