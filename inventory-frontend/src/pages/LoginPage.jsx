import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const initialValues = {
  email: '',
  password: ''
};

const fields = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'you@company.com'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'current-password',
    placeholder: 'Enter your password'
  }
];

export default function LoginPage() {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getAuthErrorMessage } = useAuth();

  const redirectTo = location.state?.from?.pathname ?? '/app';
  const statusMessage = location.state?.message ?? '';

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Log in to access your inventory dashboard, analytics, products, and Shopify connection flow."
      submitLabel="Log In"
      fields={fields}
      values={values}
      statusMessage={statusMessage}
      statusType="success"
      error={error}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
      footerLabel="Need an account?"
      footerLinkLabel="Create one"
      footerTo="/signup"
    >
      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          state={{ email: values.email }}
          className="text-sm font-semibold text-cyan-200 transition hover:text-white"
        >
          Forgot Password?
        </Link>
      </div>
    </AuthForm>
  );
}
