import { addItem } from '../storage.js';
import { createElement } from '../components.js';

const FIELDS = [
  { name: 'name', placeholder: 'Название', type: 'text' },
  { name: 'shelf', placeholder: 'Полка', type: 'text' },
  { name: 'weight', placeholder: 'Вес', type: 'number', min: '0', step: 'any' },
  { name: 'storageTime', placeholder: 'Время хранения', type: 'date' }
];

const validators = {
  name: { validate: (value) => value.trim() !== '', message: 'Введите название' },
  shelf: {
    validate: (value) => /^[A-Za-zА-Яа-я]\d{1,3}$/.test(value.trim()),
    message: 'Полка — буква и номер, например B14'
  },
  weight: { validate: (value) => +value > 0, message: 'Вес должен быть больше нуля' },
  storageTime: { validate: (value) => !isNaN(Date.parse(value)), message: 'Укажите время хранения' }
};

export const render = ({ navigate }) => {
  const page = createElement('div');
  page.append(createElement('h1', { className: 'page-title page-title--center', text: 'Добавить запись' }));

  const form = createElement('form', { className: 'form', attrs: { novalidate: '' } });
  const errorEl = createElement('p', { className: 'form-error' });

  FIELDS.forEach(({ name, placeholder, ...attrs }) => {
    form.append(createElement('input', {
      className: 'form-input',
      attrs: { name, placeholder, required: '', ...attrs }
    }));
  });

  form.append(
    errorEl,
    createElement('button', { className: 'button button--primary', text: 'Добавить запись', attrs: { type: 'submit' } })
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const failed = Object.entries(validators)
      .find(([name, { validate }]) => !validate(formData.get(name) ?? ''));

    if (failed) {
      const [name, { message }] = failed;
      errorEl.textContent = message;
      form.querySelector(`[name="${name}"]`).focus();
      return;
    }

    const item = { id: Date.now(), ...Object.fromEntries(formData) };
    item.weight = +item.weight;

    const isAdded = addItem(item);

    if (!isAdded) {
      errorEl.textContent = 'Не удалось сохранить запись';
      return;
    }

    navigate('list');
  });

  page.append(form);

  return page;
};
