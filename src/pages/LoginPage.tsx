import { Lock } from "lucide-react";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { post } from '../api/client';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await post('/auth/login', { email, password });
      if (res && res.data && res.data.token) {
        // Stocker le token et l'utilisateur
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // Si contexte Auth existe
        if (auth && typeof auth.login === 'function') {
          auth.login(res.data.user, res.data.token);
        }

        setError('');
        navigate('/dashboard'); // redirection après login
      } else {
        setError('Erreur lors de la connexion');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-sm shadow-lg w-full max-w-md">
        <h1 className="text-white text-3xl font-semibold text-center mb-8">
          <Lock className="inline-block mr-2 w-20 h-20 text-cyan-400" />
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-2 text-sm font-medium">Email address</label>
            <input
              type="email"
              placeholder="Exemple@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full px-4 py-2 rounded-sm bg-night text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="**************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full px-4 py-2 rounded-sm bg-night text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="btn btn-soft btn-primary btn-block">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;