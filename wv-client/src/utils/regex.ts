const email = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const password = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/);
const hexColor = new RegExp(/^#[0-9A-F]{6}$/i);

export default { email, password, hexColor };
