import { api } from './api';

export const getProducts = async (params = {}, signal) => {
    const response = await api.get('/products', { params, signal });
    return response.data;
};

export const searchProductsApi = async (q, params = {}, signal) => {
    const response = await api.get('/products/search', {
        params: { q, ...params },
        signal,
    });
    return response.data;
};

export const getProductsByCategory = async (category, params = {}, signal) => {
    const response = await api.get(
        `/products/category/${encodeURIComponent(category)}`,
        { params, signal }
    );
    return response.data;
};

export const getCategoryList = async (signal) => {
    const response = await api.get('/products/category-list', { signal });
    return response.data;
};

export const getProductById = async (id, signal) => {
    const response = await api.get(`/products/${id}`, { signal });
    return response.data;
};