import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const fields = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'you@company.com'
  }
];

export default function ForgotPasswordPage() {
  const location = useLocation();
  const [values, setValues] = useState({
    email: location.state?.email ?? ''
  });
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword, getAuthErrorMessage } = useAuth();

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setStatusMessage('');
    setIsSubmitting(true);

    try {
      const result = await forgotPassword(values.email.trim());
      setStatusMessage(result.message);
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter the email tied to your account and we will send you a secure password reset link."
      submitLabel="Send Reset Email"
      fields={fields}
      values={values}
      statusMessage={statusMessage}
      statusType="success"
      error={error}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
      footerLabel="Remembered your password?"
      footerLinkLabel="Back to login"
      footerTo="/login"
    >
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400">
        <span>Need your account email first?</span>
        <Link to="/signup" className="font-semibold text-cyan-200 transition hover:text-white">
          Create account
        </Link>
      </div>
    </AuthForm>
  );
}
