import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: 'Admin - Orange Jelly',
  robots: {
    index: false,
    follow: false,
  },
};

/*
 * `data-clarity-mask` tells Microsoft Clarity to blank everything inside this
 * element before anything leaves the browser. GTM, which loads Clarity, is already
 * kept off /admin by `isTagManagerFreeRoute`; this is the second lock, for a
 * browser that reached the admin area with Clarity already running from an
 * earlier page. Enquiries are shown here in full and must never be recorded.
 */
export default function AdminPage() {
  return (
    <div data-clarity-mask="true">
      <AdminDashboard />
    </div>
  );
}
