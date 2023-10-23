import { onMounted, reactive, ref } from 'vue';

import { IPeopleLoading, IPeopleResult, IPerson } from '~/interfaces';

import LocalKeys from '~/constants/localkeys.ts';

let peopleResult:IPeopleResult | undefined;
const peopleFavorite:boolean[] = JSON.parse(localStorage.getItem(LocalKeys.FAVORITE) || '[]');

const fetchPeople = (onProgress:(data:IPeopleResult) => void) =>
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
          onProgress(result);
          // if (result.next) return getPage(result.next);
        });
    getPage(import.meta.env.VITE_URL_PEOPLE)
      .then(resolve)
      .catch(reject);
});

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
      fetchPeople((result) => {
        loading.progress.current += 1;
        loading.progress.final = Math.ceil(result.count / result.results.length);
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

  const switchFavorite = (index:number) => {
    if (!list.value) return;
    const item = list.value[index];
    console.log('> usePeople -> switchFavorite:', item);
    item.favorite = !item.favorite;
    peopleFavorite[index] = item.favorite;
    localStorage.setItem(LocalKeys.FAVORITE, JSON.stringify(peopleFavorite));
  };

  return { list, error, loading, switchFavorite };
}
