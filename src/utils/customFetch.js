import * as Sentry from '@sentry/react';
import { eliminarNoSerializable } from './eliminarNoSerializable';
export function customFetch(url, options) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                response.json().then(errorData => {
                    const errorObj = eliminarNoSerializable(errorData);
                    Sentry.captureException(new Error(`Network error${response.status ? `: ${response.status}` : ""}`), {
                        extra: {
                            ...errorObj, url, options,
                            responseData: errorData?.response?.data || {}
                        }
                    });
                })
            }
            return response;
        })
        .catch(error => {
            // Interceptar errores de red u otros errores
            const errorObj = eliminarNoSerializable(error)
            Sentry.captureException(error, { extra: { ...errorObj, url, options, responseData: errorObj?.response?.data } });
            throw error;
        });
}