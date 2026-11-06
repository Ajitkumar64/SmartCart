import { STORAGE_KEYS } from '../constants/config';
import { getJSON, setJSON } from './storage';
export const readProductsCache = (key) => getJSON(STORAGE_KEYS.productsCachePrefix + key);
export const writeProductsCache = (key, page) => setJSON(STORAGE_KEYS.productsCachePrefix + key, page);
