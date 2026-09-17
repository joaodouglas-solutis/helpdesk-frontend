import { NavLink } from 'react-router'

function Sidebar({ user, onLogout }) {
    const roleLabels = {
        CLIENT: 'Cliente',
        TECHNICIAN: 'Técnico',
        ADMIN: 'Administrador',
    }

    const roleLabel =
        roleLabels[user?.role] || 'Usuário'

    const userName =
        user?.name || user?.email || 'Usuário'

    const userInitial =
        userName.charAt(0).toUpperCase()

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-mark">
                    H
                </div>

                <div>
                    <strong>HelpDesk</strong>
                    <span>Atendimento</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <span>⌂</span>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/tickets"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <span>▣</span>
                    Chamados
                </NavLink>

                <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <span>◌</span>
                    Notificações
                </NavLink>
            </nav>

            <div className="sidebar-bottom">
                <button
                    type="button"
                    className="logout-button"
                    onClick={onLogout}
                >
                    <span>↪</span>
                    Encerrar sessão
                </button>

                <div className="user-mini">
                    <div className="avatar">
                        {userInitial}
                    </div>

                    <div>
                        <strong>
                            {userName}
                        </strong>

                        <span>
                            {roleLabel}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar