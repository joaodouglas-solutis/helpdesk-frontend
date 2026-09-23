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

export async function getClients() {
    const response = await apiFetch(
        '/api/users/clients'
    )

    if (!response.ok) {
        let errorMessage =
            `Não foi possível carregar os clientes. Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                try {
                    const parsedBody =
                        JSON.parse(body)

                    if (parsedBody.message) {
                        errorMessage =
                            parsedBody.message
                    } else if (parsedBody.error) {
                        errorMessage =
                            parsedBody.error
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

export async function getUserSummary(id) {
    const response = await apiFetch(
        `/api/users/${id}/summary`
)

if (!response.ok) {
    throw new Error(
        'Não foi possível carregar os dados do usuário.'
    )
}

return response.json()
}

export async function registerUser(userData) {
    const response = await apiFetch(
        '/api/users/register',
        {
            method: 'POST',
            body: JSON.stringify(userData),
        }
    )

    if (!response.ok) {
        let errorMessage =
            `Não foi possível criar a conta. Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                try {
                    const parsedBody =
                        JSON.parse(body)

                    if (parsedBody.message) {
                        errorMessage =
                            parsedBody.message
                    } else if (parsedBody.error) {
                        errorMessage =
                            parsedBody.error
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

export async function createUser(userData) {
    const response = await apiFetch(
        '/api/users',
        {
            method: 'POST',
            body: JSON.stringify(userData),
        }
    )

    if (!response.ok) {
        let errorMessage =
            `Não foi possível criar o usuário. Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                try {
                    const parsedBody =
                        JSON.parse(body)

                    if (parsedBody.message) {
                        errorMessage =
                            parsedBody.message
                    } else if (parsedBody.error) {
                        errorMessage =
                            parsedBody.error
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

export async function deactivateUser(id) {
    const response = await apiFetch(
        `/api/users/${id}`,
        {
            method: 'DELETE',
        }
    )

    if (!response.ok) {
        let errorMessage =
            `Não foi possível inativar o usuário. Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                try {
                    const parsedBody =
                        JSON.parse(body)

                    if (parsedBody.message) {
                        errorMessage =
                            parsedBody.message
                    } else if (parsedBody.error) {
                        errorMessage =
                            parsedBody.error
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
}

export async function changeOwnPassword(passwordData) {
    const response = await apiFetch(
        '/api/users/me/password',
        {
            method: 'PUT',
            body: JSON.stringify(passwordData),
        }
    )

    if (!response.ok) {
        let errorMessage =
            `Não foi possível alterar a senha. Erro HTTP ${response.status}`

        try {
            const body = await response.text()

            if (body) {
                try {
                    const parsedBody =
                        JSON.parse(body)

                    if (parsedBody.message) {
                        errorMessage =
                            parsedBody.message
                    } else if (parsedBody.error) {
                        errorMessage =
                            parsedBody.error
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
}

