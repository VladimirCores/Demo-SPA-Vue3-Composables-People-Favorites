import { onMounted, reactive, ref } from 'vue';

import { IPeopleLoading, IPeopleResult, IPerson } from '~/interfaces';

import LocalKeys from '~/constants/localkeys.ts';

import { debounce } from '~/utils/utilsTimer.ts';

let peopleResult:IPeopleResult | undefined;
const peopleFavorite:boolean[] = JSON.parse(localStorage.getItem(LocalKeys.FAVORITE) || '[]');

export function useSearch() {
  const result = ref<IPeopleResult | undefined>();
  const error = ref(null);
  const loading = ref<boolean>(false);

  let controller:AbortController | undefined;

  const search =  debounce((text:unknown) => {
    console.log('> useSearch -> text:', text);
    if (controller) { controller.abort(); }
    controller = new AbortController();
    loading.value = true;
    result.value = undefined;
    const path = `${import.meta.env.VITE_URL_PEOPLE}/?search=${text}`;
    fetch(path, {signal: controller.signal})
      .then((resp) => resp.json())
      .then((data) => {
        console.log('> useSearch -> data:', data);
        const cutFrom = import.meta.env.VITE_URL_PEOPLE.length;
        data.results?.forEach((item:IPerson) => {
          item.id = item.url.substring(cutFrom);
          console.log('> \titem.id:', item.id);
          return item;
        });
        result.value = data;
      })
      .catch((err) => error.value = err)
      .finally(() => loading.value = false);
  }, 1000);

  return { result, error, loading, search };
}

export function useFavorite() {
  const switchFavorite = (index:number) => {
    if (!peopleResult?.results) return;
    const item = peopleResult.results[index];
    console.log('> useFavorite -> switchFavorite:', item);
    item.favorite = !item.favorite;
    peopleFavorite[index] = item.favorite;
    localStorage.setItem(LocalKeys.FAVORITE, JSON.stringify(peopleFavorite));
  };
  return { switchFavorite };
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

  onMounted(() => {
    console.log('> usePeople -> onMounted: isLoading.value =', loading.isProgress);
    if (loading.isProgress) {
      new Promise((resolve, reject) => {
        const getPage = (path:string):Promise<void> =>
          fetch(path)
            .then((res) => {
              if (!res.ok) throw new Error(res.statusText);
              return res.json() as Promise<IPeopleResult>;
            })
            .then((result:IPeopleResult) => {
              const lastIndex = peopleResult?.results.length || 0;
              result.results.forEach((item, index) => {
                item.favorite = !!peopleFavorite[lastIndex + index];
              });
              if (!peopleResult) {
                peopleResult = result as IPeopleResult;
              } else {
                peopleResult.next = result.next;
                peopleResult.results.push(...result.results);
              }
              loading.progress.current += 1;
              loading.progress.final = Math.ceil(result.count / result.results.length);
              // if (result.next) return getPage(result.next);
            });
        getPage(import.meta.env.VITE_URL_PEOPLE)
          .then(resolve)
          .catch(reject);
      })
        .then(() => {
          list.value = peopleResult?.results;
        })
        .catch((err) => error.value = err)
        .finally(() => {
          loading.isProgress = false;
        });
    }
  });

  return { list, error, loading };
}
