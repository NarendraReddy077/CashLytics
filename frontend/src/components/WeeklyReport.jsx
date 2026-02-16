import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useWeeklyReport } from '../hooks/useTransactions';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatCurrency(val) {
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function WeeklyReport({ referenceDate, onPrevWeek, onNextWeek, onResetWeek }) {
    const { data: report, isLoading, isError } = useWeeklyReport(referenceDate);

    if (isLoading) {
        return (
            <div className="glass rounded-[2rem] p-16 text-center border-white/5 shadow-2xl">
                <div className="inline-block w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.05)', borderTopColor: 'var(--color-primary)' }} />
                <p className="mt-6 text-sm font-bold tracking-[0.2em] uppercase opacity-40" style={{ color: 'var(--color-text-muted)' }}>Calculating Analytics...</p>
            </div>
        );
    }

    if (isError || !report) {
        return (
            <div className="glass rounded-[2rem] p-12 text-center border-red-500/10 shadow-2xl bg-red-500/5">
                <p className="text-sm font-bold text-red-400 tracking-tight">System failed to retrieve weekly summary.</p>
                <button onClick={() => window.location.reload()} className="mt-4 text-xs font-black uppercase tracking-widest text-indigo-400 hover:underline">Retry Connection</button>
            </div>
        );
    }

    const chartData = report.daily_breakdown.map((d, i) => ({
        day: dayLabels[i] || d.date,
        Credits: d.credits,
        Debits: d.debits,
    }));

    const netColor = report.net_balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)';

    return (
        <div className="glass rounded-[2rem] p-8 lg:p-10 shadow-2xl animate-fade-in border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-2xl shadow-inner">
                        📊
                    </div>
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black tracking-tighter" style={{ color: 'var(--color-text)' }}>Financial Overview</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-1 opacity-40" style={{ color: 'var(--color-text-muted)' }}>Weekly Net Cash Flow</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 shadow-inner self-stretch lg:self-auto">
                    <button
                        onClick={onPrevWeek}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 transition-all active:scale-90 cursor-pointer border border-white/5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <div className="px-4 text-center min-w-[180px]">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Viewing Period</p>
                        <p className="text-xs font-bold tracking-tight text-indigo-100 uppercase">
                            {report.start_date} <span className="opacity-30 mx-1">&mdash;</span> {report.end_date}
                        </p>
                    </div>

                    <button
                        onClick={onNextWeek}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 transition-all active:scale-90 cursor-pointer border border-white/5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <div className="h-6 w-px bg-white/5 mx-1 md:block hidden" />

                    <button
                        onClick={onResetWeek}
                        className="px-4 h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors bg-white/5 md:flex hidden items-center rounded-xl cursor-pointer hover:bg-indigo-500/10"
                    >
                        Current
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 relative z-10">
                <div className="group rounded-[1.5rem] p-7 glass border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-500 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60" style={{ color: 'var(--color-success)' }}>Total Income</p>
                    <p className="text-4xl font-black tracking-tighter" style={{ color: 'var(--color-success)' }}>{formatCurrency(report.total_credits)}</p>
                </div>

                <div className="group rounded-[1.5rem] p-7 glass border-red-500/10 hover:border-red-500/20 transition-all duration-500 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60" style={{ color: 'var(--color-danger)' }}>Total Expenses</p>
                    <p className="text-4xl font-black tracking-tighter" style={{ color: 'var(--color-danger)' }}>{formatCurrency(report.total_debits)}</p>
                </div>

                <div
                    className="group rounded-[1.5rem] p-7 glass transition-all duration-500 shadow-xl relative overflow-hidden"
                    style={{ borderColor: report.net_balance >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" style={{ background: netColor + '08' }} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60" style={{ color: 'var(--color-primary)' }}>Net Balance</p>
                    <p className="text-4xl font-black tracking-tighter" style={{ color: netColor }}>{formatCurrency(report.net_balance)}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="rounded-[1.5rem] p-8 border border-white/5 bg-slate-900/40 relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData} barGap={8} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                            </linearGradient>
                            <linearGradient id="colorDebits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        < CartesianGrid strokeDasharray="6 6" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}
                            axisLine={false}
                            tickLine={false}
                            dy={15}
                        />
                        <YAxis
                            tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `₹${v}`}
                        />
                        <Tooltip
                            contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', color: '#f8fafc', boxShadow: '0 25px 70px -10px rgba(0,0,0,0.6)', padding: '16px', backdropFilter: 'blur(8px)' }}
                            itemStyle={{ fontWeight: 900, fontSize: '14px', textTransform: 'capitalize' }}
                            cursor={{ fill: 'rgba(99, 102, 241, 0.03)' }}
                        />
                        <Legend
                            iconType="circle"
                            wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}
                        />
                        <Bar dataKey="Credits" fill="url(#colorCredits)" radius={[10, 10, 2, 2]} maxBarSize={40} />
                        <Bar dataKey="Debits" fill="url(#colorDebits)" radius={[10, 10, 2, 2]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
