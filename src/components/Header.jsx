import { useState } from 'react'
import ChangePasswordModal from './ChangePasswordModal'

function Header({ user }) {
    const [isPasswordModalOpen, setIsPasswordModalOpen] =
        useState(false)

    const userName =
        user?.name || user?.email || 'Usuário'

    const userInitial =
        userName.charAt(0).toUpperCase()

    return (
        <>
            <header className="header">
                <div>
                    <span className="header-label">
                        HELPDESK // CONTROL CENTER
                    </span>

                    <h1>
                        Dashboard
                    </h1>
                </div>

                <div className="header-actions">
                    <button
                        type="button"
                        className="icon-button"
                        title="Alterar senha"
                        onClick={() =>
                            setIsPasswordModalOpen(true)
                        }
                        aria-label="Alterar senha"
                    >
                        <svg
                            width="17"
                            height="17"
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
                    </button>

                    <button
                        type="button"
                        className="icon-button"
                        title="Notificações"
                        aria-label="Notificações"
                    >
                        🔔
                    </button>

                    <div className="header-user">
                        <div className="avatar">
                            {userInitial}
                        </div>

                        <span>
                            {userName}
                        </span>
                    </div>
                </div>
            </header>

            {isPasswordModalOpen && (
                <ChangePasswordModal
                    onClose={() =>
                        setIsPasswordModalOpen(false)
                    }
                />
            )}
        </>
    )
}

export default Header

