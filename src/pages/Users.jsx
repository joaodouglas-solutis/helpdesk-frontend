import { useEffect, useState } from 'react'

import {
    useNavigate,
} from 'react-router'

import {
    createUser,
    deactivateUser,
    getUsers,
} from '../services/userService'

import './Users.css'


const roleLabels = {
    CLIENT: 'Cliente',
    TECHNICIAN: 'Técnico',
    ADMIN: 'Administrador',
}


function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message
    }

    return 'Ocorreu um erro inesperado.'
}


function getStatusLabel(active) {
    return active ? 'Ativo' : 'Inativo'
}


function getRoleLabel(role) {
    return roleLabels[role] || role
}


function getRoleClass(role) {
    switch (role) {
        case 'CLIENT':
            return 'user-role-client'

        case 'TECHNICIAN':
            return 'user-role-technician'

        case 'ADMIN':
            return 'user-role-admin'

        default:
            return ''
    }
}


function getUserInitial(name) {
    if (!name) {
        return '?'
    }

    return name.charAt(0).toUpperCase()
}


function Users({ user }) {
    const navigate = useNavigate()

    const [users, setUsers] = useState([])

    const [activeSection, setActiveSection] =
        useState(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('TECHNICIAN')

    const [isLoadingUsers, setIsLoadingUsers] =
        useState(false)

    const [isSaving, setIsSaving] =
        useState(false)

    const [deactivatingId, setDeactivatingId] =
        useState(null)

    const [userToDeactivate, setUserToDeactivate] =
        useState(null)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')


    async function loadUsers() {
        try {
            setIsLoadingUsers(true)
            setError('')

            const data = await getUsers()

            setUsers(data)
        } catch (error) {
            setError(
                getErrorMessage(error)
            )
        } finally {
            setIsLoadingUsers(false)
        }
    }


    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            return
        }

        loadUsers()
    }, [user?.role])


    function resetMessages() {
        setError('')
        setSuccess('')
    }


    function openSection(section) {
        resetMessages()
        setActiveSection(section)

        if (section === 'deactivate') {
            loadUsers()
        }
    }


    function closeSection() {
        resetMessages()
        setActiveSection(null)
        setUserToDeactivate(null)
    }


    function resetForm() {
        setName('')
        setEmail('')
        setPassword('')
        setRole('TECHNICIAN')
    }


    async function handleSubmit(event) {
        event.preventDefault()

        resetMessages()

        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !role
        ) {
            setError(
                'Preencha todos os campos.'
            )

            return
        }

        if (password.length < 8) {
            setError(
                'A senha deve possuir pelo menos 8 caracteres.'
            )

            return
        }

        setIsSaving(true)

        try {
            await createUser({
                name: name.trim(),
                email: email.trim(),
                password,
                role,
            })

            setSuccess(
                'Usuário criado com sucesso.'
            )

            resetForm()

            await loadUsers()
        } catch (error) {
            setError(
                getErrorMessage(error)
            )
        } finally {
            setIsSaving(false)
        }
    }


    function openDeactivateModal(currentUser) {
        if (!currentUser?.id) {
            return
        }

        if (currentUser.id === user?.id) {
            setError(
                'Você não pode inativar a própria conta.'
            )

            return
        }

        if (
            currentUser.role !== 'CLIENT' &&
            currentUser.role !== 'TECHNICIAN'
        ) {
            setError(
                'Somente clientes e técnicos podem ser inativados por esta tela.'
            )

            return
        }

        if (!currentUser.active) {
            return
        }

        resetMessages()

        setUserToDeactivate(currentUser)
    }


    function closeDeactivateModal() {
        if (deactivatingId !== null) {
            return
        }

        setUserToDeactivate(null)
    }


    async function handleDeactivate() {
        if (!userToDeactivate?.id) {
            return
        }

        resetMessages()

        setDeactivatingId(
            userToDeactivate.id
        )

        try {
            await deactivateUser(
                userToDeactivate.id
            )

            const deactivatedUserName =
                userToDeactivate.name

            setUserToDeactivate(null)

            setSuccess(
                `Usuário "${deactivatedUserName}" inativado com sucesso.`
            )

            await loadUsers()
        } catch (error) {
            setError(
                getErrorMessage(error)
            )
        } finally {
            setDeactivatingId(null)
        }
    }


    const deactivatableUsers =
        users.filter((currentUser) => (
            currentUser.active &&
            currentUser.id !== user?.id &&
            (
                currentUser.role === 'CLIENT' ||
                currentUser.role === 'TECHNICIAN'
            )
        ))


    if (user?.role !== 'ADMIN') {
        return null
    }


    return (
        <section className="users-page">

            {/* =====================================================
                PAGE HEADER
               ===================================================== */}

            <div className="users-header">

                <div>

                    <p className="welcome-label">
                        SYSTEM // USER MANAGEMENT
                    </p>

                    <h2>
                        Gerenciar usuários
                    </h2>

                    <p>
                        Administre as contas e permissões da plataforma.
                    </p>

                </div>

            </div>


            {/* =====================================================
                GLOBAL MESSAGES
               ===================================================== */}

            {success && (
                <div className="users-success">
                    {success}
                </div>
            )}

            {error && (
                <div className="users-error">
                    {error}
                </div>
            )}


            {/* =====================================================
                MAIN ACTIONS
               ===================================================== */}

            {activeSection === null && (

                <section className="users-panel users-actions-panel">

                    <div className="users-panel-header">

                        <p className="users-panel-label">
                            SYSTEM // USER OPERATIONS
                        </p>

                        <h3 className="users-panel-title">
                            Administração de usuários
                        </h3>

                        <span className="users-panel-subtitle">
                            Selecione uma operação para continuar.
                        </span>

                    </div>


                    <div className="users-mode-actions">

                        <button
                            type="button"
                            className="users-mode-button users-mode-button-primary"
                            onClick={() =>
                                openSection('create')
                            }
                        >
                            <span className="users-mode-icon">
                                +
                            </span>

                            <span>
                                <strong>
                                    CADASTRAR USUÁRIO
                                </strong>

                                <small>
                                    Criar uma nova conta
                                </small>
                            </span>
                        </button>


                        <button
                            type="button"
                            className="users-mode-button users-mode-button-danger"
                            onClick={() =>
                                openSection('deactivate')
                            }
                        >
                            <span className="users-mode-icon">
                                ×
                            </span>

                            <span>
                                <strong>
                                    INATIVAR USUÁRIO
                                </strong>

                                <small>
                                    Remover acesso de uma conta
                                </small>
                            </span>
                        </button>

                    </div>

                </section>

            )}


            {/* =====================================================
                CREATE USER
               ===================================================== */}

            {activeSection === 'create' && (

                <section className="users-panel">

                    <div className="users-panel-header users-panel-header-with-action">

                        <div>

                            <p className="users-panel-label">
                                SYSTEM // NEW ACCOUNT
                            </p>

                            <h3 className="users-panel-title">
                                Cadastrar usuário
                            </h3>

                            <span className="users-panel-subtitle">
                                O nível de acesso será definido de acordo com o perfil selecionado.
                            </span>

                        </div>


                        <button
                            type="button"
                            className="users-panel-back-button"
                            onClick={closeSection}
                            disabled={isSaving}
                        >
                            ← VOLTAR
                        </button>

                    </div>


                    <form
                        className="users-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="users-form-group">

                            <label htmlFor="user-name">
                                Nome
                            </label>

                            <input
                                id="user-name"
                                type="text"
                                placeholder="Nome completo"
                                value={name}
                                onChange={(event) => {
                                    setName(
                                        event.target.value
                                    )
                                }}
                                autoComplete="name"
                                disabled={isSaving}
                            />

                        </div>


                        <div className="users-form-group">

                            <label htmlFor="user-email">
                                E-mail
                            </label>

                            <input
                                id="user-email"
                                type="email"
                                placeholder="usuario@email.com"
                                value={email}
                                onChange={(event) => {
                                    setEmail(
                                        event.target.value
                                    )
                                }}
                                autoComplete="email"
                                disabled={isSaving}
                            />

                        </div>


                        <div className="users-form-group">

                            <label htmlFor="user-password">
                                Senha
                            </label>

                            <input
                                id="user-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(event) => {
                                    setPassword(
                                        event.target.value
                                    )
                                }}
                                autoComplete="new-password"
                                disabled={isSaving}
                            />

                            <small>
                                Mínimo de 8 caracteres.
                            </small>

                        </div>


                        <div className="users-form-group">

                            <label htmlFor="user-role">
                                Perfil
                            </label>

                            <select
                                id="user-role"
                                value={role}
                                onChange={(event) => {
                                    setRole(
                                        event.target.value
                                    )
                                }}
                                disabled={isSaving}
                            >
                                <option value="CLIENT">
                                    Cliente
                                </option>

                                <option value="TECHNICIAN">
                                    Técnico
                                </option>

                                <option value="ADMIN">
                                    Administrador
                                </option>

                            </select>

                        </div>


                        <div className="users-form-actions">

                            <button
                                type="button"
                                className="users-cancel-button"
                                onClick={closeSection}
                                disabled={isSaving}
                            >
                                VOLTAR
                            </button>


                            <button
                                type="submit"
                                className="users-save-button"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? 'CRIANDO...'
                                    : 'CRIAR USUÁRIO'}
                            </button>

                        </div>

                    </form>

                </section>

            )}


            {/* =====================================================
                DEACTIVATE USER
               ===================================================== */}

            {activeSection === 'deactivate' && (

                <section className="users-list-panel">

                    <div className="users-list-header">

                        <div className="users-list-heading">

                            <span className="users-list-label">
                                SYSTEM // ACCESS CONTROL
                            </span>

                            <h3 className="users-list-title">
                                Inativar usuário
                            </h3>

                            <span className="users-panel-subtitle">
                                Selecione um cliente ou técnico para remover seu acesso.
                            </span>

                        </div>


                        <div className="users-list-header-actions">

                            <span className="users-list-count">
                                {deactivatableUsers.length}
                            </span>

                            <button
                                type="button"
                                className="users-panel-back-button"
                                onClick={closeSection}
                                disabled={
                                    deactivatingId !== null
                                }
                            >
                                ← VOLTAR
                            </button>

                        </div>

                    </div>


                    {isLoadingUsers ? (

                        <div className="users-loading">
                            Carregando usuários...
                        </div>

                    ) : deactivatableUsers.length === 0 ? (

                        <div className="users-list-state">
                            Não há usuários ativos disponíveis para inativação.
                        </div>

                    ) : (

                        <div className="users-table-container">

                            <table className="users-table">

                                <thead>
                                    <tr>

                                        <th>
                                            Usuário
                                        </th>

                                        <th>
                                            E-mail
                                        </th>

                                        <th>
                                            Perfil
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Ação
                                        </th>

                                    </tr>
                                </thead>


                                <tbody>

                                    {deactivatableUsers.map(
                                        (currentUser) => (

                                            <tr
                                                key={
                                                    currentUser.id
                                                }
                                            >

                                                <td>

                                                    <div className="user-name-cell">

                                                        <div className="user-table-avatar">
                                                            {
                                                                getUserInitial(
                                                                    currentUser.name
                                                                )
                                                            }
                                                        </div>


                                                        <div className="user-name">
                                                            {
                                                                currentUser.name
                                                            }
                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span className="user-email">
                                                        {
                                                            currentUser.email
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`user-role-badge ${getRoleClass(
    currentUser.role
)}`}
                                                    >
                                                        {
                                                            getRoleLabel(
                                                                currentUser.role
                                                            )
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="user-status-badge user-status-active">
                                                        {
                                                            getStatusLabel(
                                                                currentUser.active
                                                            )
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="user-actions">

                                                        <button
                                                            type="button"
                                                            className="user-deactivate-button"
                                                            onClick={() =>
                                                                openDeactivateModal(
                                                                    currentUser
                                                                )
                                                            }
                                                            disabled={
                                                                deactivatingId ===
                                                                currentUser.id
                                                            }
                                                            title="Inativar usuário"
                                                        >

                                                            <svg
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                aria-hidden="true"
                                                            >

                                                                <circle
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="9"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                />

                                                                <path
                                                                    d="M8.5 8.5L15.5 15.5"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />

                                                                <path
                                                                    d="M15.5 8.5L8.5 15.5"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                />

                                                            </svg>

                                                            INATIVAR

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            )}


            {/* =====================================================
                DEACTIVATE MODAL
               ===================================================== */}

            {userToDeactivate && (

                <div
                    className="deactivate-modal-overlay"
                    onMouseDown={closeDeactivateModal}
                >

                    <div
                        className="deactivate-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="deactivate-modal-icon">

                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />

                                <path
                                    d="M12 7V13"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />

                                <circle
                                    cx="12"
                                    cy="16.5"
                                    r="1"
                                    fill="currentColor"
                                />

                            </svg>

                        </div>


                        <span className="header-label">
                            AÇÃO ADMINISTRATIVA
                        </span>


                        <h2>
                            Inativar usuário
                        </h2>


                        <p>
                            Você está prestes a inativar:
                        </p>


                        <div className="deactivate-user-preview">

                            <strong>
                                {
                                    userToDeactivate.name
                                }
                            </strong>

                            <span>
                                {
                                    userToDeactivate.email
                                }
                            </span>

                        </div>


                        <p className="deactivate-warning">
                            O usuário perderá acesso ao sistema.
                            Esta ação não exclui os dados do usuário.
                        </p>


                        <div className="deactivate-modal-actions">

                            <button
                                type="button"
                                className="users-cancel-button"
                                onClick={
                                    closeDeactivateModal
                                }
                                disabled={
                                    deactivatingId !== null
                                }
                            >
                                CANCELAR
                            </button>


                            <button
                                type="button"
                                className="user-confirm-deactivate-button"
                                onClick={
                                    handleDeactivate
                                }
                                disabled={
                                    deactivatingId !== null
                                }
                            >
                                {
                                    deactivatingId !== null
                                        ? 'INATIVANDO...'
                                        : 'CONFIRMAR INATIVAÇÃO'
                                }
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>
    )
}


export default Users

