import { palettes } from '@/common/palettes';
import React from 'react'

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
} from 'recharts';

const balanceData = [
    { name: 'Jan', balance: 8000 },
    { name: 'Feb', balance: 9200 },
    { name: 'Mar', balance: 7600 },
    { name: 'Apr', balance: 11200 },
    { name: 'May', balance: 9800 },
    { name: 'Jun', balance: 12500 },
    { name: 'Jul', balance: 14300 },
];




function ChartAndSubs({ }) {

    const format = (v) => v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6" >
            <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-md" style={{backgroundColor : palettes.dark[800]}}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Spending this month</h3>
                    <div className="text-sm text-gray-500">Sep — Nov</div>
                </div>

                {/* Chart placeholder - replace with real chart (recharts / chart.js) */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm" style={{ backgroundColor: palettes.slate[100] }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">Balance trend</div>
                        <div className="text-xs text-slate-500">Last 6 months</div>
                    </div>
                    <div style={{ width: '100%', height: 180 }}>
                        <ResponsiveContainer>
                            <LineChart data={balanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="balance" stroke="#6366F1" strokeWidth={3} dot={{ r: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-gray-600">
                    <div>
                        <div className="text-xs">Top category</div>
                        <div className="font-medium">Food</div>
                    </div>
                    <div>
                        <div className="text-xs">Avg daily</div>
                        <div className="font-medium">{format(40)}</div>
                    </div>
                    <div>
                        <div className="text-xs">Forecast</div>
                        <div className="font-medium">{format(2200)}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md" style={{
                                    color: palettes.light[400],
                                    backgroundColor: palettes.dark[800],
                                }}>
                <h4 className="font-semibold mb-3">Subscriptions</h4>
                <ul className="space-y-3 text-sm ">
                    <li className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Spotify</div>
                            <div className="text-xs ">Monthly • Next: Dec 2</div>
                        </div>
                        <div className="font-medium">-9.99</div>
                    </li>
                    <li className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Netlify</div>
                            <div className="text-xs ">Annual • Next: Jan 10</div>
                        </div>
                        <div className="font-medium">-99</div>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default ChartAndSubs