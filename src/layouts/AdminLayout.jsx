import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='lg:ml-64'>
        <Header />
        <main className='p-4 sm:p-6'>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

