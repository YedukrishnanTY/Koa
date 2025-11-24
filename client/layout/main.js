'use client'
import React from 'react'
import Header from './Header'
import Toaster from './Toaster'
import Interceptor from '../common/Interceptor'

function Main({ children }) {

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
