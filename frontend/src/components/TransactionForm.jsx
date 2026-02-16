import { useState } from 'react';

export default function TransactionForm({ onSubmit, initialData, onCancel }) {
    const isEditing = !!initialData;
    const [form, setForm] = useState({
        amount: initialData?.amount || '',
        type: initialData?.type || 'credit',
        category: initialData?.category || '',
        description: initialData?.description || '',
        date: initialData?.date || new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...form, amount: parseFloat(form.amount) });
        if (!isEditing) setForm({ amount: '', type: 'credit', category: '', description: '', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className="glass rounded-[2rem] shadow-2xl animate-fade-in border-white/5 overflow-hidden">
            <div className="px-8 py-6 glass border-b border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-lg shadow-inner">
                    {isEditing ? '✏️' : '✨'}
                </div>
                <div>
                    <h2 className="text-xl font-black tracking-tight leading-none" style={{ color: 'var(--color-text)' }}>
                        {isEditing ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-40" style={{ color: 'var(--color-text-muted)' }}>
                        Entry Portal
                    </p>
                </div>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount + Type */}
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest ml-1 opacity-50" style={{ color: 'var(--color-text-muted)' }}>Amount</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                                <input
                                    id="txn-amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    required
                                    value={form.amount}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-5 py-4 rounded-2xl text-lg font-black outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300 shadow-inner border border-white/5 bg-slate-900/40"
                                    style={{ color: 'var(--color-text)' }}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest ml-1 opacity-50" style={{ color: 'var(--color-text-muted)' }}>Classification</label>
                            <select
                                id="txn-type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300 cursor-pointer shadow-inner appearance-none border border-white/5 bg-slate-900/40 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2394a3b8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
                                style={{ color: 'var(--color-text)' }}
                            >
                                <option value="credit">💰 Credit / Income</option>
                                <option value="debit">💸 Debit / Expense</option>
                            </select>
                        </div>
                    </div>

                    {/* Category + Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest ml-1 opacity-50" style={{ color: 'var(--color-text-muted)' }}>Category</label>
                            <input
                                id="txn-category"
                                name="category"
                                required
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300 shadow-inner border border-white/5 bg-slate-900/40"
                                style={{ color: 'var(--color-text)' }}
                                placeholder="Main, Rent, Food"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest ml-1 opacity-50" style={{ color: 'var(--color-text-muted)' }}>Date</label>
                            <input
                                id="txn-date"
                                name="date"
                                type="date"
                                required
                                value={form.date}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300 shadow-inner border border-white/5 bg-slate-900/40"
                                style={{ color: 'var(--color-text)' }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest ml-1 opacity-50" style={{ color: 'var(--color-text-muted)' }}>Supplemental Info</label>
                        <input
                            id="txn-description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300 shadow-inner border border-white/5 bg-slate-900/40"
                            style={{ color: 'var(--color-text)' }}
                            placeholder="Add internal notes..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-6">
                        <button
                            id="txn-submit"
                            type="submit"
                            className="w-full py-5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] cursor-pointer premium-gradient active:scale-[0.98] shadow-2xl relative overflow-hidden group"
                        >
                            <span className="relative z-10">{isEditing ? 'Save Modifications' : 'Commit Transaction'}</span>
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                        </button>
                        {isEditing && onCancel && (
                            <button
                                id="txn-cancel"
                                type="button"
                                onClick={onCancel}
                                className="w-full py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Abort Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
