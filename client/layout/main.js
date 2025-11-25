'use client'
import React from 'react'
import Header from './Header'
import Toaster from './Toaster'
import Interceptor from '../common/Interceptor'

function Main({ children }) {

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        if (process.env.NODE_ENV !== 'production') return; // only in production

        if ('serviceWorker' in navigator) {
            fetch('/sw.js', { method: 'HEAD' })
                .then(res => {
                    if (res.ok) {
                        navigator.serviceWorker.register('/sw.js')
                            .then(reg => console.log('SW registered', reg))
                            .catch(err => console.error('SW reg failed', err));
                    } else {
                        console.log('No sw.js found (HEAD returned', res.status, ') — skipping SW registration.');
                    }
                })
                .catch(err => console.log('Could not fetch /sw.js before registering:', err));
        }
    }, []);

    return (
        <div style={{ display: 'flex', flex: '1 0 0', flexDirection: 'column', background: '#0f172a' }}>
            <Interceptor />   {/* run only on client */}
            <Header />
            <div>{children}</div>
            <Toaster />
        </div>
    )
}

export default Main

