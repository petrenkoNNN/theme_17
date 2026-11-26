import { addItem, getItems } from '../storage.js';
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

const createInput = ({ name, placeholder, ...attrs }) => createElement('input', {
  className: 'form-input',
  attrs: { name, placeholder, required: '', ...attrs }
});

const createSubmitButton = () => createElement('button', {
  className: 'button button--primary',
  text: 'Добавить запись',
  attrs: { type: 'submit' }
});

const createForm = (errorEl) => {
  const form = createElement('form', { className: 'form', attrs: { novalidate: '' } });

  form.append(...FIELDS.map(createInput), errorEl, createSubmitButton());

  return form;
};

const findInvalidField = (formData) => Object.entries(validators)
  .find(([name, { validate }]) => !validate(formData.get(name) ?? ''));

const showFieldError = (form, errorEl, [name, { message }]) => {
  errorEl.textContent = message;
  form.querySelector(`[name="${name}"]`).focus();
};

const createItem = (formData) => ({
  id: Date.now(),
  ...Object.fromEntries(formData),
  weight: +formData.get('weight')
});

const handleSubmit = (event, { form, errorEl, navigate }) => {
  event.preventDefault();

  const formData = new FormData(form);
  const invalidField = findInvalidField(formData);

  if (invalidField) {
    showFieldError(form, errorEl, invalidField);
    return;
  }

  const isAdded = addItem(getItems(), createItem(formData));

  if (!isAdded) {
    errorEl.textContent = 'Не удалось сохранить запись';
    return;
  }

  navigate('list');
};

export const render = ({ navigate }) => {
  const page = createElement('div');
  const errorEl = createElement('p', { className: 'form-error' });
  const form = createForm(errorEl);

  form.addEventListener('submit', (event) => handleSubmit(event, { form, errorEl, navigate }));

  page.append(
    createElement('h1', { className: 'page-title page-title--center', text: 'Добавить запись' }),
    form
  );

  return page;
};
