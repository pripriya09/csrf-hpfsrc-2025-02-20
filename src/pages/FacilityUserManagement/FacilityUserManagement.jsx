import React, { useState, useEffect } from 'react';
import { baseurl } from '../../constant/enviroment/enviroment';
import HeaderTwo from '../../layouts/Header2/HeaderTwo'
import './FacilityUserManagement.css'
import Footer from '../../layouts/Footer/Footer'
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';


const FacilityUserManagement = () => {
    const [formData, setFormData] = useState({
        facility_name: '',
        facility_code: '011000',
        username: '',
        emailid: '',
        password: '',
        confirmpassword: '',
        date: '',

    });

    const [errors, setErrors] = useState({
        emailid: ''
    });

    const [users, setUsers] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('')
    const [userList, setUserList] = useState([]);
    const [newUsername, setNewUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('');
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

    useEffect(() => {
        // Fetch user data from the API on component mount
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const apiUrl = `${baseurl}/admin/getallfacility-manager`;
        const token = Cookies.get('session');

        try {
            setLoading(true); // Set loading before fetching
            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });

            if (response.ok) {
                const result = await response.json();
                //console.log("result------->", result);

                // Filter users with permission as "facility manager"
                const facilityManagers = result.data.filter(user => user.permission === 'facility manager');

                // Update the users state with the filtered data
                setUsers(facilityManagers);

                // Set username from the first facility manager if available
                if (facilityManagers.length > 0) {
                    setUsername(facilityManagers[0].username);
                }

                setLoading(false);
                //console.log("First facility manager username:", facilityManagers.length > 0 ? facilityManagers[0].username : 'No managers found');
            } else {
                console.error('Failed to fetch user data');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);

        // If "Add New User" is selected, clear the new username and update formData
        if (value === "addNewUser") {
            setNewUsername(''); // Reset new username field
            setFormData((prevFormData) => ({
                ...prevFormData,
                username: '', // Ensure username is blank until user inputs a new one
            }));
        } else {
            // Update formData with the selected existing username
            setFormData((prevFormData) => ({
                ...prevFormData,
                username: value,
            }));
        }
    };


    // When the new username input changes, update both newUsername and formData
    const handleNewUsernameChange = (e) => {
        const value = e.target.value;
        setNewUsername(value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            username: value, // Set formData.username to the new username
        }));
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const month = '' + (d.getMonth() + 1);
        const day = '' + d.getDate();
        const year = d.getFullYear();

        return [month.padStart(2, '0'), day.padStart(2, '0'), year].join('/');
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'emailid') {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setEmailValid(isValidEmail);
        }

        if (name === 'password') {
            // Password validation rules
            const minLength = 12;
            const hasNumber = /\d/.test(value);
            const hasLetter = /[a-zA-Z]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
            const hasCapitalLetter = /[A-Z]/.test(value); // Ensures at least one uppercase letter
            const isPasswordValid = value.length >= minLength && hasNumber && hasLetter && hasSpecialChar && hasCapitalLetter;
            setPasswordValid(isPasswordValid);
        }
        // Log the result for testing
        // console.log('API Response:', facilities);
        //console.log('First Facility:', facilities[0]);
        if (name === 'facility_code' && value === '') {
            // Set it to the default value only if facilities array is not empty
            if (facilities.length > 0) {
                setFormData(prevData => ({
                    ...prevData,
                    facility_code: facilities[0].facility_code // Set to the first facility code
                }));
                // Also, set the facility name to the first facility's name
                setFormData(prevData => ({
                    ...prevData,
                    facility_name: facilities[0].name // Set to the name of the first facility
                }));
            }
        } else {
            if (name === 'facility_code') {
                const selectedFacility = facilities.find(facility => facility.facility_code === value);
                const newName = selectedFacility ? selectedFacility.name : '';
                setFormData(prevData => ({
                    ...prevData,
                    facility_name: newName // Update facility_name based on facility_code selection
                }));
            }
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleAddUser = async () => {
        const token = Cookies.get('session');
        const apiUrl = `${baseurl}/admin/add-facility-manager`;
        if (!csrfTokenState) {
            console.error("CSRF token is missing.");
            return;
          }
          
          try {
              const response = await fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': token,
                      'xsrf-token': csrfTokenState, 
                    },
                    credentials: 'include',
                body: JSON.stringify({
                    ...formData, // Include all form data
                    facility_code: formData.facility_code, // Set facility code from form state
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Display alert with the API message
                Swal.fire({
                    icon: '',
                    title: '',
                    text: result.message, // Displaying data.message in the text value
                    position: 'top',
                });
                //    alert(result.message);
                setResponseMessage('');

                // Clear the form data after successful registration
                setFormData({
                    facility_name: '',
                    facility_code: '',
                    username: '',
                    emailid: '',
                    password: '',
                    confirmpassword: '',
                    date: '',

                });

                // Fetch updated user data after adding a new user
                fetchUserData();
                setIsTableVisible(false);
            } else {
                // Display alert with an error message
                setResponseMessage(result.message);
                if (result.message === 'data and salt arguments required') {
                    Swal.fire({
                        icon: '',
                        title: '',
                        text: `Please fill in all fields before saving.`, // Displaying data.message in the text value
                        position: 'top',
                    });

                } else if (result.message === 'Username Already Taken') {

                    setUsernameError(result.message);
                } else if (result.message === 'Password Not Matched!!') {
                    result.message = 'Password/confirm password are not matching';
                    setPasswordMatchError(result.message);
                    setResponseMessage(result.message);
                    //console.log(result.message)
                } else if (result.message === 'Email Id is already used') {
                    result.message = 'Email is already associated with another account'
                    setPasswordMatchError(result.message);
                    setResponseMessage(result.message);
                    //console.log(result.message)
                }


            }
        } catch (error) {
            console.error('Error:', error);
            // Display alert with an error message
            Swal.fire({
                icon: '',
                title: '',
                text: 'error occurred', // Displaying data.message in the text value
                position: 'top',
            });
            //alert('Error occurred');
        }
    };

    const handleDeleteUserData = async (userId) => {
        Swal.fire({
            title: '',
            text: 'Are you sure you want to delete this User Data?',
            icon: '',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            position: 'top'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = Cookies.get('session');
                    if (!csrfTokenState) {
            console.error("CSRF token is missing.");
            return;
          }
          
                      const response = await fetch(baseurl + '/admin/delete-facility-manager', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'Authorization': token,
                              'xsrf-token': csrfTokenState, 
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                "_id": userId,
                        })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: '',
                            title: '',
                            text: data.message, // Displaying data.message in the text value
                            position: 'top',
                        });
                        fetchUserData(); // Update the data after deletion
                    } else {
                        console.error('Failed to delete user');
                    }
                } catch (error) {
                    // Handle error within the try-catch block
                    console.error('Error making API call:', error);
                    // You can choose to alert an error message here if necessary
                }
            }
        });
    };


    const handleResetUserPassword = async (userId) => {
        // Show the browser's built-in confirm dialog
        //const userConfirmed = window.confirm("Are you sure you want to reset your password?");



        Swal.fire({
            title: '',
            text: 'Are you sure you want to reset your password?',
            icon: '',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            position: 'top'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = Cookies.get('session');
                    
                    if (!csrfTokenState) {
                        console.error("CSRF token is missing.");
                        return;
                      }

                    const response = await fetch(baseurl + '/admin/manager-reset-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token,
                            'xsrf-token': csrfTokenState,
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            "_id": userId,
                        })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: '',
                            title: '',
                            text: data.message, // Displaying data.message in the text value
                            position: 'top',
                        });
                        fetchUserData(); // Update the data after deletion
                    } else {
                        Swal.fire({
                            icon: '',
                            title: '',
                            text: data.message, // Displaying data.message in the text value
                            position: 'top',
                        });
                        console.error('Failed to delete facility code');
                    }
                } catch (error) {
                    Swal.fire({
                        icon: '',
                        title: '',
                        text: data.message, // Displaying data.message in the text value
                        position: 'top',
                    });
                    console.error('Error making API call:', error);
                }
            }
        });
    }

    const toggleTableVisibility = () => {
        setIsTableVisible(!isTableVisible);
        setFormData({
            facility_name: '',
            facility_code: '',
            username: '',
            date: '',
            emailid: '',
            active: '',
            action: '',
            reset: '',




        });
    };

    const [checkedItems, setCheckedItems] = useState({});

    const handleCheckboxChange = async (_id, status) => {
        try {
            const token = Cookies.get('session');
           if (!csrfTokenState) {
            console.error("CSRF token is missing.");
            return;
          }
          
            const response = await fetch(baseurl + '/admin/update-facility-manager-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'xsrf-token': csrfTokenState,
                },
                credentials: 'include',
                body: JSON.stringify({
                    "_id": [_id],
                    "checked": status === 'true' ? false : true,
                })
            });

            if (response.ok) {
                //console.log("response.ok", response.ok);
                // console.log('API call successful');
                setCheckedItems(prevState => ({
                    ...prevState,
                    [_id]: !prevState[_id],
                }));
                //console.log("Api call ho gayee hai");
            } else {
                console.error('API call failed');
            }
        } catch (error) {
            console.error('Error making API call:', error);
        }
    };


    ///fetch facility codes 

    const [facilities, setFacilities] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = Cookies.get('session');
            const response = await fetch(baseurl + '/admin/fetch-facility-codes', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });

            const apiData = await response.json();
            if (apiData.message === 'Invalid token') {
                // Redirect to login page if the token is invalid
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setFacilities(apiData.data); // Set facility data into state
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    /// end to fetch facility codes
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 12000);
    }, []);
    const [filteredUsers, setFilteredUsers] = useState([]); // New state for filtered users

    // Update filteredUsers when filterCriteria changes
    useEffect(() => {
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            user.emailid.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            user.facility_name.some(name => name.toLowerCase().includes(filterCriteria.toLowerCase())) ||
            user.facility_code.some(code => code.toLowerCase().includes(filterCriteria.toLowerCase()))
        );
        setFilteredUsers(filtered);
    }, [filterCriteria, users]);


    return (
        <>
            <div className='User-content'>
                <HeaderTwo />
                <div className='container-div'>
                    <div className='user-head'>
                        <h1>Facility User Management</h1>
                        <div className="search-for">
                        <input className="search"
                            type="text"
                            placeholder="Search.... "
                            value={filterCriteria}
                            onChange={(e) => setFilterCriteria(e.target.value)}
                        />
                        <button className='dropbtn' onClick={toggleTableVisibility}>
                            {isTableVisible ? 'Cancel' : 'Add User'}
                        </button>
                        </div>
                    </div>
                    <div className="UserTable">
                        <table className='UserTable-data'>
                            <thead>
                                <tr>
                                    {isTableVisible ? (
                                        <>
                                            <th>Facility Name</th>
                                            <th>Facility Code</th>
                                            <th>User Name</th>
                                            {/* <th>Date Added</th> */}
                                            <th>Email</th>
                                            <th>Password</th>
                                            <th>Confirm Password</th>

                                        </>
                                    ) : (
                                            <>

                                                <th>Facility Name</th>
                                                <th>Facility Code</th>
                                                <th>User Name</th>
                                                <th>Date Added</th>
                                                <th>Email</th>
                                                <th>Active</th>
                                                <th>Action</th>
                                                <th>Reset</th>
                                            </>
                                        )}
                                </tr>
                            </thead>
                            <tbody>
                                {isTableVisible && (

                                    <tr>
                                        <td>
                                            <select
                                                name="facility_name"
                                                value={formData.facility_name}
                                                onChange={(e) => {
                                                    const selectedFacility = facilities.find(facility => facility.name === e.target.value);
                                                    if (selectedFacility) {
                                                        setFormData(prevData => ({
                                                            ...prevData,
                                                            facility_name: selectedFacility.name,
                                                            facility_code: selectedFacility.facility_code,
                                                        }));
                                                    } else {
                                                        setFormData(prevData => ({
                                                            ...prevData,
                                                            facility_name: e.target.value,
                                                            facility_code: '', // Clear facility_code if no valid selection
                                                        }));
                                                    }
                                                }}
                                            >
                                                <option value="">Select Facility Name</option>
                                                {facilities
                                                    .slice() // Create a shallow copy to avoid mutating the original array
                                                    .sort((a, b) => a.name.localeCompare(b.name)) // Sort facilities by name
                                                    .map(facility => (
                                                        <option key={facility._id} value={facility.name}>
                                                            {facility.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input type="text" name="facility_code" value={formData.facility_code} onChange={handleChange} placeholder="Facility Code" readOnly />
                                        </td>
                                        <td>

                                            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="User Name" />

                                            { /*************************** list for existing username ****************** */}
                                            {/* <select value={username} onChange={handleUsernameChange}>
                                                <option value="">Select User</option>
                                                {users.map(user => (
                                                    <option key={user._id} value={user.username}>
                                                        {user.username}
                                                    </option>
                                                ))}
                                                <option value="addNewUser">Add New User</option>
                                            </select> */}

                                            {/* Input field for new username */}
                                            {/* {username === "addNewUser" && (
                                                <input
                                                    type="text"
                                                    value={newUsername}
                                                    onChange={handleNewUsernameChange}
                                                    placeholder="Enter New Username"
                                                />
                                            )} */}
                                            {/*************************** list for existing username ****************** */}

                                            <div style={{ color: 'red' }}>
                                                {responseMessage === 'Username Already Taken' && <span>{responseMessage}</span>}
                                                {/* {responseMessage && <span>{responseMessage}</span>} */}
                                            </div>
                                        </td>
                                        {/* <td>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} placeholder="Date Added" max={new Date().toISOString().split('T')[0]} />
                                </td> */}
                                        <td>
                                            <div className="error_txt_td">
                                                <input
                                                    type="email"
                                                    name="emailid"
                                                    value={formData.emailid}
                                                    onChange={handleChange}
                                                    placeholder="E-mail"
                                                    required
                                                    style={{ borderColor: emailValid ? 'initial' : 'red' }}
                                                //disabled={username && username !== "addNewUser"} // Disable if an existing user is selected
                                                />
                                                {!emailValid && (
                                                    <p className="error_txt">Enter a valid email address</p>
                                                )}
                                                {emailValid && (
                                                    <div style={{ color: 'red' }}>
                                                        {responseMessage === 'Email is already associated with another account' && <span>{responseMessage}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="error_txt_td">
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Password"
                                                required
                                                style={{ borderColor: passwordValid ? 'initial' : 'red' }}
                                            //disabled={username && username !== "addNewUser"} // Disable if an existing user is selected
                                            />
                                            {!passwordValid && (
                                                <p className="error_txt">
                                                    Password must be at least 12 characters long and contain at least one number, one letter, and one special character.
                                                </p>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="password"
                                                name="confirmpassword"
                                                value={formData.confirmpassword}
                                                onChange={handleChange}
                                                placeholder="Confirm Password"
                                            //disabled={username && username !== "addNewUser"} // Disable if an existing user is selected
                                            />
                                            <div style={{ color: 'red' }}>
                                                {responseMessage === 'Password/confirm password are not matching' && <span>{responseMessage}</span>}
                                            </div>
                                        </td>

                                        <td className='add-user-action'>
                                            <button className='reset-btn' onClick={handleAddUser}>Add</button>
                                            <button className='delete-btn' onClick={toggleTableVisibility}>Cancel</button>
                                        </td>
                                    </tr>

                                )}

                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="loader-container">
                                            <div className="spinner"></div>
                                        </td>
                                    </tr>
                                ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user._id}>
                                                <td>
                                                    {user.facility_name.map((name, index) => (
                                                        <span key={index}>
                                                            {name}
                                                            {index < user.facility_name.length - 1 && <br />} {/* Add a <br /> except after the last name */}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td>
                                                    {user.facility_code.map((code, index) => (
                                                        <span key={index}>
                                                            {code}
                                                            {index < user.facility_code.length - 1 && <br />}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td>{user.username}</td>
                                                <td>{formatDate(user.createdAt)}</td>
                                                <td>{user.emailid}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={(checkedItems && user.status === 'true') || (!checkedItems && user.status === 'false')}
                                                        onClick={() => handleCheckboxChange(user._id, user.status)}
                                                    />
                                                </td>
                                                <td>
                                                    <button className='btn_delete' onClick={() => handleDeleteUserData(user._id)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className='reset-btn' onClick={() => handleResetUserPassword(user._id)}>Reset Password</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>

                    </div>
                </div>
                {/* <Footer /> */}
            </div>


        </>

    );

};
export default FacilityUserManagement;
