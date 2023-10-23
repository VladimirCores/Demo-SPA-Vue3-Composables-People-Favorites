import { createApp } from 'vue';
import { createWebHashHistory, createRouter } from 'vue-router';


import App from '~/App.vue';
import FavoritesPage from '~/pages/favorites/index.vue';
import IndexPage from '~/pages/index.vue';
import PeopleIdPage from '~/pages/people/id.vue';
import PeoplePage from '~/pages/people/index.vue';

import routes from '~/constants/routes';

import '~/assets/styles/app.css';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { ...routes.HOME, component: IndexPage },
    { ...routes.PEOPLE, component: PeoplePage },
    { ...routes.PEOPLE_ID, component: PeopleIdPage },
    { ...routes.FAVORITES, component: FavoritesPage },
  ],
});

createApp(App)
  .use(router)
  .mount('#app');
