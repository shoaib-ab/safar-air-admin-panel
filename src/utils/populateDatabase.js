// Utility script to populate initial database structure
// Run this once to set up the database collections

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { enableNetwork } from 'firebase/firestore';

export const populateInitialData = async () => {
  try {
    console.log('📡 Step 1: Enabling network...');
    // Ensure network is enabled
    try {
      await enableNetwork(db);
      console.log('✅ Network enabled successfully');
    } catch (networkError) {
      console.warn('⚠️ Network enable warning:', networkError);
      // Continue anyway
    }
    
    console.log('🚀 Step 2: Starting database population...');

    // 1. Initialize packages collections with empty arrays or sample data
    const packageCategories = ['umrah', 'top-destinations', 'best-deals', 'most-searched', 'curated'];
    
    console.log('📦 Step 3: Creating package collections...');
    for (const category of packageCategories) {
      try {
        console.log(`  Processing ${category}...`);
        const categoryRef = doc(db, 'packages', category);
        
        try {
          const categorySnap = await getDoc(categoryRef);
          
          if (!categorySnap.exists()) {
            await setDoc(categoryRef, { items: [] });
            console.log(`  ✅ Created packages/${category}`);
          } else {
            console.log(`  ✓ packages/${category} already exists`);
          }
        } catch (error) {
          // If getDoc fails, try to create anyway
          console.log(`  ⚠️ Error checking ${category}, attempting to create...`, error.message);
          try {
            await setDoc(categoryRef, { items: [] });
            console.log(`  ✅ Created packages/${category} (after error)`);
          } catch (createError) {
            console.error(`  ❌ Failed to create packages/${category}:`, createError.message);
            throw createError; // Re-throw to stop the process
          }
        }
      } catch (categoryError) {
        console.error(`❌ Critical error with ${category}:`, categoryError);
        throw categoryError; // Stop if we can't create collections
      }
    }

    // 2. Add sample Umrah packages
    const umrahRef = doc(db, 'packages', 'umrah');
    try {
      const umrahSnap = await getDoc(umrahRef);
      const existingUmrahItems = umrahSnap.exists() ? umrahSnap.data().items || [] : [];
      
      // Only add samples if empty
      if (existingUmrahItems.length === 0) {
        const sampleUmrahPackages = [
          {
            title: 'Economy Umrah Package',
            name: 'Economy Umrah Package',
            price: 'Rs 150,000',
            duration: '15 Days',
            rating: '4.8',
            location: 'Makkah & Madinah',
            imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=400&fit=crop&crop=center',
            description: 'Complete Umrah journey with economy accommodation and transportation.',
            features: ['Visa Processing', 'Hotel Accommodation', 'Transportation', 'Ziyarat Tours'],
          },
          {
            title: 'Premium Umrah Package',
            name: 'Premium Umrah Package',
            price: 'Rs 250,000',
            duration: '20 Days',
            rating: '4.9',
            location: 'Makkah & Madinah',
            imageUrl: 'https://images.unsplash.com/photo-1519748174340-95c2c2c0e0e5?w=400&h=400&fit=crop&crop=center',
            description: 'Luxury Umrah experience with 5-star hotels and VIP services.',
            features: ['VIP Visa Processing', '5-Star Hotels', 'Luxury Transportation', 'Expert Guides'],
          },
        ];
        
        await setDoc(umrahRef, { items: sampleUmrahPackages });
        console.log('✅ Added sample Umrah packages');
      } else {
        console.log('✓ Umrah packages already exist');
      }
    } catch (error) {
      console.error('❌ Error adding Umrah packages:', error);
    }

    // 3. Add sample Best Deals packages
    const bestDealsRef = doc(db, 'packages', 'best-deals');
    try {
      const bestDealsSnap = await getDoc(bestDealsRef);
      const existingBestDeals = bestDealsSnap.exists() ? bestDealsSnap.data().items || [] : [];
      
      if (existingBestDeals.length === 0) {
        const sampleBestDeals = [
          {
            title: 'Kyoto, Japan',
            name: 'Kyoto, Japan',
            price: '$5.42k',
            days: '10 Days Trip',
            imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=400&fit=crop',
          },
          {
            title: 'Rome, Italy',
            name: 'Rome, Italy',
            price: '$4.2k',
            days: '12 Days Trip',
            imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=400&fit=crop',
          },
        ];
        
        await setDoc(bestDealsRef, { items: sampleBestDeals });
        console.log('✅ Added sample Best Deals packages');
      }
    } catch (error) {
      console.error('❌ Error adding Best Deals:', error);
    }

    // 4. Add sample Testimonials
    try {
      const testimonialsRef = doc(db, 'testimonials', 'sample-1');
      const testimonialSnap = await getDoc(testimonialsRef);
      
      if (!testimonialSnap.exists()) {
        const sampleTestimonials = [
          {
            name: 'David Thompson',
            role: 'Traveler',
            imageUrl: 'https://i.pravatar.cc/150?img=1',
            rating: 5,
            message: 'Safar Air International provided an exceptional travel experience. The attention to detail and personalized service exceeded all expectations. Highly recommended!',
          },
          {
            name: 'Sarah Mitchell',
            role: 'Tourist',
            imageUrl: 'https://i.pravatar.cc/150?img=2',
            rating: 5,
            message: 'From booking to arrival, everything was seamless. The team went above and beyond to ensure our journey was perfect. Will definitely book again!',
          },
        ];
        
        // Add testimonials as separate documents
        for (let i = 0; i < sampleTestimonials.length; i++) {
          const testimonialRef = doc(db, 'testimonials', `sample-${i + 1}`);
          await setDoc(testimonialRef, sampleTestimonials[i]);
        }
        console.log('✅ Added sample Testimonials');
      }
    } catch (error) {
      console.error('❌ Error adding Testimonials:', error);
    }

    // 5. Add sample Destination Highlights
    try {
      const destinationRef = doc(db, 'destination-highlights', 'sample-1');
      const destinationSnap = await getDoc(destinationRef);
      
      if (!destinationSnap.exists()) {
        const sampleDestination = {
          type: 'video',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        };
        
        await setDoc(destinationRef, sampleDestination);
        console.log('✅ Added sample Destination Highlight');
      }
    } catch (error) {
      console.error('❌ Error adding Destination Highlight:', error);
    }

    console.log('✅✅✅ Database population completed successfully!');
    return { 
      success: true, 
      message: 'Database initialized and populated successfully!' 
    };
  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  }
};

