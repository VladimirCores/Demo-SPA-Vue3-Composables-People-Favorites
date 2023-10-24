import { IPerson } from '~/interfaces';

const getPersonIdFromUrl = (url:string) => {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
};

const setupPersonsID = (list:IPerson[]) => {
  list.forEach((item:IPerson) => {
    item.id = getPersonIdFromUrl(item.url);
  });
  return list;
};

export {
  getPersonIdFromUrl,
  setupPersonsID,
};
