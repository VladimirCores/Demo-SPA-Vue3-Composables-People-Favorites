import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { IPeopleLoading, IPeopleResult, IPerson } from '~/interfaces';

import LocalKeys from '~/constants/localkeys.ts';

import { debounce } from '~/utils/utilsTimer.ts';

let peopleResult:IPeopleResult | undefined;
const peopleFavorites:boolean[] = JSON.parse(localStorage.getItem(LocalKeys.FAVORITE) || '[]');

const fetchPeople = (
  url: string,
  controller: AbortController,
  onProgress?: (data:IPeopleResult) => void,
):Promise<IPeopleResult | undefined> => {
  let finalResult:IPeopleResult | undefined;
  return new Promise((resolve, reject) => {
    const getPage = (url:string):Promise<IPeopleResult | undefined> =>
      fetch(url, {signal: controller.signal})
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<IPeopleResult>;
        })
        .then((result:IPeopleResult) => {
          const lastIndex = finalResult?.results.length || 0;
          result.results.forEach((item, index) => {
            item.favorite = !!peopleFavorites[lastIndex + index];
            // console.log('item.favorite', item.favorite);
          });
          if (!finalResult) {
            finalResult = result as IPeopleResult;
          } else {
            finalResult.next = result.next;
            finalResult.results.push(...result.results);
          }
          if (onProgress) onProgress(result);
          if (result.next) return getPage(result.next);
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
    fetchPeople(
      `${import.meta.env.VITE_URL_PEOPLE}/?search=${text}`,
      searchFetchController,
    )
      .then((data) => {
        console.log('> useSearch -> data:', data);
        if (!data) return;
        const cutFrom = import.meta.env.VITE_URL_PEOPLE.length;
        data.results?.forEach((item:IPerson) => {
          item.id = item.url.substring(cutFrom);
          console.log('> \titem.id:', item.id);
          return item;
        });
        result.value = data;
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

export function useFavorite() {
  const switchFavorite = (index:number, data?:IPerson | undefined) => {
    const item = peopleResult?.results[index] || data;
    console.log('> useFavorite -> switchFavorite:', item);
    if (!item) return;
    item.favorite = !item.favorite;
    peopleFavorites[index] = item.favorite;
    localStorage.setItem(LocalKeys.FAVORITE, JSON.stringify(peopleFavorites));
  };
  return { favorites: peopleFavorites, switchFavorite };
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
      fetchPeople(
        import.meta.env.VITE_URL_PEOPLE,
        peopleFetchController,
        (result) => {
          loading.progress.current += 1;
          loading.progress.final = Math.ceil(result.count / result.results.length);
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
