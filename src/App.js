import React, { Component } from "react";
import {Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";
import SignUpForm from "./Components/SignUpForm/SignUpForm";
import ForgotPasswordForm from "./Components/SignUpForm/ForgotPasswordForm";
import ReviewPage from "./Components/ReviewsForm/ReviewPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn : false,
    };
  }  

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
  }

  render(){
    return (
      <BrowserRouter>
        <Routes> 
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm onLogin={this.handleLogin} />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path ="/signup/forgot-password" element={<ForgotPasswordForm />} />
          <Route path ="/reviews" element={<ReviewPage />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
export default App;