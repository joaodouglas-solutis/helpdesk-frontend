function Notifications({ user }) {
    return (
        <section className="dashboard">
            <div className="welcome">
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

            <section className="tickets-section">
                <div className="section-heading">
                    <div>
                        <p className="welcome-label">
                            EVENTS
                        </p>

                        <h2>
                            Central de notificações
                        </h2>
                    </div>
                </div>

                <div className="ticket-state">
                    Nenhuma notificação carregada ainda.
                </div>
            </section>
        </section>
    )
}

export default Notifications