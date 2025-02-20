import React, { useEffect, useState } from 'react';
import './HeaderTwo.css';
import { Link, useNavigate } from 'react-router-dom';
import { baseurl } from '../../constant/enviroment/enviroment';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const HeaderTwo = () => {
  const [permissions, setPermissions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  const fetchUserPermissions = async () => {
    try {
      const token = Cookies.get('session'); // No trimming
      const response = await fetch(`${baseurl}/admin/get-permission`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
  
      const userData = await response.json();
      //console.log("Full userData response:", userData); // Log the full response
  
      if (response.ok) {
        // Check if userData.data is a string
        if (typeof userData.data === 'string') {
         // console.log("userData.data is a string:", userData.data);
          const permissionData = userData.data.trim(); // Trim the string
          setPermissions([permissionData]); // Set as an array
         // console.log("Updated permissions---", [permissionData]);
        } else {
          console.warn("userData.data is not a string:", userData.data);
          setPermissions([]); // Fallback to an empty array
        }
      } else {
        console.error('Failed to fetch user permissions');
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  };
      

  const handleLogout = () => {
    Cookies.remove("session"); // Remove token from cookies
    Cookies.remove("csrfToken"); // Remove token from cookies
    navigate('/login', { replace: true });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
 
  return (
    <div className="header">
      <div className="nav">
        <div className="brand-name">
        <img src="/images/hpf-logo.png" alt="HPF Logo" />
          {/* <Link to="/">
            <img src="/images/hpf-logo.png" alt="HPF Logo" />
          </Link> */}
        </div>
        <div className="user">
          {/* Show logout button for 'Agent' */}
          {permissions.includes('Agent') ? (
            <button className="dropbtn" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" /> &nbsp; Log Out
            </button>
          ) : (
              <>
                {/* Desktop view */}
                <div className="dropdown menu-drop">
                  <button className="dropbtn1" onClick={toggleDropdown}>
                    <i className="fa-solid fa-bars"></i> Menu
                </button>
                  {isDropdownOpen && (
                    <div className="dropdown-content">
                      {permissions.includes('Super Admin') || permissions.includes('Admin') ? (
                        <>
                          <Link to="/user">
                            <button className="dropbtn1">HPF User Manager</button>
                          </Link>
                          <Link to="/admin-share-drive">
                            <button className="dropbtn1">View Share Drive</button>
                          </Link>
                          <Link to="/facilityusermanagement">
                            <button className="dropbtn1">Facility User Management</button>
                          </Link>
                          <Link to="/facilitycode">
                            <button className="dropbtn1">Facility Manager</button>
                          </Link>
                          <Link to="/EAF-tracker">
                            <button className="dropbtn1">
                              <i className="fa-solid fa-truck-fast" /> &nbsp; EAF Tracker
                          </button>
                          </Link>
                        </>
                      ) : null}
                       {permissions.includes('Super Admin') && (
                        <>
                           <Link to="/data-file-upload">
                            <button className="dropbtn1">CSV Upload</button>
                          </Link>
                          
                        </>
                      )}
                      {permissions.includes('facility manager') && (
                        <>
                          <Link to="/client-portal">
                            <button className="dropbtn1">Home</button>
                          </Link>
                          <Link to="/file-upload">
                            <button className="dropbtn1">Upload EAF</button>
                          </Link>
                        </>
                      )}
                         {permissions.includes('special facility manager') && (
                        <>
                          <Link to="/special-client-portal">
                            <button className="dropbtn1">Home</button>
                          </Link>
                          <Link to="/file-upload">
                            <button className="dropbtn1">Upload EAF</button>
                          </Link>
                        </>
                      )}
                      <button className="dropbtn1" onClick={handleLogout}>
                        Log Out
                    </button>
                    </div>
                  )}
                </div>

                {/* Mobile view */}
                <div className="dropdown menu-mob">
                {permissions.includes('Super Admin') && (
                        <>
                         <Link to="/data-file-upload">
                            <button className="dropbtn">CSV Upload</button>
                          </Link>
                         
                        </>
                      )}
                  {permissions.includes('Super Admin') || permissions.includes('Admin') ? (
                    <>
                      <Link to="/user">
                        <button className="dropbtn">HPF User Manager</button>
                      </Link>
                      <Link to="/admin-share-drive">
                  <button className="dropbtn">View Share Drive</button>
                </Link>
                      <Link to="/facilityusermanagement">
                        <button className="dropbtn">Facility User Management</button>
                      </Link>
                      <Link to="/facilitycode">
                        <button className="dropbtn">Facility Manager</button>
                      </Link>
                      <Link to="/EAF-tracker">
                        <button className="dropbtn">
                          <i className="fa-solid fa-truck-fast" /> &nbsp; EAF Tracker
                      </button>
                      </Link>
                    </>
                  ) : null}
                   
                  {permissions.includes('facility manager') && (
                    <>
                      <Link to="/client-portal">
                        <button className="dropbtn">Home</button>
                      </Link>
                      <Link to="/file-upload">
                        <button className="dropbtn">Upload EAF</button>
                      </Link>
                    </>
                  )}
                   {permissions.includes('special facility manager') && (
                    <>
                      <Link to="/special-client-portal">
                        <button className="dropbtn">Home</button>
                      </Link>
                      <Link to="/file-upload">
                        <button className="dropbtn">Upload EAF</button>
                      </Link>
                    </>
                  )}

                  <button className="dropbtn drop-2" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket" /> &nbsp; Log Out
                </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default HeaderTwo;