// Function to check and initialize database structure
export const initializeDatabase = async () => {
  try {
    await enableNetwork(db);
    
    // Check if packages/umrah exists, if not, initialize
    const umrahRef = doc(db, 'packages', 'umrah');
    let umrahSnap;
    
    try {
      umrahSnap = await getDoc(umrahRef);
    } catch (error) {
      console.log('Error checking database, will attempt to populate...', error);
      umrahSnap = { exists: () => false };
    }
    
    if (!umrahSnap.exists()) {
      console.log('📦 Initializing database structure...');
      await populateInitialData();
    } else {
      console.log('✓ Database structure already exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw, just log - let the app continue
  }
};

// Force populate function (can be called manually)
export const forcePopulateDatabase = async () => {
  console.log('🎯 forcePopulateDatabase called');
  try {
    console.log('Step 1: Enabling network in forcePopulateDatabase...');
    await enableNetwork(db);
    console.log('Step 2: Network enabled, calling populateInitialData...');
    
    const result = await populateInitialData();
    console.log('Step 3: populateInitialData completed:', result);
    
    return { success: true, message: 'Database populated successfully!' };
  } catch (error) {
    console.error('❌ Error in forcePopulateDatabase:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return { 
      success: false, 
      message: error.message || 'Unknown error occurred',
      error: error
    };
  }
};

