import React, { useState, useEffect } from "react";
// import './Facility-code.css';
import HeaderTwo from '../layouts/Header2/HeaderTwo';
import { baseurl } from '../constant/enviroment/enviroment';
import Cookies from 'js-cookie';

const DropdownExample = () => {

  const [data, setData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [filterCriteria, setFilterCriteria] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [editableRows, setEditableRows] = useState({});
  const [editedData, setEditedData] = useState({});
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
  const [rowsData, setRowsData] = useState([]);

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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiData = await response.json();
      setData(apiData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
        //console.log('API call successful');
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

  const handleDeleteFacilityCode = async (userId) => {
    // Show the browser's built-in confirm dialog
    const userConfirmed = window.confirm("Are you sure you want to delete this facility code?");

    if (userConfirmed) {
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
        //console.log("response---------------", response)
        if (response.ok) {
          //console.log('Facility code deleted successfully');
          fetchData(); // Update the data after deletion
        } else {
          console.error('Failed to delete facility code');
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
    }
  };

  const handleEdit = (_id) => {
    setEditableRows({ ...editableRows, [_id]: true });
    const originalData = data.find(item => item._id === _id);
    setEditedData({ ...editedData, [_id]: { ...originalData } });
  };

  const handleSave = async (_id) => {
    const updatedData = editedData[_id];
    try {
      const token = Cookies.get('session');
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(baseurl + '/admin/updatefacilitycode', {
        method: 'POST',
        body: JSON.stringify(updatedData),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenState,
        }
      });
      if (response.ok) {
        //console.log('Data updated successfully');
        const updatedEditableRows = { ...editableRows };
        delete updatedEditableRows[_id];
        setEditableRows(updatedEditableRows);
        fetchData();
      } else {
        console.error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancel = (_id) => {
    const updatedEditableRows = { ...editableRows };
    delete updatedEditableRows[_id];
    setEditableRows(updatedEditableRows);
    setEditedData({ ...editedData, [_id]: null });
  };

  const handleInputChange = (_id, field, value) => {
    const newData = { ...editedData[_id] };
    newData[field] = value;
    setEditedData({ ...editedData, [_id]: newData });
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

  return (
    <>
      <div className="facility-code-parent mt-3">
        <div className="container">
          <HeaderTwo />
          <div className="addtable pb-4">
            <div className="add-row-btn">
              <input
                className="search"
                type="text"
                placeholder="Search.... "
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              />
              <button className="dropbtn btn_facility_manager" onClick={addTableRows}> Add Facility</button>
            </div>

            <div className="admin-table">
              <table className="table tablepos">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
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
                  </tr>
                </thead>
                <tbody className="dataform">
                  {Array.isArray(sortedData) && sortedData.map((item, index) => (
                    <tr key={item._id}>
                      <td data-label="Facility Code">{index + 1}</td>
                      <td data-label="Facility Code">
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
                          <input
                            type="text"
                            value={editedData[item._id]?.state || item.state}
                            onChange={(e) => handleInputChange(item._id, 'state', e.target.value)}
                          />
                        ) : (
                          item.state
                        )}
                      </td>
                      <td data-label="Contact">
                        {editableRows[item._id] ? (
                          <input
                            type="text"
                            value={editedData[item._id]?.county || item.county}
                            onChange={(e) => handleInputChange(item._id, 'county', e.target.value)}
                          />
                        ) : (
                          item.state
                        )}
                      </td>
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
                            value={editedData[item._id]?.emailid || item.emailid}
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
                            value={editedData[item._id]?.emailid2 || item.emailid2}
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
                            value={editedData[item._id]?.emailid3 || item.emailid3}
                            onChange={(e) => handleInputChange(item._id, 'emailid3', e.target.value)}
                          />
                        ) : (
                          item.emailid3
                        )}
                      </td>
                      <td data-label="Contact">
                        {editableRows[item._id] ? (
                          <input
                            type="text"
                            value={editedData[item._id]?.facility_code || item.facility_code}
                            onChange={(e) => handleInputChange(item._id, 'facility_code', e.target.value)}
                          />
                        ) : (
                          item.facility_code
                        )}
                      </td>
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
                      {/ Render other columns similarly /}
                      <td data-label="Contact">
                        {editableRows[item._id] ? (
                          <>
                            <button onClick={() => handleSave(item._id)}>Save</button>
                            <button onClick={() => handleCancel(item._id)}>Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => handleEdit(item._id)}>Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropdownExample;