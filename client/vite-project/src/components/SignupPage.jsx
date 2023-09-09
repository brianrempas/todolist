import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  var attention = document.querySelector('.attention');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/user/create', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if(data == 'success'){
          console.log('Creating Account Success!');
          history(`/login`);
        } else {
          console.log('Creating Account Failed.');
          attention.textContent = 'Username already used, please try another name.';
        }
      })
      .catch((error) => {
          console.log('response: ' + error);
          attention.textContent = 'Error, please try again.';
      });
  };

  return (
    <div className="all">
      <div className="Title">Sign Up</div>
      <form onSubmit={handleSubmit}>
        <input
          className="text"
          name="name"
          placeholder="Name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          required/>
        <input
          className="text"
          name="username"
          placeholder="Username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          required/>
        <input
          className="text"
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required/>
        <button type="submit">Sign Up</button>
      </form>
      <div className="attention"></div>
      <a href="/login">Already have an account? Log in</a>
      <a href="/todo">__</a>
    </div>
  );
}

export default SignupPage;
