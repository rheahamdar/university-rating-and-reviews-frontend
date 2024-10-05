import React, { useState } from 'react';
import "./SignUpForm.css";
import { FaUser, FaLock} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();

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

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[a-zA-Z]/.test(password)) {
      errors.push("Password must contain at least one letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*_=+\-?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      alert(passwordErrors);
    }else if (isEmailValid && password) {
      setLoading(true);
      setLoadingMessage('Please wait a few seconds.');
      try {
        const response = await axios.post('http://localhost:8080/register', {
            email,
            password
        });

        if (response.status === 200) {
          alert(response.data); 
          navigate('/login');
        }
      }catch (error) {
        let errorMessage = "An error occurred during sign-up. Please try again.";
      
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
      }finally{
        setLoading(false);
      }
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        <div className="input-box">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={validateEmail}
            required
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="8"
            pattern="^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"
            title="Password must be at least 8 characters, contain at least one letter, one number, and one special character"
            required
          />
          <FaLock className="icon" />
        </div>

        {error && <p style={{ color: 'red' }}>{error.toString()}</p>}

        <button type="submit" disabled={!isEmailValid || !password || loading}>
          {loading ? <div className="spinner"></div> : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;