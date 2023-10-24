import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { IPeopleLoading, IPeopleResult, IPerson } from '~/interfaces';

import LocalKeys from '~/constants/localkeys.ts';

import { debounce } from '~/utils/utilsTimer.ts';

const getPersonIdFromUrl = (url:string) => {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
};

const setupPersonsID = (list:IPerson[]) => {
  list.forEach((item:IPerson) => {
    item.id = getPersonIdFromUrl(item.url);
  });
  return list;
};

const getFavoriteItemLocalKey = (id:number) => LocalKeys.PERSON_BY_ID.replace('$id', id.toString());
const getPersonFromLocalStorage = (id:number) => {
  const localKey = getFavoriteItemLocalKey(id);
  const personRaw = localStorage.getItem(localKey)!;
  console.log('> useFavorite -> getPersonFromLocalStorage:', localKey);
  return personRaw ? JSON.parse(personRaw) as IPerson : null;
};
const getFilteredFavorites = () => peopleFavorites.reduce((acc:IPerson[], curr, index) => (curr && acc.push(getPersonFromLocalStorage(index)!), acc), []);

let peopleResult:IPeopleResult | undefined;
const peopleFavorites:boolean[] = JSON.parse(localStorage.getItem(LocalKeys.FAVORITE) || '[]');

const fetchPages = (
  url: string,
  controller: AbortController,
  onProgress?: (pageResult:IPeopleResult, finalResult:IPeopleResult | undefined) => void,
):Promise<IPeopleResult | undefined> => {
  let finalResult:IPeopleResult | undefined;
  return new Promise((resolve, reject) => {
    const getPage = (url:string):Promise<IPeopleResult | undefined> =>
      fetch(url, {signal: controller.signal})
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<IPeopleResult>;
        })
        .then((pageResult:IPeopleResult) => {
          if (onProgress) onProgress(pageResult, finalResult);
          if (!finalResult) {
            finalResult = pageResult as IPeopleResult;
          } else {
            finalResult.next = pageResult.next;
            finalResult.results.push(...pageResult.results);
          }
          if (pageResult.next) return getPage(pageResult.next);
          return finalResult;
        });
    getPage(url)
      .then(resolve)
      .catch((error) => error.code !== 20 && reject(error) || resolve(undefined)); // name === 'AbortError'
  });
};


let searchFetchController:AbortController | undefined;
let peopleFetchController:AbortController | undefined;
let personFetchController:AbortController | undefined;

export function useSearch() {
  const result = ref<IPeopleResult | undefined>();
  const error = ref(null);
  const loading = ref<boolean>(false);

  searchFetchController = undefined;

  const search =  debounce((text:unknown) => {
    console.log('> useSearch -> text:', text);
    if (searchFetchController) { searchFetchController.abort(); }
    searchFetchController = new AbortController();
    result.value = undefined;
    error.value = null;
    if ((text as string).length === 0) return;
    loading.value = true;
    fetchPages(
      `${import.meta.env.VITE_URL_PEOPLE}/?search=${text}`,
      searchFetchController,
    )
      .then((finalResult) => {
        console.log('> useSearch -> data:', finalResult);
        if (!finalResult) return;
        const { results } = finalResult;
        if (results) setupPersonsID(results);
        result.value = finalResult;
        loading.value = false;
        searchFetchController = undefined;
      })
      .catch((err) => error.value = err);
  }, 1000);

  onUnmounted(() => {
    if (searchFetchController) { searchFetchController.abort(); }
  });

  return { result, error, loading, search };
}

export function useFavorites() {


  const list = ref<IPerson[]>([]);

  console.log('> useFavorite -> list:', list.value);

  const switchFavorite = (index:number, data?:IPerson | undefined) => {
    const person = peopleResult?.results[index] || data || getPersonFromLocalStorage(index);
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
}

export function usePerson() {
  const fetchById = (id:number) => {
    if (peopleResult?.results[id]) return Promise.resolve(peopleResult?.results[id]);
    if (personFetchController) { personFetchController.abort(); }
    personFetchController = new AbortController();
    return fetch(
      `${import.meta.env.VITE_URL_PEOPLE}/${id + 1}`,
      {signal: personFetchController.signal})
      .then((resp) => resp.json())
      .then((result) => (result.favorite = peopleFavorites[id], result))
      .then((result) => (personFetchController = undefined, result));
  };

  onUnmounted(() => {
    if (personFetchController) { personFetchController.abort(); }
    personFetchController = undefined;
  });

  return { fetchById };
}

export function usePeople() {
  const list = ref<IPerson[] | undefined>(peopleResult?.results);
  const error = ref(null);
  const loading = reactive<IPeopleLoading>({
    isProgress: (list.value?.length || 0) === 0,
    progress: {
      current: 1,
      final: -1,
    },
  });

  peopleFetchController = undefined;

  onMounted(() => {
    console.log('> usePeople -> onMounted: isLoading.value =', loading.isProgress);
    if (loading.isProgress) {
      if (peopleFetchController) { peopleFetchController.abort(); }
      peopleFetchController = new AbortController();
      fetchPages(
        import.meta.env.VITE_URL_PEOPLE,
        peopleFetchController,
        (pageResult, finalResult) => {
          console.log('> usePeople -> fetchPages - onProgress =', pageResult);
          const lastIndex = finalResult?.results?.length || 0;
          pageResult.results.forEach((item, index) => {
            const position = lastIndex + index;
            item.position = position;
            item.favorite = peopleFavorites[position];
            item.id = getPersonIdFromUrl(item.url);
            console.log('\t' + item.name + ' position =', position, '|', item.id);
          });
          loading.progress.current += 1;
          loading.progress.final = Math.ceil(pageResult.count / pageResult.results.length);
        },
      )
        .then((result) => { peopleResult = result; })
        .then(() => list.value = peopleResult?.results)
        .catch((err) => error.value = err)
        .finally(() => {
          loading.isProgress = false;
          peopleFetchController = undefined;
        });
    }
  });

  onUnmounted(() => {
    if (peopleFetchController) {
      peopleFetchController.abort();
    }
  });

  return { list, error, loading };
}
