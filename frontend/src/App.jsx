import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationSystem from './components/NotificationSystem';
import Profile from './pages/Profile';
import HistoryPage from './pages/HistoryPage';
import './index.css';

import AdminLogin from './pages/AdminLogin';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <NotificationSystem />
                <div style={{ paddingTop: '80px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                            <Route path="/student" element={<StudentDashboard />} />
                            <Route path="/history" element={<HistoryPage />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} loginPath="/admin-login" />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
