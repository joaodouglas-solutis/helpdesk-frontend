import { getToken } from './auth'

const API_BASE_URL = 'http://localhost:8080'

async function apiFetch(path, options = {}) {
    const token = getToken()

    const headers = {
        ...(options.headers || {}),
    }

    if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    })
}

export default apiFetch