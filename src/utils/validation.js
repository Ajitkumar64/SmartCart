export function validateCheckout(d) {
    const e = {};
    if (d.fullName.trim().length < 2) {
        e.fullName = 'Enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) {
        e.email = 'Enter a valid email address.';
    }
    const digits = d.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
        e.phone = 'Enter a valid phone number (10-15 digits).';
    }
    if (d.address.trim().length < 5) {
        e.address = 'Enter your delivery address.';
    }
    if (d.city.trim().length < 2) {
        e.city = 'Enter your city.';
    }
    if (!/^[A-Za-z0-9 -]{4,10}$/.test(d.postalCode.trim())) {
        e.postalCode = 'Enter a valid postal code.';
    }
    return e;
}
