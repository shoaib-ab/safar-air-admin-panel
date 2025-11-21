import { Edit, Trash2 } from 'lucide-react';

const PackageCard = ({ pkg, onEdit, onDelete }) => {
  return (
    <div className='card-base overflow-hidden hover:shadow-premium-hover transition-smooth group'>
      {pkg.imageUrl && (
        <div className='relative h-48 overflow-hidden'>
          <img
            src={pkg.imageUrl}
            alt={pkg.title || pkg.name}
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
          />
          <div className='absolute top-2 right-2 flex gap-2'>
            <button
              onClick={onEdit}
              className='p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-smooth shadow-lg'
            >
              <Edit className='w-4 h-4 text-primary' />
            </button>
            <button
              onClick={onDelete}
              className='p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-smooth shadow-lg'
            >
              <Trash2 className='w-4 h-4 text-red-600' />
            </button>
          </div>
        </div>
      )}
      <div className='p-4'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-bold text-lg text-gray-800 line-clamp-2'>
            {pkg.title || pkg.name}
          </h3>
          <span className='px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded'>
            {pkg.category?.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        {pkg.description && (
          <p className='text-sm text-gray-600 line-clamp-2 mb-3'>
            {pkg.description}
          </p>
        )}
        <div className='flex items-center justify-between text-sm'>
          {pkg.days && (
            <span className='text-gray-600'>{pkg.days}</span>
          )}
          {pkg.price && (
            <span className='font-bold text-primary'>{pkg.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;

