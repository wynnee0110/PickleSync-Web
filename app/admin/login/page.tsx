import type { Metadata } from 'next';
import { AdminLoginClient } from '@/components/admin/AdminLoginClient';

export const metadata: Metadata = {
  title: 'Admin Sign In | PickleSync Club Console',
  description:
    'Secure sign-in for PickleSync club administrators, front desk staff, and court operations managers.',
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
