import { useCallback, useEffect, useState } from 'react'

import { Link } from 'react-router'

import {
    clearNotifications,
    getNotifications,
} from '../services/notificationService'

import './Notifications.css'

function Notifications() {
    const [notifications, setNotifications] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    const [isClearing, setIsClearing] = useState(false)

    const [error, setError] = useState('')

    const [success, setSuccess] = useState('')

    const loadNotifications = useCallback(
        async () => {
            try {
                setIsLoading(true)
                setError('')
                setSuccess('')

                const data = await getNotifications()

                setNotifications(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    useEffect(() => {
        loadNotifications()
    }, [loadNotifications])

    async function handleClearNotifications() {
        if (notifications.length === 0) {
            return
        }

        const confirmed = window.confirm(
            'Tem certeza que deseja limpar todas as notificações? Elas serão removidas da central, mas continuarão armazenadas no histórico.'
        )

        if (!confirmed) {
            return
        }

        try {
            setIsClearing(true)
            setError('')
            setSuccess('')

            await clearNotifications()

            setNotifications([])

            setSuccess(
                'Notificações limpas com sucesso.'
            )
        } catch (error) {
            setError(error.message)
        } finally {
            setIsClearing(false)
        }
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return 'Data não informada'
        }

        return new Date(dateValue).toLocaleString(
            'pt-BR'
        )
    }

    function getEventLabel(eventType) {
        const labels = {
            TicketCreated: 'CHAMADO CRIADO',
            TicketAssigned: 'TÉCNICO ATRIBUÍDO',
            TicketStatusChanged: 'STATUS ALTERADO',
        }

        return labels[eventType] || eventType
    }

    function getShortTicketId(ticketId) {
        return (
            ticketId
                ?.toString()
                .substring(0, 8) || '--------'
        )
    }

    return (
        <section className="notifications-page">
            <div className="notifications-header">
                <div>
                    <p className="welcome-label">
                        SYSTEM // NOTIFICATIONS
                    </p>

                    <h2>
                        Notificações
                    </h2>

                    <p>
                        Eventos e atualizações relacionados aos chamados.
                    </p>
                </div>

                <div className="notifications-header-actions">
                    <button
                        type="button"
                        className="notifications-clear"
                        onClick={handleClearNotifications}
                        disabled={
                            isLoading ||
                            isClearing ||
                            notifications.length === 0
                        }
                    >
                        {isClearing
                            ? 'Limpando...'
                            : '✕ Limpar notificações'}
                    </button>

                    <button
                        type="button"
                        className="notifications-refresh"
                        onClick={loadNotifications}
                        disabled={
                            isLoading ||
                            isClearing
                        }
                    >
                        ↻ Atualizar
                    </button>
                </div>
            </div>

            {success && (
                <div className="notifications-success">
                    {success}
                </div>
            )}

            {error && (
                <div className="notifications-error-banner">
                    {error}
                </div>
            )}

            <section className="notifications-panel">
                <div className="notifications-panel-header">
                    <h3 className="notifications-panel-title">
                        Central de eventos
                    </h3>

                    <span className="notifications-count">
                        {notifications.length}
                    </span>
                </div>

                {isLoading && (
                    <div className="notifications-state">
                        <div className="notifications-loading">
                            <span className="notifications-spinner"></span>
                            Carregando notificações...
                        </div>
                    </div>
                )}

                {!isLoading &&
                    !error &&
                    notifications.length === 0 && (
                        <div className="notifications-state">
                            Nenhuma notificação encontrada.
                        </div>
                    )}

                {!isLoading &&
                    !error &&
                    notifications.length > 0 && (
                        <div>
                            {notifications.map(
                                (notification) => (
                                    <article
                                        key={notification.id}
                                        className="notification-item"
                                    >
                                        <div className="notification-icon">
                                            ◉
                                        </div>

                                        <div className="notification-content">
                                            <p className="notification-message">
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            <div className="notification-meta">
                                                <span className="notification-event">
                                                    {
                                                        getEventLabel(
                                                            notification.eventType
                                                        )
                                                    }
                                                </span>

                                                <span className="notification-time">
                                                    {formatDate(
                                                        notification.createdAt
                                                    )}
                                                </span>

                                                {notification.ticketId && (
                                                    <Link
                                                        to={`/tickets/${notification.ticketId}`}
                                                        className="notification-ticket-link"
                                                    >
                                                        #{getShortTicketId(
                                                        notification.ticketId
                                                    )}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    )}
            </section>
        </section>
    )
}

export default Notifications