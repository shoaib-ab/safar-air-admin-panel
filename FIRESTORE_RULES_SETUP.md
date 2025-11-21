# Firestore Security Rules Setup

## Problem
If you're getting timeout errors when trying to populate the database, it's likely because Firestore security rules are blocking writes.

## Solution: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **safar-air**
3. Navigate to **Firestore Database** > **Rules** tab
4. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write all collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // OR if you want to allow public read (for website) but authenticated write (for admin):
    // match /packages/{document=**} {
    //   allow read: if true;  // Public read for website
    //   allow write: if request.auth != null;  // Authenticated write for admin
    // }
    // 
    // match /testimonials/{document=**} {
    //   allow read: if true;
    //   allow write: if request.auth != null;
    // }
    // 
    // match /destination-highlights/{document=**} {
    //   allow read: if true;
    //   allow write: if request.auth != null;
    // }
  }
}
```

5. Click **Publish** to save the rules

## Recommended Rules (More Secure)

For production, use these rules that allow public read but require authentication for writes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Packages collection - public read, authenticated write
    match /packages/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Testimonials collection - public read, authenticated write
    match /testimonials/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Destination highlights - public read, authenticated write
    match /destination-highlights/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Test collection (for connectivity tests)
    match /_test/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## After Updating Rules

1. Wait 1-2 minutes for rules to propagate
2. Refresh your admin panel
3. Try the "Populate Database" button again
4. Check the browser console for success messages

## Verify Rules Are Working

After updating rules, you should see:
- ✅ No timeout errors
- ✅ Successful batch commits
- ✅ Data appearing in Firebase Console

## Troubleshooting

If you still get errors after updating rules:

1. **Check Authentication**: Make sure you're logged in to the admin panel
2. **Check Rules Syntax**: Make sure there are no syntax errors in the rules
3. **Wait for Propagation**: Rules can take 1-2 minutes to update
4. **Check Browser Console**: Look for specific error messages

