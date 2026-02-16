export default function TransactionList({ transactions, isLoading, onEdit, onDelete }) {
    if (isLoading) {
        return (
            <div className="glass rounded-[2rem] p-16 text-center border-white/5 shadow-2xl h-full flex flex-col items-center justify-center">
                <div className="inline-block w-12 h-12 border-4 rounded-full animate-spin mb-6" style={{ borderColor: 'rgba(255,255,255,0.05)', borderTopColor: 'var(--color-primary)' }} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40" style={{ color: 'var(--color-text-muted)' }}>Retrieving Entries...</p>
            </div>
        );
    }

    if (!transactions?.length) {
        return (
            <div className="glass rounded-[2rem] p-20 text-center animate-fade-in border-white/5 shadow-2xl h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-8 text-5xl shadow-inner border border-white/5">📭</div>
                <h3 className="text-2xl font-black tracking-tighter mb-3" style={{ color: 'var(--color-text)' }}>No Records Found</h3>
                <p className="text-xs font-bold max-w-xs mx-auto opacity-40 leading-relaxed uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                    Your financial history starts here. Add your first transaction to the left.
                </p>
            </div>
        );
    }

    return (
        <div className="glass rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in border-white/5 flex flex-col h-full">
            <div className="px-8 py-6 glass border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-lg shadow-inner">
                        📋
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight leading-none" style={{ color: 'var(--color-text)' }}>Recent History</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-40" style={{ color: 'var(--color-text-muted)' }}>Transaction Log</p>
                    </div>
                </div>
                <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-lg">
                    {transactions.length} Logs
                </div>
            </div>

            <div className="divide-y divide-white/[0.03] overflow-y-auto max-h-[700px] scrollbar-thin">
                {transactions.map((txn, index) => (
                    <div
                        key={txn.id}
                        className="group flex items-center justify-between px-8 py-6 transition-all duration-300 hover:bg-white/[0.02] relative"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Status bar on hover */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                        {/* Left — details */}
                        <div className="flex items-center gap-6 min-w-0">
                            <div
                                className="flex items-center justify-center w-14 h-14 rounded-2xl text-2xl shrink-0 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-slate-900/50"
                                style={{
                                    border: txn.type === 'credit' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                                    color: txn.type === 'credit' ? '#10b981' : '#ef4444'
                                }}
                            >
                                {txn.type === 'credit' ? '↗' : '↘'}
                                <div className="absolute inset-0 rounded-2xl opacity-10" style={{ background: txn.type === 'credit' ? '#10b981' : '#ef4444' }} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-lg font-black tracking-tighter mb-1 transition-colors group-hover:text-indigo-400 leading-none" style={{ color: 'var(--color-text)' }}>{txn.category}</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold truncate opacity-50 uppercase tracking-tight" style={{ color: 'var(--color-text-muted)' }}>{txn.description || 'N/A'}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 opacity-30" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30" style={{ color: 'var(--color-text-muted)' }}>{txn.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right — amount + actions */}
                        <div className="flex items-center gap-8 shrink-0">
                            <div className="text-right">
                                <span
                                    className="text-xl font-black tracking-tighter"
                                    style={{ color: txn.type === 'credit' ? 'var(--color-success)' : 'var(--color-danger)' }}
                                >
                                    {txn.type === 'credit' ? '+' : '−'}₹{Number(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                <button
                                    onClick={() => onEdit(txn)}
                                    className="p-3 rounded-2xl transition-all duration-300 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5 active:scale-90 shadow-xl"
                                    title="Edit Record"
                                >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => onDelete(txn.id)}
                                    className="p-3 rounded-2xl transition-all duration-300 cursor-pointer bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 active:scale-95 shadow-xl"
                                    title="Purge Record"
                                >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-danger)' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
