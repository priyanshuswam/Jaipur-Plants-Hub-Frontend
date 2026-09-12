import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-64"><div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" /></div>}>
      <LoginClient />
    </Suspense>
  );
}
