export interface IRoute {
  name: string
  path: string
}
export default {
  HOME: { name:'Home', path: '/' },
  PEOPLE: { name:'People', path: '/people' },
  PEOPLE_ID: { name:'Person', path: '/people/:id' },
  FAVORITES: { name:'Favorites', path: '/favorites' },
};
