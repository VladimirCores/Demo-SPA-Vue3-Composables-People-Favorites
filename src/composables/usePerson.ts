import { onUnmounted } from 'vue';

import { peopleState } from './states';

let personFetchController:AbortController | undefined;

const { favorites } = peopleState;

export default () => {
  const fetchById = (id:number) => {
    if (personFetchController) { personFetchController.abort(); }
    personFetchController = new AbortController();

    return fetch(
      `${import.meta.env.VITE_URL_PEOPLE}/${id}`,
      {signal: personFetchController.signal})
      .then((resp) => resp.json())
      .then((result) => {
        result.favorite = favorites[id];
        result.id = id;
        return result;
      })
      .then((result) => (personFetchController = undefined, result));
  };

  onUnmounted(() => {
    if (personFetchController) { personFetchController.abort(); }
    personFetchController = undefined;
  });

  return { fetchById };
};
