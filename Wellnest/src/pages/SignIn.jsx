import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

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
      alert("Signed in successfully");
      navigate("/Dashboard"); // Navigate to dashboard after successful login
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Error signing in");
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
                Username or Email    
              </label>
              <input
                className="bg-white text-gray-600 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Shraddha@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              /> 
            </div>

            <div>
              <h3 className="text-sm font-normal mr-auto mb-1">Password</h3>
              <input
                type="password"
                className="bg-white text-gray-600 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /> 
            </div>
            
            <button 
              type="submit"
              className="bg-blue-600 text-white font-medium text-sm w-full py-3 px-4 rounded-md hover:bg-blue-700 transition mt-4 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </form>
          
          <p className="text-sm mt-3 text-center">
            Don't have an account?{" "}
            <span 
              className="text-blue-600 cursor-pointer"
              onClick={handleButtonClick}
            >
              SignUp
            </span>
          </p>
        </div>  
      </div>
      <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-cyan-500 to-fuchsia-300 rounded-l-lg flex justify-center items-center">
        <img
          src="/assets/walking_animation.gif"
          alt="Sign In Animation"
          className="h-auto max-w-full"
        />
      </div>
    </div>
  );
};

export default SignIn;