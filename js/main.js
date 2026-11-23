import { createElement, createPreloader } from './components.js';

const PRELOADER_DELAY = 400;

const routes = {
  list: () => import('./pages/list.js'),
  add: () => import('./pages/add.js')
};

const app = document.querySelector('.app');
let renderId = 0;

const navigate = (route) => {
  location.hash = route === 'list' ? '' : route;
};

const getRoute = () => (location.hash.slice(1) in routes ? location.hash.slice(1) : 'list');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const renderPage = () => {
  const currentId = ++renderId;

  app.replaceChildren(createPreloader());

  Promise.all([routes[getRoute()](), delay(PRELOADER_DELAY)])
    .then(([page]) => {
      if (currentId === renderId) {
        app.replaceChildren(page.render({ navigate }));
      }
    })
    .catch((error) => {
      console.error(error);
      app.replaceChildren(createElement('div', { className: 'error', text: error.message }));
    });
};

addEventListener('hashchange', renderPage);
renderPage();
