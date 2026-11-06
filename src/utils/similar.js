/** Products in the same category as `current`, excluding it, de-duplicated. */
export function getSimilarProducts(candidates, current, limit = 8) {
    const seen = new Set();
    const result = [];
    for (const p of candidates) {
        if (p.id === current.id || p.category !== current.category || seen.has(p.id)) {
            continue;
        }
        seen.add(p.id);
        result.push(p);
        if (result.length >= limit) {
            break;
        }
    }
    return result;
}
