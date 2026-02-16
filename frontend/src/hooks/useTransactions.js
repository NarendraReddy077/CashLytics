import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// ── Queries ────────────────────────────────────────────────
export function useTransactions() {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await api.get('/transactions/');
            return data;
        },
    });
}

export function useWeeklyReport(referenceDate) {
    return useQuery({
        queryKey: ['weeklyReport', referenceDate],
        queryFn: async () => {
            const params = referenceDate ? { reference_date: referenceDate } : {};
            const { data } = await api.get('/transactions/weekly-report', { params });
            return data;
        },
    });
}

// ── Mutations ──────────────────────────────────────────────
export function useCreateTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => api.post('/transactions/', payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['transactions'] });
            qc.invalidateQueries({ queryKey: ['weeklyReport'] });
        },
    });
}

export function useUpdateTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...payload }) => api.put(`/transactions/${id}`, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['transactions'] });
            qc.invalidateQueries({ queryKey: ['weeklyReport'] });
        },
    });
}

export function useDeleteTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/transactions/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['transactions'] });
            qc.invalidateQueries({ queryKey: ['weeklyReport'] });
        },
    });
}
