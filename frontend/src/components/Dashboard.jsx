import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../hooks/useTransactions';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import WeeklyReport from './WeeklyReport';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const [referenceDate, setReferenceDate] = useState(new Date().toISOString().split('T')[0]);

    // Data fetching & operations
    const { data: transactions, isLoading } = useTransactions();
    const createTxn = useCreateTransaction();
    const updateTxn = useUpdateTransaction();
    const deleteTxn = useDeleteTransaction();

    const [editingTxn, setEditingTxn] = useState(null);

    const handleCreate = (data) => createTxn.mutate(data);
    const handleUpdate = (data) => {
        updateTxn.mutate({ id: editingTxn.id, ...data });
        setEditingTxn(null);
    };
    const handleDelete = (id) => {
        if (window.confirm('Delete this transaction?')) {
            deleteTxn.mutate(id);
        }
    };

    const adjustWeek = (days) => {
        const current = new Date(referenceDate);
        current.setDate(current.getDate() + days);
        setReferenceDate(current.toISOString().split('T')[0]);
    };

    return (
        <div className="min-h-screen relative overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Background Glows */}
            {/* <div className="fixed inset-0 bg-gradient-to-br from-indigo-300 to-orange-300 -z-10" /> */}
            <div className="absolute top-[0%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[5%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[140px] pointer-events-none" />

            {/* ── Topbar ─────────────────────────────────────── */}
            <header className="sticky top-0 z-50 glass border-b border-white/5 shadow-2xl backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 lg:py-5">
                    <div className="flex items-center gap-4 group cursor-default">
                        <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center premium-gradient shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                            <span className="text-white text-xl">💰</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl lg:text-2xl font-black tracking-tighter leading-none" style={{ color: 'var(--color-text)' }}>
                                Cash<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-orange-500">Lytics</span>
                            </h1>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--color-text-muted)' }}>Pro Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="hidden md:flex flex-col items-end border-r border-white/5 pr-6">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: 'var(--color-text-muted)' }}>Active Session</span>
                            <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>{user?.email}</span>
                        </div>
                        <button
                            id="logout-btn"
                            onClick={signOut}
                            className="px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer border border-white/10 hover:bg-white/5 hover:border-white/20 active:scale-95 shadow-lg flex items-center gap-2 group"
                            style={{ color: 'var(--color-text)' }}
                        >
                            <span>Sign Out</span>
                            <svg className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main Content ─────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-6 py-8 lg:py-12 relative z-10">
                {/* ── Weekly Section ────────────────────────────── */}
                <section className="mb-12 animate-fade-in">
                    <WeeklyReport
                        referenceDate={referenceDate}
                        onPrevWeek={() => adjustWeek(-7)}
                        onNextWeek={() => adjustWeek(7)}
                        onResetWeek={() => setReferenceDate(new Date().toISOString().split('T')[0])}
                    />
                </section>

                {/* ── Grid Layout ────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Form Column */}
                    <aside className="lg:col-span-5 xl:col-span-4 sticky top-28">
                        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            {editingTxn ? (
                                <TransactionForm
                                    key={editingTxn.id}
                                    initialData={editingTxn}
                                    onSubmit={handleUpdate}
                                    onCancel={() => setEditingTxn(null)}
                                />
                            ) : (
                                <TransactionForm onSubmit={handleCreate} />
                            )}
                        </div>
                    </aside>

                    {/* List Column */}
                    <div className="lg:col-span-7 xl:col-span-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <TransactionList
                            transactions={transactions}
                            isLoading={isLoading}
                            onEdit={setEditingTxn}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-16 text-center">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mb-8" />
                <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-30" style={{ color: 'var(--color-text-muted)' }}>

                    © 2026 CashLytics &bull; Designed & Developed by Narendra Reddy M <br /> Powered by FastAPI · React · Supabase
                </p>
            </footer>
        </div>
    );
}
