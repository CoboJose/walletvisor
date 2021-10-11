const email = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const password = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/);

export default { email, password };
