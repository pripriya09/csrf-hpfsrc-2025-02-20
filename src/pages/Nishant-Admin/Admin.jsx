import React, { useEffect, useState } from 'react';
import Pikaday from 'pikaday';
import './Admin.css'
import HeaderTwo from '../../layouts/Header2/HeaderTwo'

const Admin = () => {

  const pageSize = 15; // Number of rows per page
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      
      const response = await fetch('YOUR_GET_API_URL');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddRow = () => {
    const newId = data.length + 1;
    const newRow = {
      id: newId,
      facility: '',
      authorizer: '',
      authorizationCode: '',
      active: '',
      effectiveDate: '',
      link: '',
    };
    setData([...data, newRow]);
  };

  const handleEdit = (id, field, value) => {
    const editedData = data.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setData(editedData);
  };

  const handleSave = async (id) => {
    try {
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      await fetch('YOUR_SAVE_API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xsrf-token': csrfTokenState, 
        },
          credentials: 'include',
        body: JSON.stringify(data.find((row) => row.id === id)),
      });

      // After saving, fetch updated data
      fetchData();
      
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Replace 'YOUR_DELETE_API_URL' with the actual URL for your DELETE API
      await fetch(`YOUR_DELETE_API_URL/${id}`, {
        method: 'DELETE',
      });

      // After deleting, fetch updated data
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <>
    {/* <div className="admin-container">
  <HeaderTwo/>
  <div className="content">
    <div className="dash-top">
      <h2 className="dash-head">Admin Page</h2>
      <a href="#" className="auth-btn">
        <i className="fa-solid fa-plus" /> &nbsp; Add Authorizer
      </a>
    </div>
    <table className="responsive-table">
      <thead>
        <tr>
          <td>Correctional Facility</td>
          <td>Name of Authorizer</td>
          <td>Authorization Code</td>
          <td>Active</td>
          <td>Effective Date</td>
          <td>Link</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="Correctional Facility">ABC Correctional Facility</td>
          <td data-label="Name of Authorizer">Captain John Walker</td>
          <td data-label="Authorization Code">788435</td>
          <td data-label="Active">Yes</td>
          <td data-label="Effective Date">28-10-2023</td>
          <td data-label="Link">
            nocostinsurance.com/abccorrectionalfacility.com
          </td>
        </tr>
        <tr>
          <td data-label="Correctional Facility">ABC Correctional Facility</td>
          <td data-label="Name of Authorizer">Captain John Walker</td>
          <td data-label="Authorization Code">788435</td>
          <td data-label="Active">Yes</td>
          <td data-label="Effective Date">28-10-2023</td>
          <td data-label="Link">
            nocostinsurance.com/abccorrectionalfacility.com
          </td>
        </tr>
        <tr>
          <td data-label="Correctional Facility">ABC Correctional Facility</td>
          <td data-label="Name of Authorizer">Captain John Walker</td>
          <td data-label="Authorization Code">788435</td>
          <td data-label="Active">Yes</td>
          <td data-label="Effective Date">28-10-2023</td>
          <td data-label="Link">
            nocostinsurance.com/abccorrectionalfacility.com
          </td>
        </tr>
        <tr>
          <td data-label="Correctional Facility">ABC Correctional Facility</td>
          <td data-label="Name of Authorizer">Captain John Walker</td>
          <td data-label="Authorization Code">788435</td>
          <td data-label="Active">Yes</td>
          <td data-label="Effective Date">28-10-2023</td>
          <td data-label="Link">
            nocostinsurance.com/abccorrectionalfacility.com
          </td>
        </tr>
      </tbody>
    </table>
    <div className="pagination-right">
      <ul className="pagination">
        <li>
          <a href="#">←</a>
        </li>
        <li>
          <a href="#">→</a>
        </li>
      </ul>
    </div>
  </div>
</div> */}
{/************* new table ****************/}


{/* <div className="container">
        <div className="row">
          <div className="col-md-12">
            <br />
            <button className="btn btn-default pull-right add-row" onClick={addRow}><i className="fa fa-plus" />&nbsp;&nbsp; Add Row</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-bordered" id="editableTable">
              <thead>
                <tr>
                  <th>Correctional Facility</th>
                  <th>Name of Authorizer</th>
                  <th>Authorization Code</th>
                  <th>Active</th>
                  <th>Effective Date</th>
                  <th>Link</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr data-id={1}>
                  <td data-field="name">ABC Correctional Facility</td>
                  <td data-field="name">Dave Gamache</td>
                  <td data-field="age">26897</td>
                  <td data-field="sex">Yes</td>
                  <td data-field="birthday">May 19, 2015</td>
                  <td data-field="birthday">nocostinsurance.com/abccorrectionalfacility.com</td>
                  <td>
                    <a className="button button-small edit" title="Edit">
                      <i className="fa fa-pencil" />
                    </a>
                    <a className="button button-small edit" title="Delete">
                      <i className="fa fa-trash" />
                    </a>
                  </td>
                </tr>
                <tr data-id={2}>
                  <td data-field="name">ABC Correctional Facility</td>
                  <td data-field="name">Dave Gamache</td>
                  <td data-field="age">26897</td>
                  <td data-field="sex">Yes</td>
                  <td data-field="birthday">May 19, 2015</td>
                  <td data-field="birthday">nocostinsurance.com/abccorrectionalfacility.com</td>
                  <td>
                    <a className="button button-small edit" title="Edit">
                      <i className="fa fa-pencil" />
                    </a>
                    <a className="button button-small edit" title="Delete">
                      <i className="fa fa-trash" />
                    </a>
                  </td>
                </tr>
                <tr data-id={3}>
                  <td data-field="name">ABC Correctional Facility</td>
                  <td data-field="name">Dave Gamache</td>
                  <td data-field="age">26897</td>
                  <td data-field="sex">Yes</td>
                  <td data-field="birthday">May 19, 2015</td>
                  <td data-field="birthday">nocostinsurance.com/abccorrectionalfacility.com</td>
                  <td>
                    <a className="button button-small edit" title="Edit">
                      <i className="fa fa-pencil" />
                    </a>
                    <a className="button button-small edit" title="Delete">
                      <i className="fa fa-trash" />
                    </a>
                  </td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
<div>
      <button onClick={handleAddRow}>Add a Row</button>
      <table>
        <thead>
          <tr>
            <th>Correctional Facility</th>
            <th>Name of Authorizer</th>
            <th>Authorization Code</th>
            <th>Active</th>
            <th>Effective Date</th>
            <th>Link</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
        {currentData.map((row) => (
            <tr key={row.id} data-id={row.id}>
             <td>
                <input
                  type="text"
                  value={row.facility}
                  onChange={(e) => handleEdit(row.id, 'facility', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.authorizer}
                  onChange={(e) => handleEdit(row.id, 'authorizer', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.authorizationCode}
                  onChange={(e) => handleEdit(row.id, 'authorizationCode', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.active}
                  onChange={(e) => handleEdit(row.id, 'active', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={row.effectiveDate}
                  onChange={(e) => handleEdit(row.id, 'effectiveDate', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.link}
                  onChange={(e) => handleEdit(row.id, 'link', e.target.value)}
                />
              </td>
              <td>
                <button className="button button-small save" onClick={() => handleSave(row.id)}>
                  <i className="fa fa-save" />
                </button>
                <button className="button button-small delete" onClick={() => handleDelete(row.id)}>
                  <i className="fa fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {/* Pagination buttons... */}
        {Array.from({ length: Math.ceil(data.length / pageSize) }, (_, i) => i + 1).map((pageNumber) => (
          <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
      
    </>
  )
}

export default Admin
