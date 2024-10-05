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
  const navigate = useNavigate();

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
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      alert(passwordErrors);
    }else if (isEmailValid && password) {
      try {
        const response = await axios.post('http://localhost:8080/register/forgot-password', {
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
      }
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up Again</h1>

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
            required
          />
          <FaLock className="icon" />
        </div>

        {error && <p style={{ color: 'red' }}>{error.toString()}</p>}

        <button type="submit" disabled={!isEmailValid || !password}>
           Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;