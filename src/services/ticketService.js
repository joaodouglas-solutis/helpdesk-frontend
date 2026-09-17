import apiFetch from './api'

export async function getTickets() {
    const response = await apiFetch('/api/tickets')

    if (!response.ok) {
        let errorMessage = `Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                errorMessage += `: ${body}`
            }
        } catch {
            // Não foi possível ler o corpo da resposta.
        }

        throw new Error(errorMessage)
    }

    return response.json()
}

export async function createTicket(ticketData) {
    const response = await apiFetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketData),
    })

    if (!response.ok) {
        let errorMessage = `Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                errorMessage += `: ${body}`
            }
        } catch {
            // Não foi possível ler o corpo da resposta.
        }

        throw new Error(errorMessage)
    }

    return response.json()
}