import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, getDoc, enableNetwork } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { X, ChevronDown, Package, Sparkles, TrendingUp, Star, Heart } from 'lucide-react';

const categories = [
  { value: 'top-destinations', label: 'Top Destinations', icon: Package },
  { value: 'best-deals', label: 'Best Deals', icon: Sparkles },
  { value: 'most-searched', label: 'Most Searched', icon: TrendingUp },
  { value: 'curated', label: 'Curated', icon: Heart },
  { value: 'umrah', label: 'Umrah', icon: Star },
];

// Define field configurations for each category (using value from categories array)
const categoryFields = {
  'top-destinations': {
    required: ['title', 'imageUrl'],
    optional: ['name', 'days', 'price', 'description', 'location'],
  },
  'best-deals': {
    required: ['title', 'imageUrl', 'price'],
    optional: ['name', 'days', 'description', 'discount'],
  },
  'most-searched': {
    required: ['title', 'imageUrl'],
    optional: ['name', 'days', 'price', 'description', 'location'],
  },
  'curated': {
    required: ['title', 'imageUrl'],
    optional: ['name', 'description'],
  },
  'umrah': {
    required: ['title', 'imageUrl', 'price', 'duration'],
    optional: ['name', 'description', 'location', 'rating', 'features'],
  },
};

const PackageForm = ({ onSuccess, onCancel, editing }) => {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    days: '',
    duration: '',
    price: '',
    discount: '',
    imageUrl: '',
    description: '',
    location: '',
    rating: '',
    features: '',
    category: 'top-destinations',
  });
  const [loading, setLoading] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setFormData({
        title: editing.title || editing.name || '',
        name: editing.name || editing.title || '',
        days: editing.days || editing.duration || '',
        duration: editing.duration || editing.days || '',
        price: editing.price || '',
        discount: editing.discount || '',
        imageUrl: editing.imageUrl || '',
        description: editing.description || '',
        location: editing.location || '',
        rating: editing.rating || '',
        features: Array.isArray(editing.features) ? editing.features.join(', ') : editing.features || '',
        category: editing.category || 'top-destinations',
      });
    }
  }, [editing]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure network is enabled before making requests
      try {
        await enableNetwork(db);
      } catch (networkError) {
        console.warn('Network already enabled or error enabling:', networkError);
      }
      
      const categoryRef = doc(db, 'packages', formData.category);
      
      // Get existing items, or create empty structure if document doesn't exist
      let existingItems = [];
      try {
        const categorySnap = await getDoc(categoryRef);
        if (categorySnap.exists()) {
          existingItems = categorySnap.data().items || [];
        }
        // If document doesn't exist, existingItems will remain empty array
        // We'll create it when we save
      } catch (getError) {
        // If getDoc fails due to offline, we'll try to write anyway
        // Firestore will queue the write and sync when online
        console.warn('Could not read document (may be offline), will attempt to write:', getError.message);
        // Continue with empty array - we'll create the document structure on save
      }

      // Build package data based on category
      const packageData = {
        title: formData.title || formData.name,
        name: formData.name || formData.title,
        imageUrl: formData.imageUrl,
      };

      // Add optional fields if they have values
      if (formData.days) packageData.days = formData.days;
      if (formData.duration) packageData.duration = formData.duration;
      if (formData.price) packageData.price = formData.price;
      if (formData.description) packageData.description = formData.description;
      if (formData.location) packageData.location = formData.location;
      if (formData.rating) packageData.rating = formData.rating;
      if (formData.discount) packageData.discount = formData.discount;
      if (formData.features) {
        packageData.features = formData.features.split(',').map(f => f.trim()).filter(f => f);
      }

      let updatedItems;
      if (editing && editing.index !== undefined) {
        updatedItems = [...existingItems];
        updatedItems[editing.index] = packageData;
      } else {
        updatedItems = [...existingItems, packageData];
      }

      // Use setDoc to create/update the document
      // This will work even if the document doesn't exist yet
      await setDoc(categoryRef, { items: updatedItems }, { merge: false });
      toast.success(
        editing ? 'Package updated successfully' : 'Package added successfully'
      );
      onSuccess();
    } catch (error) {
      console.error('Error saving package:', error);
      const errorMessage = error.message || 'Failed to save package';
      if (errorMessage.includes('offline')) {
        toast.error('Network error: Please check your internet connection and try again');
      } else {
        toast.error(`Failed to save package: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-xl font-bold text-primary-dark'>
          {editing ? 'Edit Package' : 'Add New Package'}
        </h3>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='text-gray-400 hover:text-gray-600 transition-smooth'
          >
            <X className='w-6 h-6' />
          </button>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Package Title *
          </label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
            placeholder='e.g., Tokyo, Japan'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Category *
          </label>
          <div className='relative' ref={categoryDropdownRef}>
            <button
              type='button'
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth bg-white flex items-center justify-between hover:border-primary/50'
            >
              <div className='flex items-center gap-2'>
                {(() => {
                  const selectedCategory = categories.find(cat => cat.value === formData.category);
                  const Icon = selectedCategory?.icon || Package;
                  return (
                    <>
                      <Icon className='w-4 h-4 text-primary' />
                      <span className='text-gray-700'>
                        {selectedCategory?.label || 'Select Category'}
                      </span>
                    </>
                  );
                })()}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isCategoryOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
                <div className='py-1'>
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = formData.category === category.value;
                    return (
                      <button
                        key={category.value}
                        type='button'
                        onClick={() => {
                          setFormData({ ...formData, category: category.value });
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-2 text-left transition-colors ${
                          isSelected
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                        <span>{category.label}</span>
                        {isSelected && (
                          <span className='ml-auto text-primary text-sm'>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic fields based on category */}
        {formData.category === 'umrah' && (
          <>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Duration *
              </label>
              <input
                type='text'
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., 15 Days'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Price *
              </label>
              <input
                type='text'
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., Rs 150,000'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Location
              </label>
              <input
                type='text'
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., Makkah & Madinah'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Rating
              </label>
              <input
                type='number'
                step='0.1'
                min='0'
                max='5'
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., 4.8'
              />
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Features (comma-separated)
              </label>
              <input
                type='text'
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., Visa Processing, Hotel Accommodation, Transportation'
              />
            </div>
          </>
        )}

        {formData.category === 'best-deals' && (
          <>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Price *
              </label>
              <input
                type='text'
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., $2.5k'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Discount
              </label>
              <input
                type='text'
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., 20% OFF'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Duration
              </label>
              <input
                type='text'
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., 7 Days Trip'
              />
            </div>
          </>
        )}

        {(formData.category === 'top-destinations' || formData.category === 'most-searched') && (
          <>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Duration
              </label>
              <input
                type='text'
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., 7 Days Trip'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Price
              </label>
              <input
                type='text'
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., $2.5k'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Location
              </label>
              <input
                type='text'
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
                placeholder='e.g., Tokyo, Japan'
              />
            </div>
          </>
        )}

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Image URL *
          </label>
          <input
            type='url'
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
            placeholder='https://example.com/image.jpg'
          />
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
            placeholder='Package description...'
          />
        </div>
      </div>

      <div className='flex gap-4'>
        <button
          type='submit'
          disabled={loading}
          className='btn-primary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Saving...' : editing ? 'Update Package' : 'Add Package'}
        </button>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-smooth'
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PackageForm;

