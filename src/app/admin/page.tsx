import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: 'Admin - Orange Jelly',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
