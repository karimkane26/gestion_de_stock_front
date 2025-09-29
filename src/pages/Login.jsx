import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate(); // ❌ avant c'était dans handleSubmit → corrigé

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
console.log(response.data);

      if (response.data.success) {
        await login(response.data.user, response.data.token);

        if (response.data.user.role === 'admin') {
           toast.success('Connexion réussie !'); 
          navigate('/admin-dashboard');
        } else {
           toast.success('Connexion réussie !'); 

          navigate('/customer-dashboard');
        }
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      if(error.response){
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-green-600 from-50% to-gray-100 space-y-6">
      <h2 className="text-3xl text-white">Inventory Management System</h2>

      <div className="border shadow-lg p-6 w-60 bg-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {
          error && <div className="text-red-700 bg-red-200  ">{error}</div>
        }

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-3 py-2 border"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border"
              name="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2"
              disabled={loading}
            >
              {loading ? 'Connexion…' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
