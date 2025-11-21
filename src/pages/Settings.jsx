import { Save, Globe, Lock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'Safar Air International',
    siteEmail: 'info@safarair.com',
    sitePhone: '+1 (555) 123-4567',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('User not authenticated');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, passwordData.newPassword);
      
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-primary-dark font-playfair'>
          Settings
        </h1>
        <p className='text-gray-600 mt-1 text-sm sm:text-base'>Manage your admin panel settings</p>
      </div>

      <div className='space-y-4 sm:space-y-6'>
        <div className='card-base p-4 sm:p-6'>
          <div className='flex items-center gap-3 mb-6'>
            <Globe className='w-6 h-6 text-primary' />
            <h2 className='text-xl font-bold text-primary-dark'>General Settings</h2>
          </div>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Site Name
              </label>
              <input
                type='text'
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Contact Email
                </label>
                <input
                  type='email'
                  value={settings.siteEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, siteEmail: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Contact Phone
                </label>
                <input
                  type='tel'
                  value={settings.sitePhone}
                  onChange={(e) =>
                    setSettings({ ...settings, sitePhone: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='card-base p-4 sm:p-6'>
          <div className='flex items-center gap-3 mb-6'>
            <Lock className='w-6 h-6 text-primary' />
            <h2 className='text-xl font-bold text-primary-dark'>Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Current Password *
              </label>
              <input
                type='password'
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                placeholder='Enter current password'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  New Password *
                </label>
                <input
                  type='password'
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                  placeholder='Enter new password'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm New Password *
                </label>
                <input
                  type='password'
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth'
                  placeholder='Confirm new password'
                />
              </div>
            </div>
            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={changingPassword}
                className='btn-primary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                <Lock className='w-4 h-4' />
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        <div className='flex justify-end'>
          <button
            onClick={handleSave}
            className='btn-primary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2'
          >
            <Save className='w-5 h-5' />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

