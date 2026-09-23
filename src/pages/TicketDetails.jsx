import { useEffect, useState } from 'react'

import {
    Link,
    useNavigate,
    useParams,
} from 'react-router'

import {
    assignTechnician,
    claimTicket,
    closeTicket,
    deleteTicket,
    getTicketById,
    updateTicket,
} from '../services/ticketService'

import {
    getUserSummary,
    getUsers,
} from '../services/userService'

import { getAuthenticatedUser } from '../services/auth'

import './TicketDetails.css'

const statusLabels = {
    OPEN: 'Aberto',
    IN_PROGRESS: 'Em atendimento',
    WAITING: 'Aguardando',
    RESOLVED: 'Resolvido',
    CLOSED: 'Fechado',
}

const priorityLabels = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
    CRITICAL: 'Crítica',
}

const categoryLabels = {
    HARDWARE: 'Hardware',
    SOFTWARE: 'Software',
    NETWORK: 'Rede',
    ACCESS: 'Acesso',
    OTHER: 'Outro',
}

const statusOptions = [
    'OPEN',
    'IN_PROGRESS',
    'WAITING',
    'RESOLVED',
    'CLOSED',
]

const priorityOptions = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL',
]

const categoryOptions = [
    'HARDWARE',
    'SOFTWARE',
    'NETWORK',
    'ACCESS',
    'OTHER',
]

function formatDate(date) {
    if (!date) {
        return '-'
    }

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(date))
}

function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message
    }

    return 'Ocorreu um erro inesperado.'
}

function getStatusClass(status) {
    switch (status) {
        case 'OPEN':
            return 'status-open'
        case 'IN_PROGRESS':
            return 'status-progress'
        case 'WAITING':
            return 'status-waiting'
        case 'RESOLVED':
            return 'status-resolved'
        case 'CLOSED':
            return 'status-closed'
        default:
            return ''
    }
}

function getPriorityClass(priority) {
    switch (priority) {
        case 'LOW':
            return 'priority-low'
        case 'MEDIUM':
            return 'priority-medium'
        case 'HIGH':
            return 'priority-high'
        case 'CRITICAL':
            return 'priority-critical'
        default:
            return ''
    }
}

