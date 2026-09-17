function Header({ user }) {
    const userName =
        user?.name || user?.email || 'Usuário'

    const userInitial =
        userName.charAt(0).toUpperCase()

    return (
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
                    title="Notificações"
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
    )
}

export default Header