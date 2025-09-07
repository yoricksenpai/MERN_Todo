/// <reference types="vite/client" />

const isProd = import.meta.env.PROD;
const API_URL: string = isProd ? 'https://todo-backend-two-sandy.vercel.app/' : 'http://localhost:3000';

export default API_URL;