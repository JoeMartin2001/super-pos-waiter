import { useCallback, useState } from 'react';
import { base_url } from '../common/variables';

export const useFetch = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method='GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if(body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const response = await fetch(base_url + url, {method, body, headers})
            const data = await response.json()

            if(!response.ok) {
                throw new Error(data.msg || 'Что-то пошло не так !')
            }

            setLoading(false)

            return data
        } catch (e) {
            setLoading(false)
            setError('Неверные данные!')
            throw e            
        }
    }, [])

    const clearError = () => setError(null)

    return [loading, error, request, clearError]
}