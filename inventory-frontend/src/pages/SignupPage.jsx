import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const fields = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    autoComplete: 'name',
    placeholder: 'Jane Doe'
  },
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
    autoComplete: 'new-password',
    placeholder: 'Create a secure password'
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: 'Repeat your password'
  }
];

export default function SignupPage() {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup, getAuthErrorMessage } = useAuth();

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({
        fullName: values.fullName,
        email: values.email,
        password: values.password
      });
      navigate('/login', {
        replace: true,
        state: {
          message: 'Verification email sent. Please verify your email before logging in.'
        }
      });
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      title="Create your account"
      subtitle="Sign up with email and password to unlock the protected dashboard and inventory workflows."
      submitLabel="Create Account"
      fields={fields}
      values={values}
      error={error}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
      footerLabel="Already have an account?"
      footerLinkLabel="Log in"
      footerTo="/login"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Password requirements</p>
        <ul className="mt-3 space-y-2 text-slate-400">
          <li>At least 8 characters</li>
          <li>At least 1 uppercase letter</li>
          <li>At least 1 number</li>
          <li>At least 1 special character</li>
        </ul>
      </div>
    </AuthForm>
  );
}
