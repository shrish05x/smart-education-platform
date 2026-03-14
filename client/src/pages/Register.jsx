import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" required minLength={6} />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Role</label>
          <select name="role" value={formData.role} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
            <option value="counselor">Counselor</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-semibold">
          Register
        </button>
        <p className="text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
