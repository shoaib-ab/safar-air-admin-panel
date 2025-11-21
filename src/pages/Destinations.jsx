import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, enableNetwork } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit, Trash2, Film, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'video', // 'video' or 'description'
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    background: '',
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'destination-highlights')
      );
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to fetch destinations');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure network is enabled before making requests
      try {
        await enableNetwork(db);
      } catch (networkError) {
        console.warn('Network already enabled or error enabling:', networkError);
      }
      
      if (editing) {
        await setDoc(doc(db, 'destination-highlights', editing.id), formData);
        toast.success('Destination updated successfully');
      } else {
        await addDoc(collection(db, 'destination-highlights'), formData);
        toast.success('Destination added successfully');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ type: 'video', title: '', description: '', videoUrl: '', thumbnail: '', background: '' });
      fetchDestinations();
    } catch (error) {
      console.error('Error saving destination:', error);
      const errorMessage = error.message || 'Failed to save destination';
      if (errorMessage.includes('offline')) {
        toast.error('Network error: Please check your internet connection and try again');
      } else {
        toast.error(`Failed to save destination: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?'))
      return;
    try {
      await deleteDoc(doc(db, 'destination-highlights', id));
      toast.success('Destination deleted successfully');
      fetchDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast.error('Failed to delete destination');
    }
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-primary-dark font-playfair'>
            Destination Highlights
          </h1>
          <p className='text-gray-600 mt-1 text-sm sm:text-base'>Manage video highlights and descriptions</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ type: 'video', title: '', description: '', videoUrl: '', thumbnail: '', background: '' });
            setShowForm(true);
          }}
          className='btn-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base'
        >
          <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
          Add Highlight
        </button>
      </div>

      {showForm && (
        <div className='card-base p-4 sm:p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <h3 className='text-xl font-bold text-primary-dark mb-4'>
              {editing ? 'Edit Highlight' : 'Add New Highlight'}
            </h3>
            
            {/* Type Selection */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Type *
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, type: 'video' })}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    formData.type === 'video'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary/50'
                  }`}
                >
                  <Film className={`w-5 h-5 ${formData.type === 'video' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={`font-medium ${formData.type === 'video' ? 'text-primary' : 'text-gray-600'}`}>
                    Video
                  </span>
                </button>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, type: 'description' })}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    formData.type === 'description'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary/50'
                  }`}
                >
                  <FileText className={`w-5 h-5 ${formData.type === 'description' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={`font-medium ${formData.type === 'description' ? 'text-primary' : 'text-gray-600'}`}>
                    Description
                  </span>
                </button>
              </div>
            </div>

            {/* Video Type Fields */}
            {formData.type === 'video' && (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Video URL *
                    </label>
                    <input
                      type='url'
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                      placeholder='https://example.com/video.mp4'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Thumbnail URL *
                    </label>
                    <input
                      type='url'
                      value={formData.thumbnail}
                      onChange={(e) =>
                        setFormData({ ...formData, thumbnail: e.target.value })
                      }
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                      placeholder='https://example.com/thumbnail.jpg'
                    />
                  </div>
                </div>
              </>
            )}

            {/* Description Type Fields */}
            {formData.type === 'description' && (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Title *
                  </label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                    placeholder='e.g., Discover The World'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows={4}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                    placeholder='Enter description...'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Background Image URL *
                  </label>
                  <input
                    type='url'
                    value={formData.background}
                    onChange={(e) =>
                      setFormData({ ...formData, background: e.target.value })
                    }
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                    placeholder='https://example.com/background.jpg'
                  />
                </div>
              </>
            )}

            <div className='flex gap-4'>
              <button
                type='submit'
                className='btn-primary text-white px-6 py-3 rounded-lg font-semibold'
              >
                {editing ? 'Update' : 'Add'} Highlight
              </button>
              <button
                type='button'
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className='px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-smooth'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className='card-base overflow-hidden hover:shadow-premium-hover transition-smooth group'
          >
            {/* Display based on type */}
            {destination.type === 'video' ? (
              <>
                {destination.thumbnail && (
                  <div className='relative h-48 overflow-hidden'>
                    <img
                      src={destination.thumbnail}
                      alt='Video thumbnail'
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
                      <Film className='w-12 h-12 text-white' />
                    </div>
                    <div className='absolute top-2 right-2 flex gap-2'>
                      <button
                        onClick={() => {
                          setEditing(destination);
                          setFormData(destination);
                          setShowForm(true);
                        }}
                        className='p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-smooth shadow-lg'
                      >
                        <Edit className='w-4 h-4 text-primary' />
                      </button>
                      <button
                        onClick={() => handleDelete(destination.id)}
                        className='p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-smooth shadow-lg'
                      >
                        <Trash2 className='w-4 h-4 text-red-600' />
                      </button>
                    </div>
                  </div>
                )}
                <div className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Film className='w-4 h-4 text-primary' />
                    <span className='text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded'>
                      VIDEO
                    </span>
                  </div>
                  {destination.videoUrl && (
                    <p className='text-xs text-gray-500 truncate' title={destination.videoUrl}>
                      {destination.videoUrl}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {destination.background && (
                  <div className='relative h-48 overflow-hidden'>
                    <img
                      src={destination.background}
                      alt={destination.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                    <div className='absolute top-2 right-2 flex gap-2'>
                      <button
                        onClick={() => {
                          setEditing(destination);
                          setFormData(destination);
                          setShowForm(true);
                        }}
                        className='p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-smooth shadow-lg'
                      >
                        <Edit className='w-4 h-4 text-primary' />
                      </button>
                      <button
                        onClick={() => handleDelete(destination.id)}
                        className='p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-smooth shadow-lg'
                      >
                        <Trash2 className='w-4 h-4 text-red-600' />
                      </button>
                    </div>
                  </div>
                )}
                <div className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <FileText className='w-4 h-4 text-primary' />
                    <span className='text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded'>
                      DESCRIPTION
                    </span>
                  </div>
                  <h3 className='font-bold text-lg text-gray-800 mb-2'>
                    {destination.title}
                  </h3>
                  <p className='text-sm text-gray-600 line-clamp-3'>
                    {destination.description}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;

