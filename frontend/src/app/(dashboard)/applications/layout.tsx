import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Applications',
  description: 'Manage your job applications',
};
export default function ApplicationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
