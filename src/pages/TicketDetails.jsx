import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import apiFetch from '../services/api'

import './TicketDetails.css'

function TicketDetails() {
    const { id } = useParams()

    const [ticket, setTicket] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadTicket() {
            try {
                setIsLoading(true)
                setError('')

                const response = await apiFetch(
                    `/api/tickets/${id}`
                )

                if (!response.ok) {
                    throw new Error(
                        `Não foi possível carregar o chamado. HTTP ${response.status}`
                    )
                }

                const data = await response.json()

                setTicket(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        loadTicket()
    }, [id])

    function getStatusLabel(status) {
        const labels = {
            OPEN: 'ABERTO',
            IN_PROGRESS: 'EM ATENDIMENTO',
            WAITING: 'AGUARDANDO',
            RESOLVED: 'RESOLVIDO',
            CLOSED: 'FECHADO',
        }

        return labels[status] || status
    }

    function getStatusClass(status) {
        const classes = {
            OPEN: '',
            IN_PROGRESS: 'in-progress',
            WAITING: 'waiting',
            RESOLVED: 'resolved',
            CLOSED: 'closed',
        }

        return classes[status] || ''
    }

    function getPriorityLabel(priority) {
        const labels = {
            LOW: 'BAIXA',
            MEDIUM: 'MÉDIA',
            HIGH: 'ALTA',
            CRITICAL: 'CRÍTICA',
        }

        return labels[priority] || priority
    }

    function getPriorityClass(priority) {
        return priority?.toLowerCase() || ''
    }

    function getCategoryLabel(category) {
        const labels = {
            HARDWARE: 'Hardware',
            SOFTWARE: 'Software',
            NETWORK: 'Rede',
        }

        return labels[category] || category
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return 'Não informado'
        }

        return new Date(dateValue).toLocaleString(
            'pt-BR'
        )
    }

    if (isLoading) {
        return (
            <section className="ticket-details-page">
                <div className="ticket-details-state">
                    Carregando chamado...
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="ticket-details-page">
                <div className="ticket-details-state ticket-details-error">
                    {error}
                </div>

                <Link
                    to="/tickets"
                    className="back-link"
                >
                    ← Voltar para chamados
                </Link>
            </section>
        )
    }

    if (!ticket) {
        return (
            <section className="ticket-details-page">
                <div className="ticket-details-state">
                    Chamado não encontrado.
                </div>

                <Link
                    to="/tickets"
                    className="back-link"
                >
                    ← Voltar para chamados
                </Link>
            </section>
        )
    }

    const shortId =
        ticket.id?.toString().substring(0, 8) ||
        '--------'

    return (
        <section className="ticket-details-page">
            <div className="ticket-details-header">
                <div>
                    <p className="welcome-label">
                        TICKET // {shortId}
                    </p>

                    <h2>
                        {ticket.title}
                    </h2>

                    <p>
                        Detalhes e informações do chamado.
                    </p>
                </div>

                <Link
                    to="/tickets"
                    className="back-link"
                >
                    ← Voltar
                </Link>
            </div>

            <div className="ticket-details-card">
                <div className="ticket-description">
                    <p className="detail-label">
                        DESCRIÇÃO
                    </p>

                    <p className="description-text">
                        {ticket.description}
                    </p>
                </div>

                <div className="ticket-detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">
                            STATUS
                        </span>

                        <span
                            className={`ticket-status ${getStatusClass(
                                ticket.status
                            )}`}
                        >
                            {getStatusLabel(ticket.status)}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            PRIORIDADE
                        </span>

                        <span
                            className={`ticket-priority priority ${getPriorityClass(
                                ticket.priority
                            )}`}
                        >
                            {getPriorityLabel(
                                ticket.priority
                            )}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            CATEGORIA
                        </span>

                        <strong>
                            {getCategoryLabel(
                                ticket.category
                            )}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            CLIENTE
                        </span>

                        <strong className="detail-monospace">
                            {ticket.customerId}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            TÉCNICO
                        </span>

                        <strong className="detail-monospace">
                            {ticket.technicianId ||
                                'Não atribuído'}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            CRIADO EM
                        </span>

                        <strong>
                            {formatDate(
                                ticket.createdAt
                            )}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            ATUALIZADO EM
                        </span>

                        <strong>
                            {formatDate(
                                ticket.updatedAt
                            )}
                        </strong>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TicketDetails