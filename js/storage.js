const STORAGE_KEY = 'warehouse-items';

export const getItems = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const saveItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const addItem = (items, item) => saveItems([...items, item]);
