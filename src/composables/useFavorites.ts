import { onMounted, ref } from 'vue';

import { IPerson } from '~/interfaces';

import LocalKeys from '~/constants/localkeys.ts';

import { peopleState } from './states';

const { favorites: peopleFavorites } = peopleState;

const getFavoriteItemLocalKey = (id:number) => LocalKeys.PERSON_BY_ID.replace('$id', id.toString());

const getPersonFromLocalStorage = (id:number) => {
  const localKey = getFavoriteItemLocalKey(id);
  const personRaw = localStorage.getItem(localKey)!;
  console.log('> useFavorite -> getPersonFromLocalStorage:', localKey);
  return personRaw ? JSON.parse(personRaw) as IPerson : null;
};

const getFilteredFavorites = () => peopleFavorites
  .reduce((acc:IPerson[], curr:boolean, index:number) =>
    (curr && acc.push(getPersonFromLocalStorage(index)!), acc), []);

export default () => {
  const list = ref<IPerson[]>([]);

  console.log('> useFavorite -> list:', list.value);

  const switchFavorite = (person:IPerson) => {
    console.log('> useFavorite -> switchFavorite:', person);
    const wasFavorite = person.favorite;
    console.log('> \t wasFavorite =', wasFavorite);
    person.favorite = !wasFavorite;
    peopleFavorites[person.id!] = !wasFavorite;
    localStorage.setItem(LocalKeys.FAVORITE, JSON.stringify(peopleFavorites));
    const itemLocalKey = getFavoriteItemLocalKey(person.id!);
    if (wasFavorite) {
      localStorage.removeItem(itemLocalKey);
    } else {
      localStorage.setItem(itemLocalKey, JSON.stringify(person));
    }
    list.value = getFilteredFavorites();
    console.log('> \t list.value =', list.value);
  };

  onMounted(() => {
    console.log('> useFavorite -> onMounted');
    list.value = getFilteredFavorites();
  });

  return { list, switchFavorite };
};
