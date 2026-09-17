import { useEffect, useState } from 'react'

import { createTicket } from '../services/ticketService'
import { getUsers } from '../services/userService'

import './NewTicketModal.css'

function NewTicketModal({ user, onClose, onCreated }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('MEDIUM')
    const [category, setCategory] = useState('SOFTWARE')
    const [customerId, setCustomerId] = useState(
        user?.role === 'CLIENT' ? user.id : ''
    )

    const [clients, setClients] = useState([])
    const [isLoadingClients, setIsLoadingClients] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            return
        }

        async function loadClients() {
            try {
                setIsLoadingClients(true)
                setError('')

                const users = await getUsers()

                const activeClients = users.filter(
                    (currentUser) =>
                        currentUser.role === 'CLIENT' &&
                        currentUser.active
                )

                setClients(activeClients)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoadingClients(false)
            }
        }

        loadClients()
    }, [user?.role])

    function handleTitleChange(event) {
        setTitle(event.target.value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }

    function handlePriorityChange(event) {
        setPriority(event.target.value)
    }

    function handleCategoryChange(event) {
        setCategory(event.target.value)
    }

    function handleCustomerChange(event) {
        setCustomerId(event.target.value)
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')

        if (!title.trim()) {
            setError('Informe o título do chamado.')
            return
        }

        if (!description.trim()) {
            setError('Informe a descrição do chamado.')
            return
        }

        if (!customerId) {
            setError('Selecione o cliente do chamado.')
            return
        }

        setIsSubmitting(true)

        try {
            const createdTicket = await createTicket({
                title: title.trim(),
                description: description.trim(),
                priority,
                category,
                customerId,
            })

            onCreated(createdTicket)

            onClose()
        } catch (error) {
            setError(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="modal new-ticket-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <div>
                        <p className="welcome-label">
                            TICKET // CREATE
                        </p>

                        <h2>
                            Novo chamado
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                <p className="modal-description">
                    Registre uma nova solicitação para atendimento.
                </p>

                <form onSubmit={handleSubmit}>
                    {user?.role === 'ADMIN' && (
                        <div className="form-group">
                            <label htmlFor="customerId">
                                Cliente
                            </label>

                            <select
                                id="customerId"
                                value={customerId}
                                onChange={handleCustomerChange}
                                disabled={
                                    isLoadingClients ||
                                    isSubmitting
                                }
                            >
                                <option value="">
                                    {isLoadingClients
                                        ? 'Carregando clientes...'
                                        : 'Selecione um cliente'}
                                </option>

                                {clients.map((client) => (
                                    <option
                                        key={client.id}
                                        value={client.id}
                                    >
                                        {client.name} • {client.email}
                                    </option>
                                ))}
                            </select>

                            {isLoadingClients && (
                                <span className="customer-loading">
                                    Buscando clientes ativos...
                                </span>
                            )}
                        </div>
                    )}

                    {user?.role === 'CLIENT' && (
                        <div className="form-group">
                            <label>
                                Cliente
                            </label>

                            <input
                                type="text"
                                value={
                                    user.name ||
                                    user.email
                                }
                                disabled
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">
                            Título
                        </label>

                        <input
                            id="title"
                            type="text"
                            placeholder="Ex.: Notebook não liga"
                            value={title}
                            onChange={handleTitleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Descrição
                        </label>

                        <textarea
                            id="description"
                            placeholder="Descreva o problema..."
                            value={description}
                            onChange={handleDescriptionChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="priority">
                                Prioridade
                            </label>

                            <select
                                id="priority"
                                value={priority}
                                onChange={handlePriorityChange}
                                disabled={isSubmitting}
                            >
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

                        <div className="form-group">
                            <label htmlFor="category">
                                Categoria
                            </label>

                            <select
                                id="category"
                                value={category}
                                onChange={handleCategoryChange}
                                disabled={isSubmitting}
                            >
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

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                isSubmitting ||
                                isLoadingClients
                            }
                        >
                            {isSubmitting
                                ? 'CRIANDO...'
                                : 'Criar chamado'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewTicketModal