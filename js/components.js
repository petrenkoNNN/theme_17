export const createElement = (tag, { className, text, dataset, attrs } = {}) => {
  const el = document.createElement(tag);

  if (className) {
    el.className = className;
  }

  if (text !== undefined) {
    el.textContent = text;
  }

  Object.assign(el.dataset, dataset);

  Object.entries(attrs ?? {}).forEach(([name, value]) => el.setAttribute(name, value));

  return el;
};


export const createPreloader = () => {
  const el = createElement('div', { className: 'preloader' });
  el.append(createElement('div', { className: 'preloader-spinner' }));

  return el;
};

export const createHeader = (title, button) => {
  const el = createElement('div', { className: 'page-header' });
  el.append(createElement('h1', { className: 'page-title', text: title }));

  if (button) {
    const buttonEl = createElement('button', {
      className: 'button button--primary',
      text: button.text,
      attrs: { type: 'button' }
    });
    buttonEl.addEventListener('click', button.onClick);
    el.append(buttonEl);
  }

  return el;
};

export const createTable = ({ columns, actions, onSort }) => {
  const table = createElement('table', { className: 'table' });
  const headRow = createElement('tr');
  const body = createElement('tbody');

  columns.forEach(({ key, title }) => {
    headRow.append(createElement('th', {
      className: 'table-head-cell',
      text: title,
      dataset: { sort: key }
    }));
  });
  headRow.append(createElement('th', { className: 'table-head-cell' }));

  const head = createElement('thead');
  head.append(headRow);
  table.append(head, body);

  table.addEventListener('click', (event) => {
    const sortEl = event.target.closest('[data-sort]');

    if (sortEl) {
      onSort(sortEl.dataset.sort);
      return;
    }

    const actionEl = event.target.closest('[data-action]');

    if (actionEl) {
      const { action, id } = actionEl.dataset;
      actions[action]?.(+id);
    }
  });

  const update = (rows) => {
    if (rows.length === 0) {
      const cell = createElement('td', { className: 'table-empty', text: 'Склад пуст', attrs: { colspan: columns.length + 1 } });
      const row = createElement('tr');
      row.append(cell);
      body.replaceChildren(row);
      return;
    }

    const rowEls = rows.map((item) => {
      const row = createElement('tr');

      columns.forEach(({ key }) => {
        row.append(createElement('td', { className: 'table-cell', text: item[key] }));
      });

      const actionCell = createElement('td', { className: 'table-cell table-cell--action' });
      actionCell.append(createElement('button', {
        className: 'button button--danger',
        text: 'Удалить',
        dataset: { action: 'delete', id: item.id },
        attrs: { type: 'button' }
      }));
      row.append(actionCell);

      return row;
    });

    body.replaceChildren(...rowEls);
  };

  return { el: table, update };
};
