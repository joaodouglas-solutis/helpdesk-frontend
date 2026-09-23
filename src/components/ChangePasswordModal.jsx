import { useState } from 'react'
import { changeOwnPassword } from '../services/userService'
import './ChangePasswordModal.css'

function ChangePasswordModal({ onClose }) {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    function handleChange(event) {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')
        setSuccess('')

        if (
            !form.currentPassword ||
            !form.newPassword ||
            !form.confirmPassword
        ) {
            setError('Preencha todos os campos.')
            return
        }

        if (form.newPassword.length < 8) {
            setError(
                'A nova senha deve possuir pelo menos 8 caracteres.'
            )
            return
        }

        if (form.newPassword !== form.confirmPassword) {
            setError(
                'A confirmação da nova senha não confere.'
            )
            return
        }

        if (form.currentPassword === form.newPassword) {
            setError(
                'A nova senha deve ser diferente da senha atual.'
            )
            return
        }

        try {
            setLoading(true)

            await changeOwnPassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            })

            setSuccess('Senha alterada com sucesso.')

            setForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (err) {
            setError(
                err.message ||
                'Não foi possível alterar a senha.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="password-modal-overlay"
            onMouseDown={onClose}
        >
            <div
                className="password-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="password-modal-header">
                    <div className="password-modal-heading">
                        <div className="password-modal-icon">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <rect
                                    x="4"
                                    y="10"
                                    width="16"
                                    height="10"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />

                                <path
                                    d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />

                                <circle
                                    cx="12"
                                    cy="15"
                                    r="1.2"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        <div>
                            <h2>
                                Alterar senha
                            </h2>

                            <p>
                                Atualize as credenciais da sua conta.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="password-modal-close"
                        onClick={onClose}
                        aria-label="Fechar"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="password-form"
                >
                    <div className="password-field">
                        <label htmlFor="currentPassword">
                            Senha atual
                        </label>

                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={form.currentPassword}
                            onChange={handleChange}
                            autoComplete="current-password"
                            placeholder="Digite sua senha atual"
                            disabled={loading}
                        />
                    </div>

                    <div className="password-field">
                        <label htmlFor="newPassword">
                            Nova senha
                        </label>

                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={form.newPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            placeholder="Digite sua nova senha"
                            disabled={loading}
                        />

                        <span className="password-help">
                            Mínimo de 8 caracteres.
                        </span>
                    </div>

                    <div className="password-field">
                        <label htmlFor="confirmPassword">
                            Confirmar nova senha
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            placeholder="Digite novamente a nova senha"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="password-message password-message-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="password-message password-message-success">
                            {success}
                        </div>
                    )}

                    <div className="password-actions">
                        <button
                            type="button"
                            className="password-button password-button-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="password-button password-button-primary"
                            disabled={loading}
                        >
                            {loading
                                ? 'ALTERANDO...'
                                : 'ALTERAR SENHA'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordModal

