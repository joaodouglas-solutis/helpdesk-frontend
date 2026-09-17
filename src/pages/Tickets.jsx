function Tickets({ user }) {
    return (
        <section className="dashboard">
            <div className="welcome">
                <p className="welcome-label">
                    TICKET // MANAGEMENT
                </p>

                <h2>
                    Chamados
                </h2>

                <p>
                    Gerenciamento e acompanhamento dos chamados.
                </p>
            </div>

            <section className="tickets-section">
                <div className="section-heading">
                    <div>
                        <p className="welcome-label">
                            SYSTEM
                        </p>

                        <h2>
                            Central de chamados
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="primary-button"
                    >
                        + Novo chamado
                    </button>
                </div>

                <div className="ticket-state">
                    Em breve vamos trazer aqui a lista completa
                    de chamados.
                </div>
            </section>
        </section>
    )
}

export default Tickets