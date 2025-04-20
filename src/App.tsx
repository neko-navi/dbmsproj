import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import AuthGuard from './components/AuthGuard';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Warehouses from './pages/Warehouses';
import Orders from './pages/Orders';
import Quotes from './pages/Quotes';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const loadUser = useAuthStore(state => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/warehouses" element={
            <AuthGuard allowedRoles={['admin', 'customer']}>
              <Warehouses />
            </AuthGuard>
          } />
          <Route path="/orders" element={
            <AuthGuard allowedRoles={['admin', 'customer']}>
              <Orders />
            </AuthGuard>
          } />
          <Route path="/quotes" element={
            <AuthGuard allowedRoles={['admin', 'customer']}>
              <Quotes />
            </AuthGuard>
          } />
          <Route path="/admin" element={
            <AuthGuard allowedRoles={['admin']}>
              <Admin />
            </AuthGuard>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;