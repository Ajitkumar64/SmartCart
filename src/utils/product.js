export const toSnapshot = (p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    discountPercentage: p.discountPercentage,
    thumbnail: p.thumbnail,
    stock: p.stock,
    category: p.category,
    rating: p.rating,
    brand: p.brand,
});
export const formatCategory = (slug) => slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
