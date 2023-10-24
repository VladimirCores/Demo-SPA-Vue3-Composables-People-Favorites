import { IPeopleState } from '~/interfaces';

import LocalKeys from '~/constants/localkeys.ts';

const state:IPeopleState = {
  data: undefined,
  favorites: JSON.parse(localStorage.getItem(LocalKeys.FAVORITE) || '[]'),
};

export default state;
