import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, enableNetwork } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit, Trash2, Star, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    imageUrl: '', // Changed from 'image' to match website expectation
    rating: 5,
    message: '', // Changed from 'comment' to match website expectation
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'testimonials'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
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
        await setDoc(doc(db, 'testimonials', editing.id), formData);
        toast.success('Testimonial updated successfully');
      } else {
        await addDoc(collection(db, 'testimonials'), formData);
        toast.success('Testimonial added successfully');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', role: '', imageUrl: '', rating: 5, message: '' });
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      const errorMessage = error.message || 'Failed to save testimonial';
      if (errorMessage.includes('offline')) {
        toast.error('Network error: Please check your internet connection and try again');
      } else {
        toast.error(`Failed to save testimonial: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?'))
      return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-primary-dark font-playfair'>
            Testimonials
          </h1>
          <p className='text-gray-600 mt-1 text-sm sm:text-base'>Manage customer testimonials</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({
              name: '',
              role: '',
              imageUrl: '',
              rating: 5,
              message: '',
            });
            setShowForm(true);
          }}
          className='btn-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base'
        >
          <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className='card-base p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <h3 className='text-xl font-bold text-primary-dark mb-4'>
              {editing ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Name *
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Role
                </label>
                <input
                  type='text'
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                  placeholder='e.g., Travel Enthusiast'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Image URL
                </label>
                <input
                  type='url'
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Rating *
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: parseInt(e.target.value) })
                  }
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                  placeholder='Customer testimonial message...'
                />
              </div>
            </div>
            <div className='flex gap-4'>
              <button
                type='submit'
                className='btn-primary text-white px-6 py-3 rounded-lg font-semibold'
              >
                {editing ? 'Update' : 'Add'} Testimonial
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
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className='card-base p-6 hover:shadow-premium-hover transition-smooth'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-center gap-3'>
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white'>
                    <User className='w-6 h-6' />
                  </div>
                )}
                <div>
                  <h3 className='font-semibold text-gray-800'>
                    {testimonial.name}
                  </h3>
                  {testimonial.role && (
                    <p className='text-sm text-gray-500'>{testimonial.role}</p>
                  )}
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setEditing(testimonial);
                    setFormData(testimonial);
                    setShowForm(true);
                  }}
                  className='p-2 text-primary hover:bg-primary/10 rounded-lg transition-smooth'
                >
                  <Edit className='w-4 h-4' />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-smooth'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
            <div className='flex items-center gap-1 mb-3'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (testimonial.rating || 5)
                      ? 'text-secondary fill-secondary'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className='text-gray-600 text-sm'>{testimonial.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;

