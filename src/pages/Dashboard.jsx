import { useEffect, useState } from 'react'

import { Link } from 'react-router'

import StatCard from '../components/StatCard'
import TicketRow from '../components/TicketRow'
import NewTicketModal from '../components/NewTicketModal'

import { getTickets } from '../services/ticketService'


function Dashboard({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [tickets, setTickets] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    const [error, setError] = useState('')

    const userName =
        user?.name || user?.email || 'usuário'


    useEffect(() => {
        async function loadTickets() {
            try {
                setIsLoading(true)
                setError('')

                const data = await getTickets()

                setTickets(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        loadTickets()
    }, [])


    const totalTickets = tickets.length

    const openTickets = tickets.filter(
        (ticket) => ticket.status === 'OPEN'
    ).length

    const inProgressTickets = tickets.filter(
        (ticket) => ticket.status === 'IN_PROGRESS'
    ).length

    const resolvedTickets = tickets.filter(
        (ticket) => ticket.status === 'RESOLVED'
    ).length

    const criticalTickets = tickets.filter(
        (ticket) => ticket.priority === 'CRITICAL'
    ).length


    const recentTickets = tickets.slice(0, 5)


    function handleTicketCreated(createdTicket) {
        setTickets((currentTickets) => [
            createdTicket,
            ...currentTickets,
        ])
    }


    return (
        <section className="dashboard">

            <div className="welcome">

                <p className="welcome-label">
                    SYSTEM OVERVIEW
                </p>

                <h2>
                    Olá, {userName} 👋
                </h2>

                <p>
                    Monitoramento dos chamados e operações do sistema.
                </p>

            </div>


            <div className="stats-grid">

                <StatCard
                    title="Total de chamados"
                    value={totalTickets}
                    description="Todos os chamados"
                />

                <StatCard
                    title="Chamados abertos"
                    value={openTickets}
                    description="Aguardando atendimento"
                />

                <StatCard
                    title="Em atendimento"
                    value={inProgressTickets}
                    description="Em andamento"
                />

                <StatCard
                    title="Chamados resolvidos"
                    value={resolvedTickets}
                    description="Atendimento concluído"
                />

                <StatCard
                    title="Chamados críticos"
                    value={criticalTickets}
                    description="Prioridade crítica"
                />

            </div>


            <section className="tickets-section">

                <div className="section-heading">

                    <div>

                        <p className="welcome-label">
                            ATENDIMENTO
                        </p>

                        <h2>
                            Chamados recentes
                        </h2>

                    </div>


                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                        }}
                    >

                        {user?.role === 'ADMIN' && (
                            <Link
                                to="/users"
                                className="primary-button"
                                title="Gerenciamento de usuários"
                            >
                                Gerenciamento de usuários
                            </Link>
                        )}


                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Novo chamado
                        </button>

                    </div>

                </div>


                {isLoading && (
                    <div className="ticket-state">
                        <span className="loading-indicator"></span>
                        Carregando chamados...
                    </div>
                )}


                {!isLoading && error && (
                    <div className="ticket-state ticket-error">
                        {error}
                    </div>
                )}


                {!isLoading &&
                    !error &&
                    recentTickets.length === 0 && (
                        <div className="ticket-state">
                            Nenhum chamado encontrado.
                        </div>
                    )}


                {!isLoading &&
                    !error &&
                    recentTickets.length > 0 && (
                        <div className="ticket-list">

                            {recentTickets.map((ticket) => (
                                <TicketRow
                                    key={ticket.id}
                                    id={ticket.id}
                                    title={ticket.title}
                                    priority={ticket.priority}
                                />
                            ))}

                        </div>
                    )}

            </section>


            {isModalOpen && (
                <NewTicketModal
                    user={user}
                    onClose={() => setIsModalOpen(false)}
                    onCreated={handleTicketCreated}
                />
            )}

        </section>
    )
}


export default Dashboard

