import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

const Analytics = () => {
  return (
    <div className='space-y-4 sm:space-y-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-primary-dark font-playfair'>
          Analytics
        </h1>
        <p className='text-gray-600 mt-1 text-sm sm:text-base'>Track your business performance</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {[
          { title: 'Total Revenue', value: '$125,000', change: '+12%', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
          { title: 'Total Bookings', value: '1,234', change: '+8%', icon: Users, color: 'from-primary to-accent' },
          { title: 'Growth Rate', value: '23%', change: '+5%', icon: TrendingUp, color: 'from-secondary to-secondary-light' },
          { title: 'Active Users', value: '5,678', change: '+15%', icon: BarChart3, color: 'from-purple-500 to-pink-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className='card-base p-6 hover:shadow-premium-hover transition-smooth'>
              <div className='flex items-center justify-between mb-4'>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className='w-6 h-6 text-white' />
                </div>
                <span className='text-green-600 text-sm font-semibold'>{stat.change}</span>
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-1'>{stat.value}</h3>
              <p className='text-gray-600 text-sm'>{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
        <div className='card-base p-4 sm:p-6'>
          <h2 className='text-lg sm:text-xl font-bold text-primary-dark mb-4'>Revenue Chart</h2>
          <div className='h-48 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg'>
            <p className='text-gray-500 text-sm sm:text-base'>Chart visualization would go here</p>
          </div>
        </div>
        <div className='card-base p-4 sm:p-6'>
          <h2 className='text-lg sm:text-xl font-bold text-primary-dark mb-4'>Booking Trends</h2>
          <div className='h-48 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg'>
            <p className='text-gray-500 text-sm sm:text-base'>Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

