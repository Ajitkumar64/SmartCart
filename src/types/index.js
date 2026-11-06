/**
 * Shared data shapes (documentation only – JavaScript has no runtime types).
 * Reference them in JSDoc, e.g. `@param {import('../types').Product} product`.
 *
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} category           
 * @property {number} price
 * @property {number} discountPercentage
 * @property {number} rating
 * @property {number} stock
 * @property {string} [brand]
 * @property {string[]} [tags]
 * @property {string} [availabilityStatus]
 * @property {string} thumbnail
 * @property {string[]} images
 *
 * @typedef {Pick<Product,'id'|'title'|'price'|'discountPercentage'|'thumbnail'|'stock'|'category'|'rating'|'brand'>} ProductSnapshot
 *
 * @typedef {Object} CartItem
 * @property {ProductSnapshot} product
 * @property {number} quantity
 *
 * @typedef {Object} CustomerDetails
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string} city
 * @property {string} postalCode
 *
 * @typedef {Object} Order
 * @property {string} id            
 * @property {string} date         
 * @property {CartItem[]} items
 * @property {number} itemCount
 * @property {number} subtotal
 * @property {number} discount
 * @property {number} total
 * @property {CustomerDetails} customer
 *
 * @typedef {'default'|'price_asc'|'price_desc'|'rating_desc'} SortOption
 * @typedef {{min: number|null, max: number|null}} PriceRange
 */
export {};
