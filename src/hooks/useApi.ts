// src/hooks/useApi.ts
import { useState } from 'react';

export function useApi<TResponse = any>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = async (
        url: string,
        options?: RequestInit,
    ): Promise<TResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error desconocido');
            }

            return data;
        } catch (err: any) {
            setError(err.message || 'Error en la petición');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { request, loading, error };
}
