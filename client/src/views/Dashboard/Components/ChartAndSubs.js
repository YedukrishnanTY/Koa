import { palettes } from '@/common/palettes';
import { AddAccount, DeleteAccount, EditAccount } from '@/services/Accounts.services';
import React from 'react';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    AreaChart,
    Area,
    BarChart,
    Bar,
    ComposedChart,
    Legend,
    ReferenceLine,
} from 'recharts';
import { toast } from 'sonner';
import Addmodal from './Addmodal';
import AddAccountItem from './AddAccountItem';
import AccountItem from './AccountItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// Helper to sanitize keys for recharts data keys
function sanitizeKey(label = '') {
    return label.replace(/[^a-zA-Z0-9]/g, '_');
}

function buildRechartsDataFromChartData(chartData) {
    // Accepts { labels: ['Dec 2024', ...], datasets: [{ label: 'AED (income)', data: [..], meta:'income' }, ...] }
    if (!chartData || !Array.isArray(chartData.labels) || !Array.isArray(chartData.datasets)) return { data: [], series: [] };

    const labels = chartData.labels;
    const datasets = chartData.datasets;

    const points = labels.map((lab, i) => {
        const obj = { name: lab };
        for (const ds of datasets) {
            const key = sanitizeKey(ds.label);
            obj[key] = Number(ds.data?.[i] ?? 0);
        }
        return obj;
    });
    if (points.length === 1) {
        points.push({ name: "" });
        points.push({ name: "" });
    } else if (points.length === 2) {
        points.push({ name: "" });
    }
    const series = datasets.map(ds => ({
        key: sanitizeKey(ds.label),
        label: ds.label,
        meta: ds.meta ?? '',
    }));

    return { data: points, series };
}

