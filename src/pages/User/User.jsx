import React, { useState, useEffect } from "react";
import './user.css';
import '../../pages/Facility-code/Facility-code.css';
import HeaderTwo from '../../layouts/Header2/HeaderTwo';
import UserAdminTableRows from "../../components/comman/UseradmintableRows";
import { baseurl } from '../../constant/enviroment/enviroment';
import { useNavigate } from 'react-router-dom';
import Footer from '../../layouts/Footer/Footer';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const User = () => {
  const [data, setData] = useState([]);
  const [isAnyRowEditable, setIsAnyRowEditable] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [filterCriteria, setFilterCriteria] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [permissions, setPermissions] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [editableRows, setEditableRows] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNewUser, setIsAddingNewUser] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const allPermissions = ["Super Admin", "Admin", "Agent", "Special Agent"]; 
  const [csrfTokenState, setcsrfTokenState] = useState(null);
  const [newRowData, setNewRowData] = useState({
    name: "",
    username: "",
    emailid: "",
    password: "",
    confirmpassword: "",
    gender: 'Male',
    permission: "1",
  });

  const addTableRows = () => {
    if (!isEditing) {
      setRowsData(prevRowsData => [...prevRowsData, newRowData]);
      setNewRowData({
        name: "",
        username: "",
        emailid: "",
        password: "",
        confirmpassword: "",
        gender: 'Male',
        permission: "1",
      });
      setIsEditing(prevIsEditing => !prevIsEditing);
    }
    setIsAnyRowEditable(true);
    setIsAddingNewUser(true); 
  };

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

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: '',
      text: 'Are you sure you want to delete this User?',
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
          
          
          const response = await fetch(baseurl + '/admin/delete-useradmin', {
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
          if (response.ok) {
            fetchData(); 
          } else {
            console.error('Failed to delete User');
          }
        } catch (error) {
          console.error('Error making API call:', error);
        }
      }
    });
  };

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
        setPermissions(userData.data); 
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

  const handleSave = async (_id) => {
    const updatedData = { ...editedData[_id] };

    try {
      const token = Cookies.get('session');
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(baseurl + '/admin/admin-update-details', {
        method: 'POST',
        body: JSON.stringify(updatedData),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenState, 
        }
      });
      const data = await response.json();

      if (response.ok) {
        setEditableRows(prevEditableRows => ({
          ...prevEditableRows,
          [_id]: false
        }));
        setIsAnyRowEditable(false);
        fetchData(); 
      } else {
        console.error('Failed to update data:', data.message);
        handleCancel(_id);
      }
    } catch (error) {
      console.error('Error updating data:', error);
      handleCancel(_id);
    }
  };

  const handleCancel = (_id) => {
    const updatedEditableRows = { ...editableRows };
    delete updatedEditableRows[_id];
    setEditableRows(updatedEditableRows);
    setEditedData(prevEditedData => ({
      ...prevEditedData,
      [_id]: null
    }));
    setIsAnyRowEditable(false);
    setIsAddingNewUser(false); 
  };

  const fetchData = async () => {
    try {
      setLoading(true); 
      const token = Cookies.get('session');

      if (!token) {
        console.error("No token found. Please login.");
        navigate('/login');
        return;
      }

      const response = await fetch(baseurl + '/admin/get-all-useradmin', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });

      const apiData = await response.json();

      if (apiData.message === 'Invalid token') {
        console.error("Invalid token. Redirecting to login.");
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (permissions === "Super Admin") {
        setData(apiData.data);
      } else if (permissions === "Admin") {
        const filteredData = apiData.data.filter(user => user.permission !== 'Super Admin' && user.permission !== 'Admin');
        setData(filteredData);
      } else {
        console.warn("Unknown permissions:", permissions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (permissions) {
      fetchData();
    } else {
      console.warn("Permissions not set. Cannot fetch data.");
    }
  }, [permissions]); 

  const handleEdit = (_id) => {
    if (!isAnyRowEditable) {
      setIsAnyRowEditable(true);
    }
    setEditableRows({ ...editableRows, [_id]: true });
    const originalData = data.find(item => item._id === _id);
    setEditedData({ ...editedData, [_id]: { ...originalData } });
  };

  const handleColumnClick = (column) => {
    if (column === sortColumn) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const filteredData = data.filter((user) => {
    const match = Object.entries(user).some(([key, value]) => {
      if (typeof value === 'string') {
        const regex = new RegExp(escapeRegExp(filterCriteria), 'i');
        return regex.test(value);
      } else if (typeof value === 'number') {
        return value === parseFloat(filterCriteria);
      }
      return false;
    });

    return match;
  });

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const updatedRows = [...rowsData];
    updatedRows[index][name] = value;
    setRowsData(updatedRows);
  };

  const saveTableRows = async (index) => {
    const updatedRow = rowsData[index];

    try {
      const token = Cookies.get('session');
      // if (!csrfTokenState) {
      //   console.error("CSRF token is missing.");
      //   return;
      // }
      const response = await fetch(baseurl + '/admin/adminregistration', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          //'xsrf-token': csrfTokenState, 
        },
        // credentials: 'include',
        body: JSON.stringify(updatedRow),
      });
      const responseData = await response.json();

      if (responseData.success) {
        window.confirm(responseData.message);
        setIsAnyRowEditable(false);
        setIsAddingNewUser(false); 
        fetchData();
      } else if (responseData.message === 'Emailids cannot be the same') {
        Swal.fire({
          icon: '',
          title: '',
          text: 'Emailids cannot be the same , Please use a different email ids.',
          position: 'top',
        });
        setIsAnyRowEditable(true);
      } else {
        setIsAnyRowEditable(false);
        console.error('Error updating data:', responseData.message);
        Swal.fire({
          icon: '',
          title: '',
          text: 'User Already Exist.',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const deleteTableRow = (index) => {
    setRowsData((prevRows) => {
      const newRows = [...prevRows];
      newRows[index].markedForDeletion = true;
      return newRows;
    });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;

    return 0;
  });

  const handleInputChange = (_id, field, value) => {
    const newData = { ...editedData[_id] };
    newData[field] = value;
    setEditedData({ ...editedData, [_id]: newData });
  };

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return (
    <>
      <div className="facility-code-parent mt-3">
        <div className="container">
          <HeaderTwo />
          <div className="add-row-btn">
            <input className="search"
              type="text"
              placeholder="Search.... "
              value={filterCriteria}
              onChange={(e) => setFilterCriteria(e.target.value)}
            />
            <button className="dropbtn btn_facility_manager" onClick={addTableRows}> Add New User</button>
          </div>

          <div className="addtable pb-4">
            <div className="admin-table">
              <table className="table tablepos">
                {isAddingNewUser ? (
                  <thead>
                    <tr>
                      <th onClick={() => handleColumnClick('name')}>Name</th>
                      <th onClick={() => handleColumnClick('username')}>Username</th>
                      <th onClick={() => handleColumnClick('emailid')}>Email ID</th>
                      <th onClick={() => handleColumnClick('password')}>Password</th>
                      <th onClick={() => handleColumnClick('confirmpassword')}>Confirm Password</th>
                      <th onClick={() => handleColumnClick('permission')}>Permission</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                ) : (
                  <thead>
                    <tr>
                      <th onClick={() => handleColumnClick('name')}>Name</th>
                      <th onClick={() => handleColumnClick('username')}>Username</th>
                      <th onClick={() => handleColumnClick('emailid')}>Email ID</th>
                      <th onClick={() => handleColumnClick('password')}>Password</th>
                      <th onClick={() => handleColumnClick('confirmpassword')}>Confirm Password</th>
                      <th onClick={() => handleColumnClick('permission')}>Permission</th>
                      <th>Action</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                )}

                <tbody>
                  <UserAdminTableRows
                    rowsData={rowsData}
                    handleChange={handleChange}
                    saveTableRows={saveTableRows}
                    deleteTableRow={deleteTableRow}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    setIsAnyRowEditable={setIsAnyRowEditable}
                  />
                </tbody>

                <tbody className="dataform">
                  {loading ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center' }}>
                      <div className="loader-container">
                        <div className="spinner"></div>
                      </div>
                    </td>
                    </tr>
                  ) : (
                    Array.isArray(sortedData) && sortedData.map((item) => (
                      <tr key={item._id}>
                        <td data-label="name">
                          {editableRows[item._id] ? (
                            <input
                              type="text"
                              value={editedData[item._id]?.name || item.name}
                              onChange={(e) => handleInputChange(item._id, 'name', e.target.value)}
                            />
                          ) : (
                            item.name
                          )}
                        </td>
                        <td data-label="Username">
                          {editableRows[item._id] ? (
                            <input
                              type="text"
                              value={editedData[item._id]?.username || item.username}
                              onChange={(e) => handleInputChange(item._id, 'username', e.target.value)}
                            />
                          ) : (
                            item.username
                          )}
                        </td>
                        <td data-label="Email ID">
                          {editableRows[item._id] ? (
                            <input
                              type="text"
                              value={editedData[item._id]?.emailid || item.emailid}
                              onChange={(e) => handleInputChange(item._id, 'emailid', e.target.value)}
                            />
                          ) : (
                            item.emailid
                          )}
                        </td>

                        <td data-label="Password">
                          {editableRows[item._id] ? (
                            <input
                              type="password"
                              value={editedData[item._id]?.password || ""}
                              onChange={(e) => handleInputChange(item._id, 'password', e.target.value)}
                            />
                          ) : (
                            '********'
                          )}
                        </td>

                        <td data-label="Confirm Password">
                          {editableRows[item._id] ? (
                            <input
                              type="text"
                              value={editedData[item._id]?.confirmpassword || ""}
                              onChange={(e) => handleInputChange(item._id, 'confirmpassword', e.target.value)}
                            />
                          ) : (
                            '********'
                          )}
                        </td>

                        <td data-label="Permission">
                          {editableRows[item._id] ? (
                            <select
                              value={editedData[item._id]?.permission || item.permission}
                              onChange={(e) => handleInputChange(item._id, 'permission', e.target.value)}
                            >
                              {permissions.includes("Super Admin") ? (
                                allPermissions.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))
                              ) : (
                                allPermissions
                                  .filter(option => ["Admin", "Agent", "Special Agent"].includes(option))
                                  .map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))
                              )}
                            </select>
                          ) : (
                            item.permission
                          )}
                        </td>

                        <td data-label="Action">
                          <button
                            className="btn_delete"
                            onClick={() => handleDeleteUser(item._id)}
                            data-tooltip-content="Delete"
                            data-tooltip-id="my-tooltip-delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                        <td data-label="Edit" className="edit-btn">
                          {editableRows[item._id] ? (
                            <>
                              <button className="btn_add" onClick={() => handleSave(item._id)}><i className="fa-solid fa-check"></i></button>
                              <button className="btn_cancel" onClick={() => handleCancel(item._id)}><i className="fa-solid fa-close"></i></button>
                            </>
                          ) : (
                            <button className={`btn-edit ${isAnyRowEditable ? 'disabled' : ''}`} onClick={() => handleEdit(item._id)} disabled={isAnyRowEditable}><i className="fa-solid fa-pen-to-square"></i></button>
                          )}
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
      </div>
    </>
  );
};

export default User;
