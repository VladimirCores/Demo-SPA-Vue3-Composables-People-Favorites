import { onUnmounted, ref } from 'vue';

import { IPeopleData } from '~/interfaces';

import { setupPersonsID } from '~/utils/utilsPerson.ts';
import { debounce } from '~/utils/utilsTimer.ts';

import useServer from './useServer.ts';

const server = useServer();

let searchFetchController:AbortController | undefined;

export default () => {
  const result = ref<IPeopleData | undefined>();
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
    server.fetchPages(
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
};