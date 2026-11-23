import { getItems, removeItem } from '../storage.js';
import { createElement, createHeader, createTable } from '../components.js';

const compare = (key) => (a, b) => {
  if (!isNaN(a[key]) && !isNaN(b[key])) {
    return +a[key] - +b[key];
  }

  return String(a[key]).localeCompare(String(b[key]));
};

const sortItems = (items, key) => [...items].sort(compare(key));

const COLUMNS = [
  { key: 'name', title: 'Название' },
  { key: 'shelf', title: 'Полка' },
  { key: 'weight', title: 'Вес' },
  { key: 'storageTime', title: 'Время хранения' }
];

export const render = ({ navigate }) => {
  const page = createElement('div');
  let items = getItems();

  const handleDelete = (id) => {
    const isRemoved = removeItem(id);

    if (isRemoved) {
      items = getItems();
      table.update(items);
    }
  };

  const table = createTable({
    columns: COLUMNS,
    actions: { delete: handleDelete },
    onSort: (key) => {
      items = sortItems(items, key);
      table.update(items);
    }
  });

  table.update(items);

  page.append(
    createHeader('Склад', { text: 'Добавить запись', onClick: () => navigate('add') }),
    table.el
  );

  return page;
};
