import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../../constant/enviroment/enviroment';
import Swal from 'sweetalert2';

const ResetPassword = ({ setAdminLoggedIn }) => {
  const [formData, setFormData] = useState({ password: '', confirmpassword: '' });
  const [passwordValid, setPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState('');
  const [csrfTokenState, setcsrfTokenState] = useState(null);
        useEffect(() => {
          const getCsrfToken = async () => {
            try {
              const response = await fetch(baseurl + '/csrf-token', {
                method: 'GET',
                //credentials: 'include', 
              });
              const data = await response.json();
              setcsrfTokenState(data.csrfToken); 
            } catch (error) {
              console.error("Error fetching CSRF token", error);
            }
          };
        
          getCsrfToken(); // Fetch CSRF token when the component mounts
        }, []);
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      // Password validation rules
      setResponseMessage('');
      const minLength = 8;
      const hasNumber = /\d/.test(value);
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
      const hasCapitalLetter = /[A-Z]/.test(value); // Ensures at least one uppercase letter
      const isPasswordValid = value.length >= minLength && hasNumber && hasLetter && hasSpecialChar && hasCapitalLetter;
      setPasswordValid(isPasswordValid);
  }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract the verify code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const verifyCode = urlParams.get('verify');

    try {
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(`${baseurl}/admin/reset-password/?verify=${verifyCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xsrf-token': csrfTokenState,
        },
        credentials: 'include',
        body: JSON.stringify(formData), // Pass the verify code in the request body if needed
      });
      const data = await response.json();

      if (response.ok) {
        // Login successful
        Swal.fire({
          icon: '',
          title: '',
          text: data.message, // Displaying data.message in the text value
          position:'top',
      });
        navigate('/login'); // Redirect to the login page
        setResponseMessage('');
      } else {
        
        //Password Not Matched
       // alert(data.message);
       setResponseMessage(data.message);
        if (data.message === 'Password Not Matched') {
          //alert(data.message);
          setUsernameError(data.message);
      } else if (data.message === 'Token Is Expired!!') {
        Swal.fire({
          icon: '',
          title: '',
          text: 'Your password reset link has expired.\nPlease request a new password reset link.', // Displaying data.message in the text value
          position:'top',
      });
         // alert("Your password reset link has expired. Please request a new password reset link.");
          navigate('/login', { replace: true });
      } 
      console.error('Login failed');
      }
    } catch (error) {
      Swal.fire({
        icon: '',
        title: '',
        text: data.message, // Displaying data.message in the text value
        position:'top',
    });
     // alert(data.message);
      console.error('Error during login:', error);
    }
  };

  return (
    <>
      <div className="login-form">
        <div className="form-box">
          <div className="form-value">
            <form onSubmit={handleSubmit}>
              <div className="heading">
                <h2 className="login-head reset-password-h2">Reset Password</h2>
                <img src="/images/hpf-logo.png" className="logo" alt="" />
              </div>

              <div className="inputbox">
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} icon`} onClick={togglePasswordVisibility} />
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
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
              <div className="inputbox">
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} icon`} onClick={togglePasswordVisibility} />
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                  className="inpt"
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="" className="level">
                  Confirm Password
                </label>
              </div>
              {!passwordValid && (
                  <p className="error_txt reset_pw">
                    Password must be at least 8 characters long and contain at least one number, one letter, and one special character.
                  </p>
                )}
                     <div className="error_txt reset_pw">
                                        {responseMessage === 'Password Not Matched' && <span>{responseMessage}</span>}
                                    </div>
              <button type="submit" className="login-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
