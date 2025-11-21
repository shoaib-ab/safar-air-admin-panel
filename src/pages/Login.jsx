import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center p-4 sm:p-6'>
      {/* Subtle decorative elements */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl'></div>
      
      <div className='w-full max-w-md relative z-10'>
        <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100'>
          {/* Logo */}
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-6'>
              <img 
                src='/logo.png' 
                alt='Safar Air International' 
                className='h-20 sm:h-24 w-auto object-contain'
              />
            </div>
            <h1 className='text-2xl sm:text-3xl font-bold text-primary-dark font-playfair mb-2'>
              Admin Panel
            </h1>
            <p className='text-gray-600 text-sm sm:text-base'>Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5 sm:space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth text-sm sm:text-base'
                  placeholder='admin@safarair.com'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth text-sm sm:text-base'
                  placeholder='Enter your password'
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full btn-primary text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-xs sm:text-sm text-gray-500'>
              Secure admin access only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
