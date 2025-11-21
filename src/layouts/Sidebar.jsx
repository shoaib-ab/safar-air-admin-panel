import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Packages', path: '/packages' },
  { icon: MessageSquare, label: 'Testimonials', path: '/testimonials' },
  { icon: MapPin, label: 'Destinations', path: '/destinations' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg'
      >
        {isMobileOpen ? (
          <X className='w-6 h-6' />
        ) : (
          <Menu className='w-6 h-6' />
        )}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary-dark via-primary to-primary-dark text-white transform transition-transform duration-300 ease-in-out z-40 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className='flex flex-col h-full'>
          <div className='border-b border-white/10'>
            <div className='flex items-center justify-center h-fit'>
              <img
                src='/logo.png'
                alt='Safar Air International'
                className='w-[170px] h-auto'
              />
            </div>
          </div>

          <nav className='flex-1 overflow-y-auto p-4 space-y-2'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className='w-5 h-5' />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className='p-4 border-t border-white/10'>
            <button
              onClick={handleLogout}
              className='flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 w-full'
            >
              <LogOut className='w-5 h-5' />
              <span className='font-medium'>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-30 lg:hidden'
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
