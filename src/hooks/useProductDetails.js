import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { STORAGE_KEYS } from '../constants/config';
import { getProductById, getProductsByCategory, } from '../services/productService';
import { getJSON, setJSON } from '../services/storage';
import { getErrorMessage } from '../utils/errors';
import { getSimilarProducts } from '../utils/similar';
export function useProductDetails(id, initial) {
    const initialRef = useRef(initial);
    const [product, setProduct] = useState(initial);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offline, setOffline] = useState(false);
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getProductById(id, controller.signal);
                if (!active) {
                    return;
                }
                setProduct(data);
                setOffline(false);
                await setJSON(STORAGE_KEYS.productPrefix + id, data);
            }
            catch (e) {
                if (!active || axios.isCancel(e)) {
                    return;
                }
                const cached = await getJSON(STORAGE_KEYS.productPrefix + id);
                if (!active) {
                    return;
                }
                if (cached) {
                    setProduct(cached);
                    setOffline(true);
                }
                else if (initialRef.current) {
                    setProduct(initialRef.current);
                    setOffline(true);
                }
                else {
                    setError(getErrorMessage(e));
                }
            }
            finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();
        return () => {
            active = false;
            controller.abort();
        };
    }, [id, attempt]);
    return { product, loading, error, offline, reload: () => setAttempt(a => a + 1) };
}

export function useSimilarProducts(product, pool) {
    const [items, setItems] = useState([]);
    const poolRef = useRef(pool);
    poolRef.current = pool;
    const id = product?.id;
    const category = product?.category;
    useEffect(() => {
        if (id === undefined || !category) {
            return;
        }
        const current = { id, category };
        const controller = new AbortController();
        getProductsByCategory(category, { limit: 12 }, controller.signal)
            .then(r => setItems(getSimilarProducts(r.products, current)))
            .catch(e => {
                if (!axios.isCancel(e)) {
                    setItems(getSimilarProducts(poolRef.current, current));
                }
            });
        return () => controller.abort();
    }, [id, category]);
    return items;
}