export default function TicketDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [ticket, setTicket] = useState(null)

    const [technicians, setTechnicians] =
        useState([])

    const [customerName, setCustomerName] =
        useState('')

    const [technicianName, setTechnicianName] =
        useState('')

    const [loading, setLoading] =
        useState(true)

    const [saving, setSaving] =
        useState(false)

    const [assigning, setAssigning] =
        useState(false)

    const [claiming, setClaiming] =
        useState(false)

    const [closing, setClosing] =
        useState(false)

    const [deleting, setDeleting] =
        useState(false)

    const [error, setError] =
        useState('')

    const [success, setSuccess] =
        useState('')

    const [description, setDescription] =
        useState('')

    const [category, setCategory] =
        useState('')

    const [priority, setPriority] =
        useState('')

    const [status, setStatus] =
        useState('')

    const [technicianId, setTechnicianId] =
        useState('')

    const user = getAuthenticatedUser()

    const canEdit =
        user?.role === 'ADMIN' ||
        user?.role === 'TECHNICIAN'

    const canAssign =
        user?.role === 'ADMIN'

    const canClaim =
        user?.role === 'TECHNICIAN' &&
        ticket?.status !== 'CLOSED' &&
        !ticket?.technicianId

    const canClose =
        user?.role === 'ADMIN' ||
        user?.role === 'TECHNICIAN'

    const canDelete =
        user?.role === 'ADMIN'

    const sameTechnician =
        Boolean(ticket?.technicianId) &&
        technicianId === ticket.technicianId

    async function resolveCustomerName(
        customerId
    ) {
        if (!customerId) {
            return '-'
        }

        if (customerId === user?.id) {
            return (
                user.name ||
                user.email ||
                customerId
            )
        }

        try {
            const customer =
                await getUserSummary(
                    customerId
                )

            return customer.name ||
                customerId
        } catch {
            return customerId
        }
    }

    async function resolveTechnicianName(
        technicianIdValue
    ) {
        if (!technicianIdValue) {
            return 'Não atribuído'
        }

        if (
            technicianIdValue === user?.id &&
            user?.role === 'TECHNICIAN'
        ) {
            return 'Você'
        }

        try {
            const technician =
                await getUserSummary(
                    technicianIdValue
                )

            return technician.name ||
                technicianIdValue
        } catch {
            return technicianIdValue
        }
    }

    async function loadTicket() {
        try {
            setLoading(true)
            setError('')

            const data =
                await getTicketById(id)

            setTicket(data)

            setDescription(
                data.description || ''
            )

            setCategory(
                data.category || ''
            )

            setPriority(
                data.priority || ''
            )

            setStatus(
                data.status || ''
            )

            setTechnicianId(
                data.technicianId || ''
            )

            const [
                resolvedCustomerName,
                resolvedTechnicianName,
            ] = await Promise.all([
                resolveCustomerName(
                    data.customerId
                ),
                resolveTechnicianName(
                    data.technicianId
                ),
            ])

            setCustomerName(
                resolvedCustomerName
            )

            setTechnicianName(
                resolvedTechnicianName
            )
        } catch (err) {
            setError(
                getErrorMessage(err)
            )
        } finally {
            setLoading(false)
        }
    }

    async function loadTechnicians() {
        try {
            const users =
                await getUsers()

            const activeTechnicians =
                users.filter(
                    (item) =>
                        item.role ===
                        'TECHNICIAN' &&
                        item.active === true
                )

            setTechnicians(
                activeTechnicians
            )
        } catch (err) {
            console.error(
                'Erro ao carregar técnicos:',
                err
            )
        }
    }

    useEffect(() => {
        loadTicket()
    }, [id])

    useEffect(() => {
        if (canAssign) {
            loadTechnicians()
        }
    }, [canAssign])

    async function handleSave() {
        try {
            setSaving(true)
            setError('')
            setSuccess('')

            const updatedTicket =
                await updateTicket(
                    id,
                    {
                        description,
                        category,
                        priority,
                        status,
                    }
                )

            setTicket(updatedTicket)

            setDescription(
                updatedTicket.description || ''
            )

            setCategory(
                updatedTicket.category || ''
            )

            setPriority(
                updatedTicket.priority || ''
            )

            setStatus(
                updatedTicket.status || ''
            )

            setTechnicianId(
                updatedTicket.technicianId || ''
            )

            setSuccess(
                'Chamado atualizado com sucesso.'
            )
        } catch (err) {
            setError(
                getErrorMessage(err)
            )
        } finally {
            setSaving(false)
        }
    }

    async function handleAssign() {
        if (!technicianId) {
            setError(
                'Selecione um técnico para atribuir o chamado.'
            )

            return
        }

        if (sameTechnician) {
            setError(
                'Este técnico já está atribuído a este chamado.'
            )

            return
        }

        try {
            setAssigning(true)
            setError('')
            setSuccess('')

            const updatedTicket =
                await assignTechnician(
                    id,
                    technicianId
                )

            setTicket(updatedTicket)

            setTechnicianId(
                updatedTicket.technicianId ||
                technicianId
            )

            const technician =
                technicians.find(
                    (item) =>
                        item.id ===
                        (
                            updatedTicket.technicianId ||
                            technicianId
                        )
                )

            setTechnicianName(
                technician?.name ||
                'Técnico atribuído'
            )

            setSuccess(
                'Técnico atribuído com sucesso.'
            )
        } catch (err) {
            setError(
                getErrorMessage(err)
            )
        } finally {
            setAssigning(false)
        }
    }

    async function handleClaim() {
        const confirmed =
            window.confirm(
                'Deseja assumir este chamado para você?'
            )

        if (!confirmed) {
            return
        }

        try {
            setClaiming(true)
            setError('')
            setSuccess('')

            const updatedTicket =
                await claimTicket(id)

            setTicket(updatedTicket)

            setTechnicianId(
                updatedTicket.technicianId ||
                user.id
            )

            setTechnicianName('Você')

            setSuccess(
                'Chamado atribuído a você com sucesso.'
            )
        } catch (err) {
            setError(
                getErrorMessage(err)
            )
        } finally {
            setClaiming(false)
        }
    }

    async function handleClose() {
        const confirmed =
            window.confirm(
                'Tem certeza que deseja fechar este chamado?'
            )

        if (!confirmed) {
            return
        }

        try {
            setClosing(true)
            setError('')
            setSuccess('')

            await closeTicket(id)

            await loadTicket()

            setSuccess(
                'Chamado fechado com sucesso.'
            )
        } catch (err) {
            setError(
                getErrorMessage(err)
            )
        } finally {
            setClosing(false)
        }
    }

    async function handleDelete() {
        const confirmed =
            window.confirm(
                'Tem certeza que deseja inativar este chamado? Ele será removido da listagem de chamados, mas continuará armazenado no histórico.'
            )

        if (!confirmed) {
            return
        }

        try {
            setDeleting(true)
            setError('')
            setSuccess('')

            await deleteTicket(id)

            navigate('/tickets')
        } catch (err) {
            setError(
                getErrorMessage(err)
            )
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <main className="ticket-details">
                <div className="details-loading">
                    Carregando chamado...
                </div>
            </main>
        )
    }

    if (error && !ticket) {
        return (
            <main className="ticket-details">
                <div className="details-error">
                    <p>{error}</p>

                    <Link
                        to="/tickets"
                        className="secondary-button"
                    >
                        Voltar para chamados
                    </Link>
                </div>
            </main>
        )
    }

    if (!ticket) {
        return (
            <main className="ticket-details">
                <div className="details-error">
                    <p>
                        Chamado não encontrado.
                    </p>

                    <Link
                        to="/tickets"
                        className="secondary-button"
                    >
                        Voltar para chamados
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="ticket-details">
            <div className="details-topbar">
                <div>
                    <span className="header-label">
                        CENTRAL DE CHAMADOS
                    </span>

                    <h1>
                        Detalhes do chamado
                    </h1>
                </div>

                <Link
                    to="/tickets"
                    className="secondary-button"
                >
                    ← Voltar
                </Link>
            </div>

            {error && (
                <div className="details-message details-message-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="details-message details-message-success">
                    {success}
                </div>
            )}

            <section className="details-card">
                <div className="details-card-header">
                    <div>
                        <span className="detail-id">
                            CHAMADO #{ticket.id}
                        </span>

                        <h2>
                            {ticket.title}
                        </h2>
                    </div>

                    <span
                        className={`status-badge ${getStatusClass(
                            ticket.status
                        )}`}
                    >
                        {
                            statusLabels[
                                ticket.status
                                ] ||
                            ticket.status
                        }
                    </span>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <span>Categoria</span>

                        <strong>
                            {
                                categoryLabels[
                                    ticket.category
                                    ] ||
                                ticket.category ||
                                '-'
                            }
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Prioridade</span>

                        <strong
                            className={`priority-badge ${getPriorityClass(
                                ticket.priority
                            )}`}
                        >
                            {
                                priorityLabels[
                                    ticket.priority
                                    ] ||
                                ticket.priority ||
                                '-'
                            }
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Cliente</span>

                        <strong>
                            {customerName ||
                                ticket.customerId ||
                                '-'}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Técnico</span>

                        <strong>
                            {technicianName ||
                                'Não atribuído'}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Criado em</span>

                        <strong>
                            {formatDate(
                                ticket.createdAt
                            )}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Atualizado em</span>

                        <strong>
                            {formatDate(
                                ticket.updatedAt
                            )}
                        </strong>
                    </div>
                </div>

                <div className="description-section">
                    <span>DESCRIÇÃO</span>

                    <p>
                        {ticket.description}
                    </p>
                </div>
            </section>

            {canClaim && (
                <section className="details-card">
                    <div className="details-card-header">
                        <div>
                            <span className="header-label">
                                ATENDIMENTO
                            </span>

                            <h2>
                                Assumir chamado
                            </h2>
                        </div>
                    </div>

                    <div className="assign-form">
                        <p>
                            Este chamado ainda não possui um técnico responsável.
                            Você pode assumi-lo para iniciar o atendimento.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={
                                handleClaim
                            }
                            disabled={claiming}
                        >
                            {claiming
                                ? 'ASSUMINDO...'
                                : 'ASSUMIR CHAMADO'}
                        </button>
                    </div>
                </section>
            )}

            {canEdit &&
                ticket.status !== 'CLOSED' && (
                    <section className="details-card">
                        <div className="details-card-header">
                            <div>
                                <span className="header-label">
                                    GERENCIAMENTO
                                </span>

                                <h2>
                                    Atualizar chamado
                                </h2>
                            </div>
                        </div>

                        <div className="edit-form">
                            <div className="form-group">
                                <label htmlFor="description">
                                    Descrição
                                </label>

                                <textarea
                                    id="description"
                                    value={
                                        description
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDescription(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Descreva o problema..."
                                />
                            </div>

                            <div className="edit-form-row">
                                <div className="form-group">
                                    <label htmlFor="category">
                                        Categoria
                                    </label>

                                    <select
                                        id="category"
                                        value={
                                            category
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCategory(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        {categoryOptions.map(
                                            (
                                                option
                                            ) => (
                                                <option
                                                    key={
                                                        option
                                                    }
                                                    value={
                                                        option
                                                    }
                                                >
                                                    {
                                                        categoryLabels[
                                                            option
                                                            ]
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="priority">
                                        Prioridade
                                    </label>

                                    <select
                                        id="priority"
                                        value={
                                            priority
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPriority(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        {priorityOptions.map(
                                            (
                                                option
                                            ) => (
                                                <option
                                                    key={
                                                        option
                                                    }
                                                    value={
                                                        option
                                                    }
                                                >
                                                    {
                                                        priorityLabels[
                                                            option
                                                            ]
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">
                                        Status
                                    </label>

                                    <select
                                        id="status"
                                        value={
                                            status
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setStatus(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        {statusOptions.map(
                                            (
                                                option
                                            ) => (
                                                <option
                                                    key={
                                                        option
                                                    }
                                                    value={
                                                        option
                                                    }
                                                >
                                                    {
                                                        statusLabels[
                                                            option
                                                            ]
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        handleSave
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? 'SALVANDO...'
                                        : 'SALVAR ALTERAÇÕES'}
                                </button>
                            </div>
                        </div>
                    </section>
                )}

            {canAssign &&
                ticket.status !== 'CLOSED' && (
                    <section className="details-card">
                        <div className="details-card-header">
                            <div>
                                <span className="header-label">
                                    RESPONSÁVEL
                                </span>

                                <h2>
                                    Atribuir técnico
                                </h2>
                            </div>
                        </div>

                        <div className="assign-form">
                            <div className="form-group">
                                <label htmlFor="technician">
                                    Técnico responsável
                                </label>

                                <select
                                    id="technician"
                                    value={
                                        technicianId
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setTechnicianId(
                                            event
                                                .target
                                                .value
                                        )

                                        setError('')
                                        setSuccess('')
                                    }}
                                >
                                    <option value="">
                                        Selecione um técnico
                                    </option>

                                    {technicians.map(
                                        (
                                            technician
                                        ) => (
                                            <option
                                                key={
                                                    technician.id
                                                }
                                                value={
                                                    technician.id
                                                }
                                            >
                                                {
                                                    technician.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={
                                    handleAssign
                                }
                                disabled={
                                    assigning ||
                                    !technicianId ||
                                    sameTechnician
                                }
                            >
                                {assigning
                                    ? 'ATRIBUINDO...'
                                    : sameTechnician
                                        ? 'TÉCNICO JÁ ATRIBUÍDO'
                                        : 'ATRIBUIR TÉCNICO'}
                            </button>
                        </div>
                    </section>
                )}

            {canClose &&
                ticket.status !== 'CLOSED' && (
                    <section className="details-card details-danger-card">
                        <div>
                            <span className="header-label">
                                FINALIZAÇÃO
                            </span>

                            <h2>
                                Encerrar chamado
                            </h2>

                            <p>
                                Use esta ação quando o atendimento estiver
                                concluído.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="danger-button"
                            onClick={
                                handleClose
                            }
                            disabled={closing}
                        >
                            {closing
                                ? 'FECHANDO...'
                                : 'FECHAR CHAMADO'}
                        </button>
                    </section>
                )}

            {canDelete && (
                <section className="details-card details-danger-card">
                    <div>
                        <span className="header-label">
                            ADMINISTRAÇÃO
                        </span>

                        <h2>
                            Inativar chamado
                        </h2>

                        <p>
                            O chamado será removido das listagens, mas
                            continuará armazenado no histórico.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="danger-button"
                        onClick={
                            handleDelete
                        }
                        disabled={deleting}
                    >
                        {deleting
                            ? 'INATIVANDO...'
                            : 'INATIVAR CHAMADO'}
                    </button>
                </section>
            )}

            {ticket.status === 'CLOSED' && (
                <section className="closed-banner">
                    <strong>
                        CHAMADO ENCERRADO
                    </strong>

                    <span>
                        Este chamado não possui mais ações de edição.
                    </span>
                </section>
            )}
        </main>
    )
}