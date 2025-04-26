import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/SignIn");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // Validate form
    if (!name || !email || !password || !rePassword) {
      setError("All fields are required");
      return;
    }
    
    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const userInfo = {
      name: name,
      email: email,
      password: password
    };
    
    try {
      
      const res = await axios.post("http://localhost:4001/User/SignUp", userInfo);
      console.log(res.data);
      alert("Account Created Successfully");
      navigate("/SignIn"); 
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="font-bold text-3xl mb-6 text-center">Create Account</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-medium text-sm block mb-1 text-gray-700">
                Name
              </label>
              <input
                className="bg-white text-gray-600 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
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
              <label className="font-medium text-sm block mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="bg-white text-gray-600 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="font-medium text-sm block mb-1 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="bg-white text-gray-600 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-medium text-sm w-full py-3 px-4 rounded-md hover:bg-blue-700 transition mt-4 flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          
          <p className="text-sm mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-medium hover:underline focus:outline-none"
              onClick={handleButtonClick}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
      
      <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-indigo-900 w-1/2 justify-center items-center p-6">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">Welcome to Our Platform</h2>
          
          <div className="mb-8">
            <img
              src="/assets/signup.png"
              alt="Welcome illustration"
              className="w-full h-auto rounded-lg shadow-xl"
              onError={(e) => {e.target.src="https://via.placeholder.com/400x300?text=Welcome"}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;