import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom'

function LoginPage() {

  // Agak gak yakin pake redux karena datanya simple
  
  const history = useNavigate();
  const [formData, setFormData] = useState({
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

    fetch('http://localhost:3000/user/login', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.success == true){
          console.log('Success!')
          console.log(data)
          localStorage.setItem('Token', data.token);
          localStorage.setItem('rToken', data.token);
          history(`/todo`);
        } else {
          console.log('Logging in Failed.');
          console.log(data)
          attention.textContent = 'Username or password is incorrect, please try again.';
        }
      })
      .catch((error) => {
        console.log('error')
        attention.textContent = 'Error, please try again.';
      });
  };

  return (
    <div className="all">
      <div className="Title">Log In Account</div>
      <form onSubmit={handleSubmit}>
        <input
          className="text"
          name="username"
          placeholder="Username"
          type="text"
          value={formData.username} // Bind input value to state
          onChange={handleInputChange} // Handle input changes
          required/>
        <input
          className="text"
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password} // Bind input value to state
          onChange={handleInputChange} // Handle input changes
          required/>
        <button type="submit">Submit</button>
      </form>
      <div className='attention'></div>
      <a href='/signup'>Make a new Account?</a>
      <a href='/todo'>__</a>
    </div>
  );
}

export default LoginPage;
