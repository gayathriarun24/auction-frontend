import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import SellerDashboard from './pages/SellerDashboard';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'seller') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#D1D2D4] text-[#616657] antialiased">
      <Navbar />
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;