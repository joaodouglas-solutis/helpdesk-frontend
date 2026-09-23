import { useState } from 'react'

import {
    Link,
    useNavigate,
} from 'react-router'

import { registerUser } from '../services/userService'

import './Register.css'

function Register() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')

        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
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

        if (password !== confirmPassword) {
            setError(
                'As senhas não conferem.'
            )

            return
        }

        setIsLoading(true)

        try {
            await registerUser({
                name: name.trim(),
                email: email.trim(),
                password,
                confirmPassword,
            })

            navigate('/login', {
                replace: true,
                state: {
                    success:
                        'Conta criada com sucesso. Faça login para continuar.',
                },
            })
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="register-page">
            <div className="register-background">
                <div className="register-scan-line"></div>
            </div>

            <section className="register-card">
                <div className="register-logo">
                    <div className="register-logo-mark">
                        H
                    </div>

                    <div>
                        <strong>HELPDESK</strong>
                        <span>CONTROL CENTER</span>
                    </div>
                </div>

                <div className="register-heading">
                    <p>SYSTEM // REGISTRATION</p>

                    <h1>Criar uma conta</h1>

                    <span>
                        Cadastre-se para acessar o sistema.
                    </span>
                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >
                    <div className="register-form-group">
                        <label htmlFor="register-name">
                            Nome
                        </label>

                        <input
                            id="register-name"
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(event) => {
                                setName(
                                    event.target.value
                                )
                            }}
                            autoComplete="name"
                        />
                    </div>

                    <div className="register-form-group">
                        <label htmlFor="register-email">
                            E-mail
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(event) => {
                                setEmail(
                                    event.target.value
                                )
                            }}
                            autoComplete="email"
                        />
                    </div>

                    <div className="register-form-group">
                        <label htmlFor="register-password">
                            Senha
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) => {
                                setPassword(
                                    event.target.value
                                )
                            }}
                            autoComplete="new-password"
                        />

                        <small>
                            Mínimo de 8 caracteres.
                        </small>
                    </div>

                    <div className="register-form-group">
                        <label htmlFor="register-confirm-password">
                            Confirmar senha
                        </label>

                        <input
                            id="register-confirm-password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(event) => {
                                setConfirmPassword(
                                    event.target.value
                                )
                            }}
                            autoComplete="new-password"
                        />
                    </div>

                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'CRIANDO CONTA...'
                            : 'CRIAR CONTA'}
                    </button>
                </form>

                <div className="register-login-link">
                    <span>
                        Já possui uma conta?
                    </span>

                    <Link to="/login">
                        VOLTAR PARA O LOGIN
                    </Link>
                </div>

                <div className="register-footer">
                    <span>ACCOUNT // CLIENT</span>
                    <span>SECURE REGISTRATION</span>
                </div>
            </section>
        </main>
    )
}

export default Register