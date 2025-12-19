import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // Login
      const result = await login(email, password);
      if (result.success && onClose) {
        onClose();
      }
    } else {
      // Register
      if (password !== confirmPassword) {
        setLoading(false);
        toast.error('Passwords do not match');
        return;
      }

      const result = await register(username, email, password);
      if (result.success && onClose) {
        onClose();
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1F1F1F] bg-opacity-50 z-50">
      <div className="bg-white text-black p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {isLogin ? 'Login to Play' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <div className="mb-4">
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={isLogin}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-3"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 text-sm w-full"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

AuthModal.propTypes = {
  onClose: PropTypes.func,
};

export default AuthModal;
