import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { IPeopleLoading, IPerson } from '~/interfaces';

import { peopleState } from './states';
import useServer from './useServer.ts';

const server = useServer();

let peopleFetchController:AbortController | undefined;

const getPersonIdFromUrl = (url:string) => {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
};

export default () => {
  const list = ref<IPerson[] | undefined>(peopleState.data?.results);
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
      server.fetchPages(
        import.meta.env.VITE_URL_PEOPLE,
        peopleFetchController,
        (pageResult, finalResult) => {
          console.log('> usePeople -> fetchPages - onProgress =', pageResult);
          const lastIndex = finalResult?.results?.length || 0;
          pageResult.results.forEach((item, index) => {
            const position = lastIndex + index;
            item.position = position;
            item.favorite = peopleState.favorites[position];
            item.id = getPersonIdFromUrl(item.url);
            console.log('\t' + item.name + ' position =', position, '|', item.id);
          });
          loading.progress.current += 1;
          loading.progress.final = Math.ceil(pageResult.count / pageResult.results.length);
        },
      )
        .then((result) => { peopleState.data = result; })
        .then(() => list.value = peopleState.data?.results)
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
};
