import React, { useState } from 'react';

const LogIn = (props) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password);
  };

  return (
    <div className="auth-form-container">
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="shadow p-3">
          <h1 className="text-center" style={{ color: 'rgb(0, 132, 252)' }}>
            HOSTEL HAVEN
          </h1>
          <h5 className="text-center">
            LOG INTO YOUR ACCOUNT
          </h5>
          <form className="logIn-form" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <label className="input-label" htmlFor="Username">Username</label>
              <input
                type="text"
                className="form-control input-shadow"
                id="Username"
                name="Username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="form-floating mb-3">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control input-shadow"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Log In
              </button>
            </div>
            <div className="text-center">
              <button className="btn btn-link">Forgot password?</button>
            </div>
            <div className="text-center">
              <p>Don't have an account? <button onClick={() => props.onFormSwitch('Register')} className="btn btn-link">Sign Up</button></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
