import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'


const AppLayout = () => {
    return (
        <>
            <div className="z-[-1] fixed inset-0 h-full w-full darkthemed"></div>
            <Header />
            <main className='min-h-screen lg:pl-12 lg:pr-12 lg:p-6 sm:pl-7 sm:pr-7 sm:p-4 p-4 lg:pt-20 sm:pt-20 pt-16'>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default AppLayout
