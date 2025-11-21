import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit, Trash2, Search, Filter, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import PackageForm from '../components/PackageForm';
import PackageCard from '../components/PackageCard';

const Packages = () => {
  const [packages, setPackages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'packages'));
      const data = {};
      querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data().items || [];
      });
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
    }
  };

  const handleDelete = async (category, index) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      const updatedItems = packages[category].filter((_, i) => i !== index);
      await setDoc(doc(db, 'packages', category), { items: updatedItems });
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const categories = Object.keys(packages);
  const allPackages = categories.flatMap((cat) =>
    packages[cat].map((pkg, idx) => ({ ...pkg, category: cat, index: idx }))
  );

  const filteredPackages =
    selectedCategory === 'all'
      ? allPackages
      : allPackages.filter((pkg) => pkg.category === selectedCategory);

  const searchedPackages = filteredPackages.filter((pkg) =>
    (pkg.title || pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-primary-dark font-playfair'>
            Package Management
          </h1>
          <p className='text-gray-600 mt-1 text-sm sm:text-base'>Manage all your travel packages</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className='btn-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base'
        >
          <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
          Add Package
        </button>
      </div>

      {showForm && (
        <div className='card-base p-6'>
          <PackageForm
            onSuccess={() => {
              setShowForm(false);
              setEditing(null);
              fetchPackages();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            editing={editing}
          />
        </div>
      )}

      <div className='card-base p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search packages...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth'
            />
          </div>
          <div className='relative'>
            <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth appearance-none bg-white'
            >
              <option value='all'>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {searchedPackages.map((pkg, idx) => (
            <PackageCard
              key={`${pkg.category}-${idx}`}
              pkg={pkg}
              category={pkg.category}
              onEdit={() => {
                setEditing(pkg);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(pkg.category, pkg.index)}
            />
          ))}
        </div>

        {searchedPackages.length === 0 && (
          <div className='text-center py-12'>
            <Package className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <p className='text-gray-500 text-lg'>No packages found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;

