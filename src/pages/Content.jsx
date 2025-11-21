import { FileText, Image, Video, Link as LinkIcon } from 'lucide-react';

const Content = () => {
  return (
    <div className='space-y-4 sm:space-y-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-primary-dark font-playfair'>
          Content Management
        </h1>
        <p className='text-gray-600 mt-1 text-sm sm:text-base'>Manage website content and media</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {[
          { icon: FileText, label: 'Pages', count: 5, color: 'from-primary to-accent' },
          { icon: Image, label: 'Images', count: 124, color: 'from-secondary to-secondary-light' },
          { icon: Video, label: 'Videos', count: 8, color: 'from-green-500 to-emerald-600' },
          { icon: LinkIcon, label: 'Links', count: 45, color: 'from-purple-500 to-pink-600' },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className='card-base p-6 hover:shadow-premium-hover transition-smooth cursor-pointer'
            >
              <div className={`p-4 rounded-xl bg-gradient-to-br ${item.color} w-fit mb-4`}>
                <Icon className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-1'>{item.count}</h3>
              <p className='text-gray-600'>{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className='card-base p-4 sm:p-6'>
        <h2 className='text-lg sm:text-xl font-bold text-primary-dark mb-4'>Content Overview</h2>
        <p className='text-gray-600 text-sm sm:text-base'>
          Content management features will be available here. You can manage pages, media files, and other content from this section.
        </p>
      </div>
    </div>
  );
};

export default Content;

