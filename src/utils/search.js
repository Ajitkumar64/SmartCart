export function searchProducts(products, query) {
    const q = query.trim().toLowerCase();
    if (!q) {
        return products;
    }
    return products.filter(p => [p.title, p.brand, p.category, p.description].some(field => !!field && field.toLowerCase().includes(q)));
}
export const filterByCategory = (products, category) => (category ? products.filter(p => p.category === category) : products);
export function filterByPriceRange(products, range) {
    if (range.min === null && range.max === null) {
        return products;
    }
    return products.filter(p => {
        const price = p.price * (1 - (p.discountPercentage || 0) / 100);
        return ((range.min === null || price >= range.min) &&
            (range.max === null || price <= range.max));
    });
}
export function sortProducts(products, sort) {
    switch (sort) {
        case 'price_asc':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price_desc':
            return [...products].sort((a, b) => b.price - a.price);
        case 'rating_desc':
            return [...products].sort((a, b) => b.rating - a.rating);
        default:
            return products;
    }
}
