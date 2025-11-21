import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { initializeDatabase, forcePopulateDatabase } from '../utils/populateDatabase';
import { simplePopulateDatabase } from '../utils/populateDatabaseSimple';
import {
  Package,
  MessageSquare,
  MapPin,
  Database,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalTestimonials: 0,
    totalDestinations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [populating, setPopulating] = useState(false);

  useEffect(() => {
    // Initialize database structure on first load
    initializeDatabase().then(() => {
      fetchDashboardData();
    });
  }, []);

  const handlePopulateDatabase = async () => {
    if (!window.confirm('This will populate the database with sample data. Continue?')) {
      return;
    }
    
    setPopulating(true);
    console.log('🚀 Starting database population...');
    
    try {
      // Try simple populate (it has its own timeouts)
      console.log('Trying simple populate method...');
      const result = await simplePopulateDatabase();
      
      console.log('✅ Population result:', result);
      
      if (result.success) {
        toast.success('Database populated successfully!');
        // Refresh dashboard data
        setTimeout(() => {
          fetchDashboardData();
        }, 1000);
      } else {
        toast.error(`Failed to populate database: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error in handlePopulateDatabase:', error);
      toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setPopulating(false);
      console.log('🏁 Population process finished');
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch packages
      const packagesSnapshot = await getDocs(collection(db, 'packages'));
      let totalPackages = 0;
      packagesSnapshot.forEach((doc) => {
        const items = doc.data().items || [];
        totalPackages += items.length;
      });

      // Fetch testimonials
      const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'));
      const totalTestimonials = testimonialsSnapshot.size;

      // Fetch destinations
      const destinationsSnapshot = await getDocs(collection(db, 'destination-highlights'));
      const totalDestinations = destinationsSnapshot.size;

      setStats({
        totalPackages,
        totalTestimonials,
        totalDestinations,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Packages',
      value: stats.totalPackages,
      icon: Package,
      color: 'from-primary to-accent',
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials || 0,
      icon: MessageSquare,
      color: 'from-secondary to-secondary-light',
    },
    {
      title: 'Destination Highlights',
      value: stats.totalDestinations || 0,
      icon: MapPin,
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-primary-dark font-playfair'>
            Dashboard
          </h1>
          <p className='text-gray-600 mt-1 text-sm sm:text-base'>Welcome back! Here's your overview.</p>
        </div>
        <button
          onClick={handlePopulateDatabase}
          disabled={populating}
          className='btn-primary text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
        >
          <Database className='w-5 h-5' />
          {populating ? 'Populating...' : 'Populate Database'}
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className='card-base p-6 hover:shadow-premium-hover transition-smooth'
            >
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                >
                  <Icon className='w-6 h-6 text-white' />
                </div>
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-1'>
                {stat.value}
              </h3>
              <p className='text-gray-600 text-sm'>{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className='card-base p-4 sm:p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg sm:text-xl font-bold text-primary-dark'>Quick Actions</h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
            {[
              { icon: Package, label: 'Add Package', color: 'from-primary to-accent', path: '/packages' },
              { icon: MessageSquare, label: 'Add Testimonial', color: 'from-secondary to-secondary-light', path: '/testimonials' },
              { icon: MapPin, label: 'Add Destination', color: 'from-green-500 to-emerald-600', path: '/destinations' },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className='p-4 rounded-xl bg-gradient-to-br hover:shadow-lg transition-all duration-300 group cursor-pointer'
                  style={{
                    background: `linear-gradient(to bottom right, var(--color-${action.color.includes('primary') ? 'primary' : action.color.includes('secondary') ? 'secondary' : 'green-500'}), var(--color-${action.color.includes('accent') ? 'accent' : action.color.includes('secondary') ? 'secondary-light' : 'emerald-600'}))`,
                  }}
                >
                  <Icon className='w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform' />
                  <p className='text-sm font-medium text-white'>{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default Dashboard;

