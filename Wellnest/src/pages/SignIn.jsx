import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const userInfo = {
        email: email,
        password: password
      };
      
      const res = await axios.post("http://localhost:4001/User/SignIn", userInfo);
      
      console.log(res.data);
      
      // Save user in localStorage AND update the auth context
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAuthUser(res.data.user);
      
      alert("Signed in successfully");
      navigate("/Home"); 
    } catch (err) {
      console.log(err);
      if (err.response?.status === 400) {
        setError("Invalid email or password");
      } else {
        setError(err.response?.data?.message || "Error signing in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    navigate('/SignUp');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50"> 
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="font-bold text-3xl mb-6 text-center">
            Welcome Back
          </h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-medium text-sm block mb-1 text-gray-700">
                Email   
              </label>
              <input
                type="email"
                className="bg-white text-gray-600 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              /> 
            </div>

            <div>
              
              <input
                type="password"
                className="bg-white text-gray-600 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              /> 
            </div>
            
            <button 
              type="submit"
              className="bg-blue-600 text-white font-medium text-sm w-full py-3 px-4 rounded-md hover:bg-blue-700 transition mt-4 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sign In"}
            </button>
          </form>
          
          <p className="text-sm mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-medium hover:underline focus:outline-none"
              onClick={handleButtonClick}
            >
              Sign Up
            </button>
          </p>
        </div>  
      </div>
      <div className="hidden md:flex bg-gradient-to-r from-cyan-500 to-fuchsia-300 w-1/2 justify-center items-center p-6">
        <img
          src="/assets/walking_animation.gif"
          alt="Sign In Animation"
          className="h-auto max-w-full"
          onError={(e) => {e.target.src="https://via.placeholder.com/400x300?text=Sign+In"}}
        />
      </div>
    </div>
  );
};

export default SignIn;