import { onMounted, reactive, ref } from 'vue';

import { IPeopleLoading, IPeopleResult, IPerson } from '~/interfaces';

let state:IPeopleResult | undefined;

const fetchPeople = (onProgress:(data:IPeopleResult) => void) =>
  new Promise((resolve, reject) => {
    const getPage = (path:string):Promise<void> =>
      fetch(path)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<IPeopleResult>;
        })
        .then((result:IPeopleResult) => {
          if (!state) {
            state = result as IPeopleResult;
          } else {
            state.next = result.next;
            state.results.push(...result.results);
          }
          onProgress(result);
          if (state.next) return getPage(state.next);
        });
    getPage('https://swapi.dev/api/people')
      .then(resolve)
      .catch(reject);
});

export function usePeople() {
  const list = ref<IPerson[] | undefined>(state?.results);
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
          list.value = state?.results;
        })
        .catch((errorText) => error.value = errorText)
        .finally(() => {
          loading.isProgress = false;
        });
    }
  });

  return { list, error, loading };
}
