import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const api = axios.create({
    baseURL: process.env.URL_BACKEND || 'http://127.0.0.1:3000/auth'
});

export default api;