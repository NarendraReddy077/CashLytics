import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 1000 * 60, retry: 1 },
    },
});

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-dark)' }}>
                <div className="text-center animate-fade-in">
                    <div
                        className="inline-block w-12 h-12 border-4 rounded-full animate-spin"
                        style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }}
                    />
                    <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
                </div>
            </div>
        );
    }

    return user ? <Dashboard /> : <Auth />;
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </QueryClientProvider>
    );
}
