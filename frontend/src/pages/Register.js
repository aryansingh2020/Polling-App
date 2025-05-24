import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registration successful!');
      navigate('/login');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        <label>Username</label>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        
        <label>Email</label>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        
        <label>Password</label>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <label>Role</label>
        <select name="role" onChange={handleChange} value={form.role}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