export default function ChartAndSubs({ currencyList, profile, accounts = [], getList, accountDetails = {} }) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editDetails, setEditDetails] = React.useState({});

    const [chartType, setChartType] = React.useState('bar'); // 'line' | 'area' | 'bar' | 'composed'
    const [showIncome, setShowIncome] = React.useState(true);
    const [showExpense, setShowExpense] = React.useState(true);
    const [visibleSeries, setVisibleSeries] = React.useState(new Set());

    const handleOpenModal = (account, type) => {
        if (type !== 'edit') {
            setEditDetails({});
            setIsDialogOpen(true);
            return;
        } else {
            setIsDialogOpen(true);
            setEditDetails(account);
        }
    };

    const handleAddAccount = async (payload) => {
        if (editDetails?._id) {
            EditAccount(payload)
                .then(() => {
                    toast.success('Edited successfully');
                    getList();
                })
                .catch(err => toast.error(err?.message || 'failed to add'));
        } else {
            AddAccount(payload)
                .then(() => {
                    toast.success('added successfully');
                    getList();
                })
                .catch(err => toast.error(err?.message || 'failed to add'));
        }
    };

    const handleDelete = async (payload) => {
        if (editDetails?._id) {
            DeleteAccount(payload)
                .then(() => {
                    toast.success('Deleted successfully');
                    getList();
                })
                .catch(err => toast.error(err?.message || 'failed to delete'));
        } else {
            toast.error('failed to delete your account');
        }
    };

    const formatCurrency = (v, cur = 'USD') => {
        try {
            return Number(v).toLocaleString(undefined, { style: 'currency', currency: cur });
        } catch (e) {
            return String(v);
        }
    };

    // build chart data from accountDetails.chartData if present
    const chartPayload = accountDetails?.chartData ?? null;
    const { data: chartDataPoints, series: chartSeries } = React.useMemo(() => buildRechartsDataFromChartData(chartPayload), [chartPayload]);

    // initialize visible series
    React.useEffect(() => {
        if (chartSeries.length && visibleSeries.size === 0) {
            setVisibleSeries(new Set(chartSeries.map(s => s.key)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartSeries]);

    const toggleSeries = (key) => {
        const copy = new Set(visibleSeries);
        if (copy.has(key)) copy.delete(key); else copy.add(key);
        setVisibleSeries(copy);
    };

    // color function: cycle through primary palette + subtle transparent variants
    const getColor = (idx) => palettes.primary[idx % palettes.primary.length] || '#6366f1';

    // Filtered series for rendering based on toggles
    const filteredSeries = chartSeries.filter(s => visibleSeries.has(s.key) && ((s.meta === 'income' && showIncome) || (s.meta === 'expense' && showExpense) || (!s.meta && (showIncome || showExpense))));

    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            {/* Chart Card */}
            <div className="lg:col-span-2 rounded-2xl p-5 shadow-2xl border border-gray-700/50" style={{ backgroundColor: palettes.dark[800] }}>
                <div className="flex items-center justify-between mb-4 flex-wrap">
                    <div>
                        <h3 className="font-extrabold text-xl text-white">Spending Trend</h3>
                        <div className="text-sm text-gray-400">Overview of income & expense by currency</div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <Checkbox checked={showIncome} onCheckedChange={(v) => setShowIncome(Boolean(v))} />
                                Income
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <Checkbox checked={showExpense} onCheckedChange={(v) => setShowExpense(Boolean(v))} />
                                Expense
                            </label>
                        </div>

                        <Select onValueChange={(v) => setChartType(v)} defaultValue={chartType}>
                            <SelectTrigger className="w-44 bg-gray-800 text-white">
                                <SelectValue placeholder="Chart type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="area">Area (smooth)</SelectItem>
                                <SelectItem value="bar">Bar</SelectItem>
                                <SelectItem value="line">Line</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-xl p-4 shadow-inner" style={{ background: 'linear-gradient(180deg, rgba(17,24,39,0.9), rgba(8,10,14,0.8))', border: '1px solid #334155' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-lg text-white">Balance & Flow</div>
                        {/* <div className="text-xs text-gray-400">Interactive · Colorful · Modern</div> */}
                    </div>

                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            {/* Dynamically choose chart type */}
                            {chartType === 'line' && (
                                <LineChart data={chartDataPoints} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <defs>
                                        {filteredSeries.map((s, idx) => (
                                            <linearGradient id={`grad-${s.key}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={getColor(idx)} stopOpacity={0.9} />
                                                <stop offset="100%" stopColor={getColor(idx)} stopOpacity={0.2} />
                                            </linearGradient>
                                        ))}
                                    </defs>

                                    <CartesianGrid strokeDasharray="4 4" stroke="#172031" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ backgroundColor: palettes.dark[800], border: 'none' }} itemStyle={{ color: palettes.primary[400] }} />
                                    <Legend />

                                    {filteredSeries.map((s, idx) => (
                                        <Line
                                            key={s.key}
                                            type="monotone"
                                            dataKey={s.key}
                                            stroke={getColor(idx)}
                                            strokeWidth={s.meta === 'income' ? 3 : 2}
                                            dot={false}
                                            activeDot={{ r: 6 }}
                                        />
                                    ))}
                                </LineChart>
                            )}

                            {chartType === 'area' && (
                                <AreaChart data={chartDataPoints} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <defs>
                                        {filteredSeries.map((s, idx) => (
                                            <linearGradient id={`area-${s.key}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={getColor(idx)} stopOpacity={0.85} />
                                                <stop offset="100%" stopColor={getColor(idx)} stopOpacity={0.08} />
                                            </linearGradient>
                                        ))}
                                    </defs>

                                    <CartesianGrid strokeDasharray="4 4" stroke="#172031" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ backgroundColor: palettes.dark[800], border: 'none' }} itemStyle={{ color: palettes.primary[400] }} />
                                    <Legend />

                                    {filteredSeries.map((s, idx) => (
                                        <Area
                                            key={s.key}
                                            type="monotone"
                                            dataKey={s.key}
                                            stroke={getColor(idx)}
                                            fill={`url(#area-${s.key})`}
                                            strokeWidth={2}
                                            name={s.label}
                                        />
                                    ))}
                                </AreaChart>
                            )}

                            {chartType === 'bar' && (
                                <BarChart data={chartDataPoints} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#172031" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ backgroundColor: palettes.dark[800], border: 'none' }} itemStyle={{ color: palettes.primary[400] }} />
                                    <Legend />

                                    {filteredSeries.map((s, idx) => (
                                        <Bar
                                            key={s.key}
                                            dataKey={s.key}
                                            name={s.label}
                                            fill={getColor(idx)}
                                            radius={[6, 6, 0, 0]}
                                        />
                                    ))}
                                </BarChart>
                            )}

                            {chartType === 'composed' && (
                                <ComposedChart data={chartDataPoints} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <defs>
                                        {filteredSeries.map((s, idx) => (
                                            <linearGradient id={`comp-${s.key}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={getColor(idx)} stopOpacity={0.85} />
                                                <stop offset="100%" stopColor={getColor(idx)} stopOpacity={0.06} />
                                            </linearGradient>
                                        ))}
                                    </defs>

                                    <CartesianGrid strokeDasharray="4 4" stroke="#172031" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip contentStyle={{ backgroundColor: palettes.dark[800], border: 'none' }} itemStyle={{ color: palettes.primary[400] }} />
                                    <Legend />

                                    {filteredSeries.map((s, idx) => (
                                        s.meta === 'expense' ? (
                                            <Bar key={s.key} dataKey={s.key} fill={getColor(idx)} name={s.label} radius={[6, 6, 0, 0]} />
                                        ) : (
                                            <Line key={s.key} type="monotone" dataKey={s.key} stroke={getColor(idx)} strokeWidth={3} dot={false} name={s.label} />
                                        )
                                    ))}

                                    {/* a soft reference line at 0 for context */}
                                    <ReferenceLine y={0} stroke="#334155" />
                                </ComposedChart>
                            )}
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="col-span-2 flex flex-wrap gap-2">
                            {chartSeries.map((s, idx) => (
                                <Button key={s.key} size="sm" variant={visibleSeries.has(s.key) ? 'default' : 'ghost'} onClick={() => toggleSeries(s.key)}>
                                    <span style={{ display: 'inline-block', width: 10, height: 10, background: getColor(idx), marginRight: 8, borderRadius: 3 }} />
                                    {s.label}
                                </Button>
                            ))}
                        </div>

                        <div className="text-right">
                            <div className="text-xs text-gray-400">Range</div>
                            <div className="text-sm font-semibold text-white">{(chartPayload?.labels?.length ?? 0)} months</div>
                        </div>
                    </div>
                </div>

                {/* Insights metrics */}
                {/* <div className="mt-6 grid grid-cols-3 gap-4 text-white">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Top category</div>
                        <div className="font-semibold text-base mt-1 text-white">Food & Drink</div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Avg daily spend</div>
                        <div className="font-semibold text-base mt-1" style={{ color: palettes.red[500] }}>{formatCurrency(40)}</div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Forecast total</div>
                        <div className="font-semibold text-base mt-1 text-white">{formatCurrency(2200)}</div>
                    </div>
                </div> */}
            </div>

            {/* Accounts List Card */}
            <div className="rounded-2xl p-5 shadow-2xl border border-gray-700/50" style={{ backgroundColor: palettes.dark[800] }}>
                <h4 className="font-extrabold text-xl text-white mb-4">Your Accounts</h4>

                <ScrollArea className="space-y-2 pr-1" style={{ maxHeight: '300px' }}>
                    {accounts.map((account) => (
                        <AccountItem key={account._id} account={account} onClick={handleOpenModal} />
                    ))}
                </ScrollArea>

                <AddAccountItem onClick={handleOpenModal} currencyList={currencyList} profile={profile} />

                <Addmodal
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    currencyList={currencyList}
                    profile={profile}
                    onSave={handleAddAccount}
                    editDetails={editDetails}
                    handleDelete={handleDelete}
                />
            </div>
        </section>
    );
}
