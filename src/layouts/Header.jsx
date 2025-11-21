import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30'>
      <div className='flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4'>
        <div className='flex-1 max-w-xl hidden md:block'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth text-sm'
            />
          </div>
        </div>

        <div className='flex items-center gap-2 sm:gap-4 ml-auto'>
          <button className='relative p-2 text-gray-600 hover:text-primary transition-smooth'>
            <Bell className='w-5 h-5' />
            <span className='absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full'></span>
          </button>

          <div className='flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm sm:text-base'>
              {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className='hidden sm:block'>
              <p className='text-sm font-medium text-gray-800'>
                {currentUser?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className='text-xs text-gray-500'>Administrator</p>
            </div>
            <ChevronDown className='w-4 h-4 text-gray-400 hidden sm:block' />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

