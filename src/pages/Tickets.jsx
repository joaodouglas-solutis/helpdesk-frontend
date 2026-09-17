import { useEffect, useState } from 'react'

import { Link } from 'react-router'

import NewTicketModal from '../components/NewTicketModal'
import { getTickets } from '../services/ticketService'

import './Tickets.css'

function Tickets({ user }) {
    const [tickets, setTickets] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [priorityFilter, setPriorityFilter] = useState('ALL')
    const [categoryFilter, setCategoryFilter] = useState('ALL')

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

    function handleTicketCreated(createdTicket) {
        setTickets((currentTickets) => [
            createdTicket,
            ...currentTickets,
        ])
    }

    const filteredTickets = tickets.filter((ticket) => {
        const normalizedSearch = search
            .trim()
            .toLowerCase()

        const matchesSearch =
            !normalizedSearch ||
            ticket.title
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            ticket.description
                ?.toLowerCase()
                .includes(normalizedSearch) ||
            ticket.id
                ?.toLowerCase()
                .includes(normalizedSearch)

        const matchesStatus =
            statusFilter === 'ALL' ||
            ticket.status === statusFilter

        const matchesPriority =
            priorityFilter === 'ALL' ||
            ticket.priority === priorityFilter

        const matchesCategory =
            categoryFilter === 'ALL' ||
            ticket.category === categoryFilter

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesCategory
        )
    })

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

    function getShortId(id) {
        return (
            id
                ?.toString()
                .substring(0, 8) || '--------'
        )
    }

    return (
        <>
            <section className="tickets-page">
                <div className="tickets-page-header">
                    <div>
                        <p className="welcome-label">
                            TICKET // MANAGEMENT
                        </p>

                        <h2>
                            Chamados
                        </h2>

                        <p>
                            Consulte, pesquise e filtre os chamados do sistema.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Novo chamado
                    </button>
                </div>

                <div className="tickets-toolbar">
                    <div className="ticket-search">
                        <span className="search-icon">
                            🔎
                        </span>

                        <input
                            type="text"
                            placeholder="Pesquisar por título, descrição ou ID..."
                            value={search}
                            onChange={(event) => {
                                setSearch(
                                    event.target.value
                                )
                            }}
                        />
                    </div>

                    <div className="ticket-filter">
                        <select
                            value={statusFilter}
                            onChange={(event) => {
                                setStatusFilter(
                                    event.target.value
                                )
                            }}
                        >
                            <option value="ALL">
                                Todos os status
                            </option>

                            <option value="OPEN">
                                Aberto
                            </option>

                            <option value="IN_PROGRESS">
                                Em atendimento
                            </option>

                            <option value="WAITING">
                                Aguardando
                            </option>

                            <option value="RESOLVED">
                                Resolvido
                            </option>

                            <option value="CLOSED">
                                Fechado
                            </option>
                        </select>
                    </div>

                    <div className="ticket-filter">
                        <select
                            value={priorityFilter}
                            onChange={(event) => {
                                setPriorityFilter(
                                    event.target.value
                                )
                            }}
                        >
                            <option value="ALL">
                                Todas as prioridades
                            </option>

                            <option value="LOW">
                                Baixa
                            </option>

                            <option value="MEDIUM">
                                Média
                            </option>

                            <option value="HIGH">
                                Alta
                            </option>

                            <option value="CRITICAL">
                                Crítica
                            </option>
                        </select>
                    </div>

                    <div className="ticket-filter">
                        <select
                            value={categoryFilter}
                            onChange={(event) => {
                                setCategoryFilter(
                                    event.target.value
                                )
                            }}
                        >
                            <option value="ALL">
                                Todas as categorias
                            </option>

                            <option value="HARDWARE">
                                Hardware
                            </option>

                            <option value="SOFTWARE">
                                Software
                            </option>

                            <option value="NETWORK">
                                Rede
                            </option>
                        </select>
                    </div>
                </div>

                <div className="tickets-table-container">
                    {isLoading && (
                        <div className="tickets-table-state">
                            Carregando chamados...
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="tickets-table-state tickets-error">
                            {error}
                        </div>
                    )}

                    {!isLoading &&
                        !error &&
                        filteredTickets.length === 0 && (
                            <div className="tickets-table-state">
                                {tickets.length === 0
                                    ? 'Nenhum chamado cadastrado.'
                                    : 'Nenhum chamado corresponde aos filtros.'}
                            </div>
                        )}

                    {!isLoading &&
                        !error &&
                        filteredTickets.length > 0 && (
                            <table className="tickets-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Categoria</th>
                                    <th>Status</th>
                                    <th>Prioridade</th>
                                </tr>
                                </thead>

                                <tbody>
                                {filteredTickets.map(
                                    (ticket) => (
                                        <tr
                                            key={ticket.id}
                                        >
                                            <td className="ticket-id">
                                                <Link
                                                    to={`/tickets/${ticket.id}`}
                                                    className="ticket-id-link"
                                                >
                                                    #
                                                    {getShortId(
                                                        ticket.id
                                                    )}
                                                </Link>
                                            </td>

                                            <td className="ticket-title">
                                                <Link
                                                    to={`/tickets/${ticket.id}`}
                                                    className="ticket-title-link"
                                                >
                                                    {
                                                        ticket.title
                                                    }
                                                </Link>
                                            </td>

                                            <td className="ticket-category">
                                                {getCategoryLabel(
                                                    ticket.category
                                                )}
                                            </td>

                                            <td>
                                                    <span
                                                        className={`ticket-status ${getStatusClass(
                                                            ticket.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            ticket.status
                                                        )}
                                                    </span>
                                            </td>

                                            <td>
                                                    <span
                                                        className={`ticket-priority priority ${getPriorityClass(
                                                            ticket.priority
                                                        )}`}
                                                    >
                                                        {getPriorityLabel(
                                                            ticket.priority
                                                        )}
                                                    </span>
                                            </td>
                                        </tr>
                                    )
                                )}
                                </tbody>
                            </table>
                        )}
                </div>
            </section>

            {isModalOpen && (
                <NewTicketModal
                    user={user}
                    onClose={() =>
                        setIsModalOpen(false)
                    }
                    onCreated={
                        handleTicketCreated
                    }
                />
            )}
        </>
    )
}

export default Tickets