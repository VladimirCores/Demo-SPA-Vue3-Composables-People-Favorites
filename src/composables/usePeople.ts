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

const list = ref<IPerson[]>(peopleState.data?.results);
const error = ref(null);

const getPersonIdFromUrl = (url:string) => {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
};

export default () => {
  const fetchPeople = () => {
    console.log('> usePeople -> onMounted: isLoading.value =', loading.isProgress);
    if (peopleFetchController) { peopleFetchController.abort(); }
    peopleFetchController = new AbortController();
    loading.isProgress = true;
    error.value = null;
    const url =  peopleState.data.next
      ? peopleState.data.next
      : import.meta.env.VITE_URL_PEOPLE;
    server.fetchPages(url,
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
        peopleState.data.next = pageResult.next;
        peopleState.data.count = pageResult.count;
        peopleState.data.results.push(...pageResult.results);
        loading.progress.final = Math.ceil(pageResult.count / 10);
        loading.progress.current = parseInt(pageResult.next?.split('=')[1] || `${loading.progress.current}`);
        list.value = peopleState.data?.results;
      },
    )
      .then(() => loading.isProgress = false)
      .catch((err) => error.value = err.toString())
      .finally(() => {
        peopleFetchController = undefined;
      });
  };

  return { list, error, loading, fetchPeople };
};
