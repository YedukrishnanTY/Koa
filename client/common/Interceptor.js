'use client'
import { useEffect } from "react";

export default function Interceptor() {
    useEffect(() => {
        const realFetch = window.fetch;

        window.fetch = async (url, opts = {}) => {
            const token = localStorage.getItem('a');

            // ensure headers exists
            opts.headers = opts.headers || {};

            if (token) {
                opts.headers['Authorization'] = `Bearer ${token}`;
            }

            return realFetch(url, {
                credentials: 'same-origin',
                ...opts,
            });
        };
    }, []);

    return null; // no UI
}
