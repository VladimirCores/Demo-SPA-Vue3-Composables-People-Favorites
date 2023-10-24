import { reactive, ref } from 'vue';

import { IPeopleLoading, IPerson } from '~/interfaces';

import { peopleState } from './states';
import useServer from './useServer.ts';

const server = useServer();

let peopleFetchController:AbortController | undefined;

const loading:IPeopleLoading = reactive<IPeopleLoading>({
  isProgress: false,
  progress: {
    current: 1,
    final: -1,
  },
});

const list = ref<IPerson[] | undefined>(peopleState.data?.results);
const error = ref(null);

const getPersonIdFromUrl = (url:string) => {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
};

export default () => {
  peopleFetchController = undefined;

  const fetchPeople = () => {
    console.log('> usePeople -> onMounted: isLoading.value =', loading.isProgress);
    if (peopleFetchController) { peopleFetchController.abort(); }
    peopleFetchController = new AbortController();
    loading.isProgress = true;
    server.fetchPages(
      import.meta.env.VITE_URL_PEOPLE,
      peopleFetchController,
      (pageResult, finalResult) => {
        console.log('> usePeople -> fetchPages - onProgress =', pageResult, peopleState.favorites);
        const lastIndex = finalResult?.results?.length || 0;
        pageResult.results.forEach((item, index) => {
          item.position = lastIndex + index;
          item.id = getPersonIdFromUrl(item.url);
          item.favorite = peopleState.favorites[item.id];
          // console.log('\t' + item.name + ' position =', position, '|', item.id);
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
  };

  return { list, error, loading, fetchPeople };
};
