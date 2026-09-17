import apiFetch from './api'

export async function getUsers() {
    const response = await apiFetch('/api/users')

    if (!response.ok) {
        throw new Error(
            'Não foi possível carregar os usuários.'
        )
    }

    return response.json()
}