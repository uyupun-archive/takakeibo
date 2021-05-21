import {Category} from '../models/category';

export const convertIdToNameOfCategory = (categories: Array<Category>, categoryId: number): string => {
  return (categories.find((category) => category.id === categoryId))?.name || ''
};
