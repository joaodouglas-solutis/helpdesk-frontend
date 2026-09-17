import { useCallback, useEffect, useState } from 'react'

import { Link } from 'react-router'

import { getNotifications } from '../services/notificationService'

import './Notifications.css'

function Notifications() {
    const [notifications, setNotifications] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    const [error, setError] = useState('')

    const loadNotifications = useCallback(
        async () => {
            try {
                setIsLoading(true)
                setError('')

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

                <button
                    type="button"
                    className="notifications-refresh"
                    onClick={loadNotifications}
                    disabled={isLoading}
                >
                    ↻ Atualizar
                </button>
            </div>

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

                {!isLoading && error && (
                    <div className="notifications-state notifications-error">
                        {error}
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