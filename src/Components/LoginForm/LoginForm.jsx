import React, { useState, useEffect } from 'react';
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const LoginForm = ({onLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value.endsWith('@mail.aub.edu')) {
      setError('Email must end with @mail.aub.edu');
      setIsEmailValid(false);
    } else {
      setError('');
      setIsEmailValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEmailValid && password) {

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      try {
        const response = await axios.post('http://localhost:8080/login', {
          email,
          password
      });

      if (response.status === 200) {
        localStorage.setItem('rememberedEmail', email);
        onLogin();
        navigate('/reviews');
      }
    }catch (error) {
      let errorMessage = "An error occurred during login. Please try again.";
    
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data); 
        }
      } else if (error.request) {
        errorMessage = "No response from the server. Please try again.";
      }
    setError(errorMessage);
    }
  } else {
    setError('Please ensure all fields are filled correctly.');
    }
    };
  
  return (
    <div className="page-container">
      <form onSubmit={handleSubmit}>
        <h1 className="page-title">AUB STUDENTS REVIEWS</h1>
        <p>A project by Rhea Hamdar</p>
        <div className="wrapper">
            <h1>Login</h1>

            <div className="input-box">
              <input 
                type="email" 
                placeholder="email" 
                value={email}
                onChange={validateEmail}
                required
              />
              <FaUser className="icon" />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div className="input-box">
              <input 
                type="password" 
                placeholder="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <FaLock className="icon"/>
            </div>
            <div className="remember-forgot">
              <label>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)} 
                /> 
                Remember me
              </label>
              <a href="/signup/forgot-password">Forgot password?</a>
            </div>

            <button type="submit" disabled={!isEmailValid || isPasswordValid}>Login</button>

            <div className="register-link">
              <p>Don't have an account? <Link to="/signup">Register</Link></p>
            </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
