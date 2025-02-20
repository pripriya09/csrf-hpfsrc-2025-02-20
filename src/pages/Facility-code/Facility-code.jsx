import React, { useState, useEffect } from "react";
import './Facility-code.css';
import HeaderTwo from '../../layouts/Header2/HeaderTwo';
import FacilityTableRows from "../../components/comman/FacilityTableRows";
import { baseurl } from '../../constant/enviroment/enviroment';
import { useNavigate } from 'react-router-dom'; // Import Link for navigation
import Footer from '../../layouts/Footer/Footer'
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';


const Facilitycode = () => {

  // State abbriviation drop down
  const [counties, setCounties] = useState([]);
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(''); // Add this line
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
  const stateAbbreviationsList = [
    'NC', 'SC', 'TN', 'AL', 'FL', 'GA', 'MS', 'OH', 'TX', 'LA', 'OK', 'IN', 'AZ', 'UT',
    'WI', 'WY', 'NH', 'AK', 'HI', 'KY', 'AR', 'MO', 'IA', 'KS', 'NE', 'CA', 'IL', 'HA',
    'OR', 'WA', 'MT', 'CO', 'MA', 'ME', 'NY', 'NJ', 'PA', 'DE', 'RI', 'VT', 'CT', 'MD',
    'VA', 'WV', 'MN', 'SD', 'ND', 'NV', 'ID', 'NM', 'MI'
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);
  const [errorMessageState, setErrorMessageState] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const [data, setData] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [editableRows, setEditableRows] = useState({});
  const [isAnyRowEditable, setIsAnyRowEditable] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [editedData, setEditedData] = useState({});

  const [newRowData, setNewRowData] = useState({
    name: "",
    state: "",
    county: "",
    verification_contact: "",
    emailid: "",
    emailid2: "",
    emailid3: "",
    facility_code: "",
    status: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [filterCriteria, setFilterCriteria] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleCheckboxChange = async (_id, status) => {
    try {
      const token = Cookies.get('session');
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(baseurl + '/admin/update-facility-status', {
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
        // console.log('API call successful');
        setCheckedItems(prevState => ({
          ...prevState,
          [_id]: !prevState[_id],
        }));
      } else {
        console.error('API call failed');
      }
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };

  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const user = {
    role: 'user' // Or any other role

  };

  //Fetch cunties trough API 
  const fetchCountiesByState = async (state) => {
    try {
      const validState = state.toUpperCase();
      
      if (stateAbbreviationsList.includes(validState)) {
        if (!csrfTokenState) {
          console.error("CSRF token is missing.");
          return;
        }
        const response = await fetch(baseurl + `/admin/get-counties-by-state`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
           'xsrf-token': csrfTokenState,
          },
         credentials: 'include',
          body: JSON.stringify({ "state": validState }),
        });

        const data = await response.json();
        if (!response.ok) {
          setCounties(data.data);
          //console.error('Errordd:', response.status, response.statusText);
          Swal.fire({
            icon: '',
            title: '',
            text: 'No counties found for the specified state,\nPlease enter your County manually.',
            position:'top',
          });


         // alert("No counties found for the specified state , Please enter your County manually ");
          setSelectedCounty('');

          return;
        }

        // console.log('API Response:', data);

        if (data.success) {
          setCounties(data.data);
        } else {
          console.error('API Error:', data.message);
        }
      } else {
        console.error('Invalid state abbreviation:', validState);
      }
    } catch (error) {
      console.error('Error fetching counties:', error);
    }
  };



  const handleDeleteFacilityCode = async (userId) => {
    Swal.fire({
      title: '',
      text: 'Are you sure you want to delete this facility code?',
      icon: '',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText : 'No',
      position: 'top'
    }).then(async (result) => {
      if (result.isConfirmed) { // Corrected to result.isConfirmed
        try {
          const token = Cookies.get('session');
          if (!csrfTokenState) {
            console.error("CSRF token is missing.");
            return;
          }
          const response = await fetch(baseurl + '/admin/deletefacilitycode', {
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
            fetchData(); // Update the data after deletion
          } else {
            console.error('Failed to delete facility code');
          }
        } catch (error) {
          console.error('Error making API call:', error);
        }
      }
    });
  };


  const handleSelect = (selectedState) => {
    setSearchTerm(selectedState);
    // console.log("selectedState---------->", selectedState)
    // Update the searchTerm state with the selected state
    setFilteredStates([]); // Clear the filtered states
    setIsStateSelected(true); // Set the state selection flag to true
    fetchCountiesByState(selectedState); // Fetch counties for the selected state

    // Update the selectedState state
    setSelectedState(selectedState);

  };


  const handleStateChange = (event) => {
    const value = event.target.value.toUpperCase(); // Convert input to uppercase
    setSearchTerm(value); // Update the search term state

    if (!/^[A-Z]*$/.test(value) || value.length > 2) {
      // Check if the entered value contains only uppercase letters
      // and has a length less than or equal to 2
      setFilteredStates([]);
      setErrorMessageState('Invalid State Code! Please enter only uppercase letters with 2 characters.');
    } else {
      // Clear any error message
      setErrorMessageState('');

      // Filter the state abbreviations based on the entered search term
      const filteredSuggestions = stateAbbreviationsList.filter(
        (state) => state.startsWith(value)
      );

      setFilteredStates(filteredSuggestions); // Update the filtered states
    }
  };

  const handleInputChange = (_id, field, value) => {
    // Ensure that editedData[_id] exists, and initialize if not
    const newData = { ...editedData[_id] || {} };  // If not defined, initialize as an empty object
    
    // Update the specific field
    newData[field] = value;
    
    // Update the editedData state with the updated row data
    setEditedData(prevState => ({ ...prevState, [_id]: newData }));
  };
  



  const handleCountySelect = (selectedCounty, itemId) => {
    setEditedData(prevEditedData => ({
      ...prevEditedData,
      [itemId]: {
        ...prevEditedData[itemId],
        county: selectedCounty
      }
    }));
  }

  const handleEdit = (_id) => {
    if (!isAnyRowEditable) {
      // Set the specific row as editable
      setEditableRows({ ...editableRows, [_id]: true });
      // Set isAnyRowEditable to true
      setIsAnyRowEditable(true);
    }

    setEditableRows({ ...editableRows, [_id]: true });
    const originalData = data.find(item => item._id === _id);
    setEditedData({ ...editedData, [_id]: { ...originalData } });
  };

  const handleSave = async (_id) => {
    const updatedData = { ...editedData[_id], state: searchTerm }; // Update the state value
    try {
      const token = Cookies.get('session');
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(baseurl + '/admin/updatefacilitycode', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(updatedData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenState,
        }
        
      });
      const data = await response.json();
      // console.log('API Response:', data);

      if (response.ok) {
        // Update the editable state for the specific row to false after saving
        setEditableRows(prevEditableRows => ({
          ...prevEditableRows,
          [_id]: false
        }));

        // Check if any row is still editable
        const anyRowEditable = Object.values(editableRows).some(value => value);
        // Update isAnyRowEditable accordingly
        setIsAnyRowEditable(false);
        //alert(data.message);
        fetchData(); // Refresh data after saving
      } else {
        // If save fails, handle the error
        console.error('Failed to update data:', data.message);
        // alert(data.message);
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
    setEditableRows({ ...editableRows, [_id]: false });
    setEditedData({ ...editedData, [_id]: null });
    setIsAnyRowEditable(false);
  };
  const [rowsfacilityData, setRowsfacilityData] = useState();
  useEffect(() => {
    fetchData();
  }, []);
  const navigate = useNavigate();
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
       
      // setLoading(true); // Set loading to true before making the API call
      const apiData = await response.json();

      if (apiData.message == 'Invalid token') {
        // Redirect to login page if the token is invalid
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
       
      // setLoading(false);
      setData(apiData.data);
       
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  };

  const addTableRows = () => {
    if (!isEditing) {
      setRowsData(prevRowsData => [...prevRowsData, newRowData]);
      setNewRowData({
        name: "",
        state: "",
        county: "",
        verification_contact: "",
        emailid: "",
        emailid2: "",
        emailid3: "",
        facility_code: "",
        status: "",
      });
      setIsEditing(prevIsEditing => !prevIsEditing);

    }
    setIsAnyRowEditable(true);
  };

  const deleteTableRow = (index) => {
    setRowsData((prevRows) => {
      const newRows = [...prevRows];
      newRows[index].markedForDeletion = true;
      return newRows;
    });
  };

  const saveTableRows = async (index) => {
    const updatedRow = rowsData[index];

    try {
      const token = Cookies.get('session');
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(baseurl + '/admin/addfacilitycode', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenState,
        },
        credentials: 'include',
        body: JSON.stringify(updatedRow),
      });
      const responseData = await response.json();

      if (responseData.success) {
        window.confirm(responseData.message);
        //console.log("responseData.message on success",responseData.message);
        setIsAnyRowEditable(false);
        fetchData();
      } else if (responseData.message === 'Emailids cannot be the same') {
       
        Swal.fire({
          icon: '',
          title: '',
          text: 'Emailids cannot be the same , Please use a different email ids.',
          position:'top',
        });
        setIsAnyRowEditable(true);


       // alert(`${responseData.message}\nPlease use a different email id's`);
      } else {
        setIsAnyRowEditable(false);
        console.error('Error updating data:', responseData.message);
        Swal.fire({
          icon: '',
          title: '',
          text: responseData.message,
          position:'top',
        });
        //console.log(responseData.message);
        //alert(`${responseData.message}\nPlease check the correct facility code and add with a new facility code`);
        
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const updatedRows = [...rowsData];
    updatedRows[index][name] = value;
    setRowsData(updatedRows);
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

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;

    return 0;
  });

  const handleColumnClick = (column) => {
    if (column === sortColumn) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const [permissions, setPermissions] = useState([]);
  // 1 - SuperAdmin
  // 2 - Admin 
  // 3 - Edit Manager
  // 4 - Viewer

  useEffect(() => {
    fetchUserPermissions();
    //console.log("permissions-------------------", permissions);
  }, [permissions]);
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
        //console.log("userData=\----------------", userData.data);
        // Assuming permissions are stored in userData.permissions
        setPermissions(userData.data); // Ensure permissions are set to an array
      } else {
        console.error('Failed to fetch user permissions');
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  };


  // const fetchUserPermissions = () => {
  //   try {
  //     // Retrieve permissions from local storage
  //     const permission = localStorage.getItem('permission');
  //     console.log("permission================>", permission);


  //     /admin/get-permission

  //     // Check user permissions and set the permissions state accordingly
  //     if (permission === 'Super Admin' || permission === 'Admin' || permission === 'Viewer' || permission === 'Edit Manager') {
  //       setPermissions([permission]); // Ensure setPermissions is called with an array
  //     } else {
  //       // Handle other cases if needed
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user permissions from local storage:', error);
  //   }
  // };

  // useEffect(() => {
  //   console.log("permissions22-------------------", permissions);
  // }, [permissions]);
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // }, []);


  return (
    <>
      <div className="facility-code-parent mt-3">
        <div className="container">
          <HeaderTwo />
          <div className="addtable pb-4">
            <div className="add-row-btn">
              <input className="search"
                type="text"
                placeholder="Search.... "
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              />
              {permissions.includes('Viewer') && (
                // Render the button if the user has the 'Viewer' role
                <button className="dropbtn btn_facility_manager add_btn_disabled">Add Facility</button>
              )}

              {(permissions.includes('Super Admin') || permissions.includes('Admin') || permissions.includes('Edit Manager')) && (
                // Render the button if the user has any of the specified roles
                <button className="dropbtn btn_facility_manager" onClick={addTableRows}> Add Facility</button>
              )}

            </div>

            <div className="admin-table">
              <table className="table tablepos">
                <thead>
                  <tr>
                    {/* <th>Sr. No.</th> */}
                    <th onClick={() => handleColumnClick('name')}>Facility Name</th>
                    <th onClick={() => handleColumnClick('state')}>State</th>
                    <th onClick={() => handleColumnClick('county')}>County</th>
                    <th onClick={() => handleColumnClick('verification_contact')}>Verification Contact</th>
                    <th onClick={() => handleColumnClick('emailid')}>Contact Email-1</th>
                    <th onClick={() => handleColumnClick('emailid2')}>Contact Email-2</th>
                    <th onClick={() => handleColumnClick('emailid3')}>Contact Email-3</th>
                    <th onClick={() => handleColumnClick('facility_code')}>Facility Code</th>
                    <th>Dedicated Facility Link</th>
                    <th>Active</th>
                    <th>Action</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  <FacilityTableRows
                    rowsData={rowsData}
                    handleChange={handleChange}
                    saveTableRows={saveTableRows}
                    deleteTableRow={deleteTableRow}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    setIsAnyRowEditable={setIsAnyRowEditable}
                  />
                </tbody>



                   {(permissions.includes('Super Admin') || permissions.includes('Admin') || permissions.includes('Edit Manager')) && (
                      // This content will only be rendered if user has admin role
                      <tbody className="dataform">
                       
                       
                { Array.isArray(sortedData) && sortedData.map((item, index) => (
                          <tr key={item._id}>
                            {/* <td data-label="Facility Code">{index + 1}</td> */}
                            <td data-label="Contact">
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

                            <td data-label="Contact">
                              {editableRows[item._id] ? (
                                <>
                                  <input
                                    id="state"
                                    type="text"
                                    value={searchTerm === null ? item.state : searchTerm}
                                    onChange={handleStateChange}
                                    placeholder="Enter new state..."
                                  />
                                  <ul className="state-dropdown">
                                    {filteredStates.map((state, index) => (
                                      <li key={index} onClick={() => handleSelect(state)}>
                                        {state}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              ) : (
                                  item.state
                                )}
                            </td>
                            {/* <td data-label="Contact">{item.state}</td> */}
                            {/* <td data-label="Contact">{item.county}</td> */}
                            <td data-label="Contact">
                              {editableRows[item._id] ? (
                                isStateSelected ? (
                                  counties.length > 0 ? (
                                    <select
                                      id="counties"
                                      value={editedData[item._id]?.county || selectedCounty}
                                      onChange={(e) => handleCountySelect(e.target.value, item._id)}
                                    >
                                      {counties.map((county, index) => (
                                        <option key={index} value={county}>
                                          {county}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                      <input
                                        type="text"
                                        id="counties"
                                        value={editedData[item._id]?.county || selectedCounty}
                                        onChange={(e) => handleCountySelect(e.target.value, item._id)}
                                        placeholder="Enter your county"
                                      />
                                    )
                                ) : item.county
                              ) : (
                                  item.county // Render the county data here
                                )}
                            </td>
                            {/* ///////////////////////////////////////////////// */}
                            <td data-label="Contact">
                              {editableRows[item._id] ? (
                                <input
                                  type="text"
                                  value={editedData[item._id]?.verification_contact || item.verification_contact}
                                  onChange={(e) => handleInputChange(item._id, 'verification_contact', e.target.value)}
                                />
                              ) : (
                                  item.verification_contact
                                )}
                            </td>
                            <td data-label="Contact">
                              {editableRows[item._id] ? (
                                <input
                                  type="text"
                                  value={editedData[item._id]?.emailid || ''}
                                  onChange={(e) => handleInputChange(item._id, 'emailid', e.target.value)}
                                />
                              ) : (
                                  item.emailid
                                )}
                            </td>
                            <td data-label="Contact">
                              {editableRows[item._id] ? (
                                <input
                                  type="text"
                                  value={editedData[item._id]?.emailid2 || ''}
                                  onChange={(e) => handleInputChange(item._id, 'emailid2', e.target.value)}
                                />
                              ) : (
                                  item.emailid2
                                )}
                            </td>
                            <td data-label="Contact">
                              {editableRows[item._id] ? (
                                <input
                                  type="text"
                                  value={editedData[item._id]?.emailid3 || ''}
                                  onChange={(e) => handleInputChange(item._id, 'emailid3', e.target.value)}
                                />
                              ) : (
                                  item.emailid3
                                )}
                            </td>
                            <td data-label="Contact">{item.facility_code}</td>
                            <td data-label="Contact">
                              <a href={item.dedicated_facility_link} target="_blank" rel="noopener noreferrer">
                                {item.dedicated_facility_link}
                              </a>
                            </td>
                            <td data-label="Contact">

                              <input
                                type="checkbox"
                                defaultChecked={(checkedItems && item.status === 'true') || (!checkedItems && item.status === 'false')}
                                onClick={() => handleCheckboxChange(item._id, item.status)}
                              />
                            </td>
                            <td data-label="Contact">
                              <button
                                className="btn_delete"
                                onClick={() => handleDeleteFacilityCode(item._id)}
                                data-tooltip-content="Delete"
                                data-tooltip-id="my-tooltip-delete"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                            <td data-label="Contact" className="edit-btn">
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
                        }
                      </tbody>
                    )}
                

                {permissions.includes('Viewer') && (
                  // This content will only be rendered if user has user role
                  <tbody className="dataform">
                    {Array.isArray(sortedData) && sortedData.map((item, index) => (
                      <tr key={item._id}>
                        {/* <td data-label="Facility Code">{index + 1}</td> */}
                        <td data-label="Contact">{item.name}</td>
                        <td data-label="Contact"> {item.state}</td>
                        <td data-label="Contact">{item.county}</td>
                        <td data-label="Contact">{item.verification_contact}</td>
                        <td data-label="Contact">{item.emailid}</td>
                        <td data-label="Contact">{item.emailid2}</td>
                        <td data-label="Contact">{item.emailid3}</td>
                        <td data-label="Contact">{item.facility_code}</td>
                        <td data-label="Contact">
                          <a href={item.dedicated_facility_link} target="_blank" rel="noopener noreferrer">
                            {item.dedicated_facility_link}
                          </a>
                        </td>
                        <td data-label="Contact">

                          <input
                            type="checkbox"
                            defaultChecked={(checkedItems && item.status === 'true') || (!checkedItems && item.status === 'false')}
                            disabled
                          />
                        </td>
                        <td data-label="Contact">
                          <button
                            className="btn_delete btn_disabled"
                            //onClick={() => handleDeleteFacilityCode(item._id)}
                            data-tooltip-content="Delete"
                            data-tooltip-id="my-tooltip-delete"

                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                        <td data-label="Contact" className="edit-btn">

                          <button className="btn-edit btn_disabled"><i className="fa-solid fa-pen-to-square"></i></button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}

              </table>
            </div>
          </div>
          {/* <Footer/> */}
        </div>
      </div>
     
    </>
  );
};

export default Facilitycode;
