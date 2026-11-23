const STORAGE_KEY = 'warehouse-items';

export const getItems = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const saveItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const addItem = (item) => saveItems([...getItems(), item]);

export const removeItem = (id) => saveItems(getItems().filter((item) => item.id !== id));
