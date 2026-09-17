import apiFetch from './api'

export async function getNotifications() {
    const response = await apiFetch('/api/notifications')

    if (!response.ok) {
        let errorMessage =
            `Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                errorMessage += `: ${body}`
            }
        } catch {
            // Não foi possível ler a resposta.
        }

        throw new Error(errorMessage)
    }

    return response.json()
}