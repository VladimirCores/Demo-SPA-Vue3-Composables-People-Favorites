import { IPeopleState } from '~/interfaces';

import LocalKeys from '~/constants/localkeys.ts';

const state:IPeopleState = {
  data: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  favorites: JSON.parse(localStorage.getItem(LocalKeys.FAVORITE) || '[]'),
};

export default state;
