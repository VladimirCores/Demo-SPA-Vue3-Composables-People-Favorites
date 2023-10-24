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

  const switchFavorite = (index:number, inputPerson?:IPerson) => {
    const person = getPersonFromLocalStorage(index) || inputPerson;
    console.log('> useFavorite -> switchFavorite:', index, person);
    if (!person) return;
    const wasFavorite = person.favorite;
    console.log('> \t wasFavorite =', wasFavorite);
    person.favorite = !wasFavorite;
    peopleFavorites[index] = person.favorite;
    localStorage.setItem(LocalKeys.FAVORITE, JSON.stringify(peopleFavorites));
    const itemLocalKey = getFavoriteItemLocalKey(index);
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
