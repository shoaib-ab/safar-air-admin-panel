// Simplified database population - writes directly without reading first
import { doc, setDoc, writeBatch, waitForPendingWrites } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { enableNetwork } from 'firebase/firestore';

// Helper function to set document with timeout
const setDocWithTimeout = async (docRef, data, options = {}, timeoutMs = 10000) => {
  return Promise.race([
    setDoc(docRef, data, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

export const simplePopulateDatabase = async () => {
  console.log('🚀 Starting SIMPLE database population...');
  
  try {
    // Check authentication first
    console.log('🔐 Step 0: Checking authentication...');
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('You must be logged in to populate the database. Please log in first.');
    }
    console.log(`✅ Authenticated as: ${currentUser.email}`);
    
    // Enable network (with timeout)
    console.log('📡 Step 1: Enabling network...');
    try {
      await Promise.race([
        enableNetwork(db),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Network enable timeout')), 10000))
      ]);
      console.log('✅ Network enabled');
    } catch (networkErr) {
      console.warn('⚠️ Network enable issue (continuing anyway):', networkErr.message);
    }
    
    // Skip connectivity test - go straight to writing
    // The actual writes will show us if there's a problem
    console.log('📝 Step 2: Starting data population (skipping connectivity test)...');

    // 1. Create all package collections directly using batch writes (faster)
    console.log('📦 Step 3: Creating package collections...');
    const packageCategories = ['umrah', 'top-destinations', 'best-deals', 'most-searched', 'curated'];
    
    // Use batch writes for better performance
    const batch = writeBatch(db);
    
    for (const category of packageCategories) {
      try {
        const categoryRef = doc(db, 'packages', category);
        batch.set(categoryRef, { items: [] }, { merge: true });
        console.log(`  ✓ Queued packages/${category}`);
      } catch (error) {
        console.error(`  ❌ Failed to queue packages/${category}:`, error.message);
      }
    }
    
    // Commit batch
    try {
      console.log('  📤 Committing batch write...');
      const commitPromise = batch.commit();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Batch commit timeout after 20s. This usually means Firestore security rules are blocking writes. Please check your Firestore rules in Firebase Console.')), 20000)
      );
      
      await Promise.race([commitPromise, timeoutPromise]);
      console.log('✅ Batch committed successfully');
      console.log('✅ All package collections created');
    } catch (batchError) {
      console.error('❌ Batch commit failed:', batchError.message);
      
      // Check if it's a permissions error
      if (batchError.message.includes('permission') || batchError.message.includes('Permission denied')) {
        throw new Error('Firestore security rules are blocking writes. Please update your Firestore rules to allow writes. Check Firebase Console > Firestore > Rules.');
      }
      
      console.log('  🔄 Trying individual writes as fallback...');
      // Try individual writes as fallback
      let successCount = 0;
      for (const category of packageCategories) {
        try {
          const categoryRef = doc(db, 'packages', category);
          await setDocWithTimeout(categoryRef, { items: [] }, { merge: true }, 15000);
          console.log(`  ✅ Created packages/${category} (individual)`);
          successCount++;
        } catch (error) {
          console.error(`  ❌ Failed packages/${category}:`, error.message);
          if (error.message.includes('permission') || error.message.includes('Permission denied')) {
            throw new Error('Firestore security rules are blocking writes. Please update your Firestore rules in Firebase Console.');
          }
        }
      }
      if (successCount === 0) {
        throw new Error('All write attempts failed. Please check Firestore security rules and network connection.');
      }
    }

    // 2. Add sample Umrah packages
    console.log('📦 Step 4: Adding Umrah packages...');
    try {
      const umrahRef = doc(db, 'packages', 'umrah');
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
      
      await setDocWithTimeout(umrahRef, { items: sampleUmrahPackages }, { merge: false }, 15000);
      console.log('✅ Added Umrah packages');
    } catch (error) {
      console.error('❌ Error adding Umrah packages:', error.message);
      throw error; // Stop if critical data fails
    }

    // 3. Add sample Best Deals
    console.log('📦 Step 5: Adding Best Deals...');
    try {
      const bestDealsRef = doc(db, 'packages', 'best-deals');
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
      
      await setDocWithTimeout(bestDealsRef, { items: sampleBestDeals }, { merge: false }, 15000);
      console.log('✅ Added Best Deals');
    } catch (error) {
      console.error('❌ Error adding Best Deals:', error.message);
      // Continue even if this fails
    }

    // 4. Add sample Testimonials
    console.log('📦 Step 6: Adding Testimonials...');
    try {
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
      
      for (let i = 0; i < sampleTestimonials.length; i++) {
        const testimonialRef = doc(db, 'testimonials', `sample-${i + 1}`);
        await setDocWithTimeout(testimonialRef, sampleTestimonials[i], {}, 10000);
        console.log(`  ✓ Added testimonial ${i + 1}`);
      }
      console.log('✅ Added Testimonials');
    } catch (error) {
      console.error('❌ Error adding Testimonials:', error.message);
      // Continue even if this fails
    }

    // 5. Add sample Destination Highlight
    console.log('📦 Step 7: Adding Destination Highlight...');
    try {
      const destinationRef = doc(db, 'destination-highlights', 'sample-1');
      const sampleDestination = {
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      };
      
      await setDocWithTimeout(destinationRef, sampleDestination, {}, 10000);
      console.log('✅ Added Destination Highlight');
    } catch (error) {
      console.error('❌ Error adding Destination Highlight:', error.message);
      // Continue even if this fails
    }

    console.log('✅✅✅ SIMPLE Database population completed!');
    return { success: true, message: 'Database populated successfully!' };
  } catch (error) {
    console.error('❌❌❌ Error in simplePopulateDatabase:', error);
    return { 
      success: false, 
      message: error.message || 'Unknown error',
      error: error
    };
  }
};

