import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { baseurl } from '../../constant/enviroment/enviroment';
import Cookies from 'js-cookie';


function UserAdminTableRows({ rowsData, handleChange, saveTableRows, deleteTableRow, setIsEditing, setIsAnyRowEditable }) {
  const handleDeleteClick = (index) => {
    Swal.fire({
      title: '',
      text: 'You are about to cancel this row. This action cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      position: 'top'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTableRow(index);
        setIsEditing(false);
        setIsAnyRowEditable(false);
      }
    });
  };
  const [permissions, setPermissions] = useState([]);
  const [passwordValid, setPasswordValid] = useState({}); // Store validation for each row

  const fetchUserPermissions = async () => {
    try {
      const token = Cookies.get('session');
      const response = await fetch(baseurl + '/admin/get-permission', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setPermissions(userData.data); // Set permissions array
        //console.log("userData.data in UserAdminTableRows",userData.data)
      } else {
        console.error('Failed to fetch user permissions');
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, []);



  const handleSaveClick = (index) => {
    const { name,username, emailid, password, confirmpassword, gender, permission } = rowsData[index];

    if (!name ||!username || !emailid || !password || !confirmpassword || !gender || !permission) {
      Swal.fire({
        icon: '',
        title: '',
        text: `Please fill in all fields before saving.`,
        position: 'top',
      });
      return;
    } else if (password !== confirmpassword) {
      Swal.fire({
        icon: '',
        title: '',
        text: `Passwords do not match.`,
        position: 'top',
      });
      return;
    }

    Swal.fire({
      title: '',
      text: 'Are you sure you want to add new user ?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Save',
      position: 'top'
    }).then((result) => {
      if (result.isConfirmed) {
        saveTableRows(index);
        deleteTableRow(index);
        setIsEditing(false);
        setIsAnyRowEditable(false);
      } else {
        deleteTableRow(index);
      }
    });
  };

  return (
    <>
      {rowsData.map((row, index) => (
        <tr className="add-row-parent" key={index} style={{ display: row.markedForDeletion ? 'none' : 'table-row' }}>
          <td>
            <input
              type="text"
              name="name"
              value={row.name}
              onChange={(e) => handleChange(index, e)}
            />
          </td>

          <td>
            <input
              type="text"
              name="username"
              value={row.username}
              onChange={(e) => handleChange(index, e)}
            />
          </td>
          <td>
            <input
              type="text"
              name="emailid"
              value={row.emailid}
              onChange={(e) => handleChange(index, e)}
            />
          </td>
          <td>
    <input
        type="password"
        name="password"
        value={row.password}
        onChange={(e) => {
            const value = e.target.value;

            // Password validation rules
            const minLength = 12;
            const hasNumber = /\d/.test(value);
            const hasLetter = /[a-zA-Z]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
            const hasCapitalLetter = /[A-Z]/.test(value);
            const isValid = value.length >= minLength && hasNumber && hasLetter && hasSpecialChar && hasCapitalLetter;

            handleChange(index, e); // Update the state with the new value

            setPasswordValid((prevState) => ({
                ...prevState,
                [index]: isValid, // Store validation per row
            }));
        }}
    />
    {passwordValid[index] === false && (
        <div className = "showerrpwd">
            Password must be at least 12 characters long, include a number, a letter, a special character, and an uppercase letter.
        </div>
    )}
</td>





          <td>
            <input
              type="password"
              name="confirmpassword"
              value={row.confirmpassword}
              onChange={(e) => handleChange(index, e)}
            />
          </td>
          {/* <td>
            <select
              name="gender"
              value={row.gender}
              onChange={(e) => handleChange(index, e)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
             </select>
          </td> */}
          <td>
  <select
    name="permission"
    value={row.permission}
    onChange={(e) => handleChange(index, e)}
  >
    {permissions === 'Admin' ? (
      <>
       <option >Select Permission</option>
        {/* <option value="2">Admin</option>
        <option value="3">Edit Manager</option>
        <option value="4">Viewer</option> */}
        <option value="5">Agent</option>
        <option value="6">Special Agent</option>
      </>
    ) : (
      <>
        <option >Select Permission</option>
        <option value="1">Super Admin</option>
        <option value="2">Admin</option>
        {/* <option value="3">Edit Manager</option>
        <option value="4">Viewer</option> */}
        <option value="5">Agent</option>
        <option value="6">Special Agent</option>
      </>
    )}
  </select>
</td>
          <td>
            <div className="addrowbuttons">
              <button
                className="btn_add"
                onClick={() => handleSaveClick(index)}
              >
                <i className="fa-solid fa-check"></i>
              </button>
              <button
                className="btn_cancel"
                onClick={() => handleDeleteClick(index)}
              >
                <i className="fa-solid fa-close"></i>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default UserAdminTableRows;
