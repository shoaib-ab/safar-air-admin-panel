import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import Testimonials from './pages/Testimonials';
import Destinations from './pages/Destinations';
import Settings from './pages/Settings';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route
            path='/*'
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Routes>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='packages' element={<Packages />} />
                    <Route path='testimonials' element={<Testimonials />} />
                    <Route path='destinations' element={<Destinations />} />
                    <Route path='settings' element={<Settings />} />
                    <Route path='*' element={<Navigate to='/dashboard' replace />} />
                  </Routes>
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </Router>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(30, 64, 175, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </AuthProvider>
  );
};

export default App;
