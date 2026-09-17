import { useState } from 'react'

import apiFetch from '../services/api'
import { setToken } from '../services/auth'

import './Login.css'

function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')

        if (!email || !password) {
            setError('Informe seu e-mail e sua senha.')
            return
        }

        setIsLoading(true)

        try {
            const response = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (!response.ok) {
                throw new Error('E-mail ou senha inválidos.')
            }

            const data = await response.json()

            setToken(data.token)

            onLogin(data.token)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="login-page">
            <div className="login-background">
                <div className="scan-line"></div>
            </div>

            <section className="login-card">
                <div className="login-logo">
                    <div className="login-logo-mark">
                        H
                    </div>

                    <div>
                        <strong>HELPDESK</strong>
                        <span>CONTROL CENTER</span>
                    </div>
                </div>

                <div className="login-heading">
                    <p>SYSTEM // AUTHENTICATION</p>

                    <h1>Acesso ao sistema</h1>

                    <span>
                        Entre com suas credenciais para continuar.
                    </span>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="login-form-group">
                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value)
                            }}
                        />
                    </div>

                    <div className="login-form-group">
                        <label htmlFor="password">
                            Senha
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value)
                            }}
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'AUTENTICANDO...'
                            : 'ENTRAR NO SISTEMA'}
                    </button>
                </form>

                <div className="login-footer">
                    <span>SECURE CONNECTION</span>
                    <span>JWT // ACTIVE</span>
                </div>
            </section>
        </main>
    )
}

export default Login