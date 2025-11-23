import { palettes } from '@/common/palettes'
import React from 'react'

function RecentTransaction({ recent }) {
    return (
        <section className="bg-white rounded-2xl p-4 shadow-sm" style={{
            color: palettes.primary[400],
            backgroundColor: palettes.dark[800],
        }} >
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Recent transactions</h3>
                <button className="text-sm text-indigo-600">See all</button>
            </div>

            <ul className="divide-y">
                {recent.map((t) => (
                    <li key={t.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm">{t.title[0]}</div>
                            <div>
                                <div className="font-medium">{t.title}</div>
                                <div className="text-xs text-gray-500">{t.category} • {t.date}</div>
                            </div>
                        </div>
                        <div className={`font-medium ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{t.amount < 0 ? '-' : '+'}{Math.abs(t.amount)}</div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default RecentTransaction