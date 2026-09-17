import { useState } from 'react'

import {
    Navigate,
    Route,
    Routes,
} from 'react-router'

import './App.css'

import Sidebar from './components/Sidebar'
import Header from './components/Header'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Tickets from './pages/Tickets'
import TicketDetails from './pages/TicketDetails'
import Notifications from './pages/Notifications'

import {
    getAuthenticatedUser,
    getToken,
    removeToken,
} from './services/auth'

function ProtectedLayout({ user, onLogout }) {
    return (
        <div className="app">
            <Sidebar
                user={user}
                onLogout={onLogout}
            />

            <main className="main-content">
                <Header user={user} />

                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard user={user} />
                        }
                    />

                    <Route
                        path="/tickets"
                        element={
                            <Tickets user={user} />
                        }
                    />

                    <Route
                        path="/tickets/:id"
                        element={
                            <TicketDetails />
                        }
                    />

                    <Route
                        path="/notifications"
                        element={
                            <Notifications user={user} />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />
                </Routes>
            </main>
        </div>
    )
}

function App() {
    const [token, setTokenState] = useState(
        () => getToken()
    )

    const [user, setUser] = useState(
        () => getAuthenticatedUser()
    )

    function handleLogin(newToken) {
        setTokenState(newToken)

        setUser(getAuthenticatedUser())
    }

    function handleLogout() {
        removeToken()

        setTokenState(null)

        setUser(null)
    }

    if (!token) {
        return (
            <Routes>
                <Route
                    path="/login"
                    element={
                        <Login onLogin={handleLogin} />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route
                path="/*"
                element={
                    <ProtectedLayout
                        user={user}
                        onLogout={handleLogout}
                    />
                }
            />
        </Routes>
    )
}

export default App