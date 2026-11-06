import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../constants/config';
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: { Accept: 'application/json' },
});
