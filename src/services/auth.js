const TOKEN_KEY = 'helpdesk_token'

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
}

function decodeToken(token) {
    try {
        const payload = token.split('.')[1]

        if (!payload) {
            return null
        }

        const base64 = payload
            .replace(/-/g, '+')
            .replace(/_/g, '/')

        const paddedBase64 =
            base64 + '='.repeat((4 - (base64.length % 4)) % 4)

        const binaryData = atob(paddedBase64)

        const bytes = Uint8Array.from(
            binaryData,
            (character) => character.charCodeAt(0)
        )

        const jsonPayload = new TextDecoder().decode(bytes)

        return JSON.parse(jsonPayload)
    } catch {
        return null
    }
}

export function getAuthenticatedUser() {
    const token = getToken()

    if (!token) {
        return null
    }

    const payload = decodeToken(token)

    if (!payload) {
        return null
    }

    return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
    }
}