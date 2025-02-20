import React, { useState, useEffect  } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../../constant/enviroment/enviroment'
import Footer from '../../layouts/Footer/Footer'
import Cookies from 'js-cookie';
//without otp code

const Login = ({ setAdminLoggedIn }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const getCsrfToken = async () => {
    try {
      const response = await fetch(baseurl + '/csrf-token', {
        method: 'GET',
        credentials: 'include', // Include cookies for CSRF protection
      });
      const data = await response.json();
      // setCsrfTokenState(data.csrfToken); // Store the CSRF token in your state
      return data.csrfToken; // Return CSRF token for later use
    } catch (error) {
      console.error("Error fetching CSRF token", error);
      return null;
    }
  };

  const handleLogin = async () => {
     try {
      // Ensure CSRF token is fetched and set
          const csrfTokenstate = await getCsrfToken(); // Wait for CSRF token
          if (!csrfTokenstate) {
            console.error("CSRF token is missing.");
            return;
          }
    
        const response = await fetch(baseurl + '/admin/adminlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'xsrf-token': csrfTokenstate,  // Send CSRF token here
           
          },
          body: JSON.stringify(formData),
          credentials: 'include',  
        });

      const data = await response.json();

      
      
      //console.log('Login response data:', data); // Check login response
  
      if (data.success) {
        Cookies.set('session', data.data.token, { expires: 0.25 });
          const permissionsResponse = await fetch(baseurl + '/admin/get-permission', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': data.data.token,
          },
        });
        const permissionsData = await permissionsResponse.json();
        
        //console.log("permissionsData-------->", permissionsData); // Verify permissions data
  
        if (permissionsResponse.ok) {
          const role = permissionsData.data.trim(); // Trim to remove any leading/trailing spaces
         // console.log("Role:", role); // Verify role value
          
          if (role === 'facility manager') {
            navigate('/client-portal');
          } else if (role === 'Super Admin') {
            navigate('/EAF-Tracker');
          } else if (role === 'Admin') {
            navigate('/EAF-Tracker');
          } else if (role === 'special facility manager') {
            navigate('/special-client-portal');
          } else if (role === 'Agent') {
            navigate('/HPF-agentportal');
            return;
          }else {
            console.error('Unexpected role:', role);
          }
        } else {
          console.error('Failed to fetch user permissions');
        }
  
        setAdminLoggedIn(true);
      } else {
        setErrorMessage(data.message);
        console.error('Login failed');
      }
    } catch (error) {
      setErrorMessage('Error during login. Please try again.');
      console.error('Error during login:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  return (
    <>
      <div className="login-form">
        <div className="form-box">
          <div className="form-value">
            <form onSubmit={handleSubmit}>
              <div className="heading">
                <h2 className="login-head">Login</h2>
                <img src="/images/hpf-logo.png" className="logo" alt="" />
              </div>
             
              <div className="inputbox">
                <i className="fa-solid fa-user icon" />
                <input
                  type="text"
                  className="inpt"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="" className="level">
                  Username
                </label>
              </div>
              <div className="inputbox">
                <i className="fa-solid fa-lock icon" />
                <input
                  type="password"
                  className="inpt"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="" className="level">
                  Password
                </label>
              </div>
              <div className="error-message">{errorMessage}</div>
              <button type="submit" className="login-btn">
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer/>
    </>
  )
}

export default Login