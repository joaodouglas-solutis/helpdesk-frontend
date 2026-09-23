import apiFetch from './api'

export async function getTickets() {
    const response = await apiFetch(
        '/api/tickets'
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível carregar os chamados.'
        )
    }

    return response.json()
}

export async function getTicketById(id) {
    const response = await apiFetch(
        `/api/tickets/${id}`
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível carregar o chamado.'
        )
    }

    return response.json()
}

export async function createTicket(ticketData) {
    const response = await apiFetch(
        '/api/tickets',
        {
            method: 'POST',
            body: JSON.stringify(ticketData),
        }
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível criar o chamado.'
        )
    }

    return response.json()
}

export async function updateTicket(
    id,
    ticketData
) {
    const response = await apiFetch(
        `/api/tickets/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(ticketData),
        }
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível atualizar o chamado.'
        )
    }

    return response.json()
}

export async function assignTechnician(
    id,
    technicianId
) {
    const response = await apiFetch(
        `/api/tickets/${id}/assign`,
        {
            method: 'PATCH',
            body: JSON.stringify({
                technicianId,
            }),
        }
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível atribuir o técnico.'
        )
    }

    return response.json()
}

export async function claimTicket(id) {
    const response = await apiFetch(
        `/api/tickets/${id}/claim`,
        {
            method: 'PATCH',
        }
    )

    if (!response.ok) {
        let errorMessage =
            `Não foi possível assumir o chamado. Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                try {
                    const parsedBody =
                        JSON.parse(body)

                    if (parsedBody.message) {
                        errorMessage =
                            parsedBody.message
                    } else {
                        errorMessage += `: ${body}`
                    }
                } catch {
                    errorMessage += `: ${body}`
                }
            }
        } catch {
            // Não foi possível ler a resposta.
        }

        throw new Error(errorMessage)
    }

    return response.json()
}

export async function closeTicket(id) {
    const response = await apiFetch(
        `/api/tickets/${id}/close`,
        {
            method: 'PATCH',
        }
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível fechar o chamado.'
        )
    }

    return response.status === 204
        ? null
        : response.json()
}

export async function deleteTicket(id) {
    const response = await apiFetch(
        `/api/tickets/${id}`,
        {
            method: 'DELETE',
        }
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível inativar o chamado.'
        )
    }

    return null
}