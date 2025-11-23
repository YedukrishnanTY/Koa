'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import Header from './Header'
import Toaster from './Toaster'
import Interceptor from '@/common/interceptor'

Interceptor()
function Main({ props, children }) {

    return (
        <div style={{ display: 'flex',flex :'1 0 0' ,flexDirection:'column' }}>
            {/* <SidebarProvider> */}
                <Header />
                <div>{children}</div>
                <Toaster />
            {/* </SidebarProvider> */}
        </div>
    )
}

export default Main