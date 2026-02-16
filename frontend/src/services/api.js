import axios from 'axios';
import { supabase } from '../supabaseClient';

const api = axios.create({
    // Ensure the baseURL points to the /api prefix
    baseURL: import.meta.env.VITE_API_URL
        ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
        : '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

// Handle global errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
        });

        if (error.response?.status === 401) {
            console.error('Unauthorized! Signing out...');
            await supabase.auth.signOut();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default api;

