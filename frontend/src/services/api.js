import axios from 'axios';
import { supabase } from '../supabaseClient';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
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

// Handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized! Signing out...');
            await supabase.auth.signOut();
            window.location.reload(); // Force refresh to Auth page
        }
        return Promise.reject(error);
    }
);

export default api;
