import { Link } from 'react-router-dom';
import { AuthScreen } from '../components/AuthScreen';

export function ForgotPassword() {
  return (
    <AuthScreen
      eyebrow="// Reset"
      title="Reset coming soon."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/signin" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
        Password reset lands in v2. For now, email{' '}
        <a href="mailto:support@maybeck.com" className="text-primary hover:underline">
          support@maybeck.com
        </a>{' '}
        and the team will sort it.
      </p>
      <Link
        to="/signin"
        className="block w-full text-center bg-primary text-black font-mono font-black uppercase tracking-[0.3em] text-xs py-4 hover:bg-white transition-all rounded-full"
      >
        Back to sign in
      </Link>
    </AuthScreen>
  );
}
