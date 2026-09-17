function TicketRow({ id, title, priority }) {
    const priorityConfig = {
        LOW: {
            label: 'BAIXA',
            className: 'low',
        },

        MEDIUM: {
            label: 'MÉDIA',
            className: 'medium',
        },

        HIGH: {
            label: 'ALTA',
            className: 'high',
        },

        CRITICAL: {
            label: 'CRÍTICO',
            className: 'critical',
        },
    }

    const currentPriority =
        priorityConfig[priority] || {
            label: priority,
            className: '',
        }

    const shortId =
        id?.toString().substring(0, 8) || '--------'

    return (
        <div className="ticket-row">
            <div>
                <strong>
                    #{shortId}
                </strong>

                <span>
                    {title}
                </span>
            </div>

            <span
                className={`priority ${currentPriority.className}`}
            >
                {currentPriority.label}
            </span>
        </div>
    )
}

export default TicketRow