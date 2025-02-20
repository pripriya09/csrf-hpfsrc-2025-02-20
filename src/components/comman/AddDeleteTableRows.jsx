import React, { useState, useEffect } from "react";
import TableRows from "./FacilityTableRows";
import Cookies from 'js-cookie';
const [csrfTokenState, setcsrfTokenState] = useState(null);
  useEffect(() => {
      const getCsrfToken = async () => {
        try {
          const response = await fetch(baseurl + '/csrf-token', {
            method: 'GET',
         
          });
          const data = await response.json();
          setcsrfTokenState(data.csrfToken); 
        } catch (error) {
          console.error("Error fetching CSRF token", error);
        }
      };
    
      getCsrfToken(); // Fetch CSRF token when the component mounts
    }, []);

function AddDeleteTableRows() {
  const [rowsData, setRowsData] = useState([]);
  const [newRowData, setNewRowData] = useState({
    name: "",
    emailid: "",
    facility_code: "",
    phonenumber: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const response = await fetch('http://192.168.0.13:8080/admin/addfacilitycode',{

      method: 'post', // or 'PATCH' depending on your server implementation
      headers: {
        'Content-Type': 'application/json',
        'xsrf-token': csrfTokenState,
      },
      credentials: 'include',
    });


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setRowsData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


  const addTableRows = () => {
    setRowsData([...rowsData, newRowData]);
    setNewRowData({
      name: "",
      emailid: "",
      facility_code: "",
      phonenumber: "",
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
      const response = await fetch(`http://192.168.0.13:8080/admin/addfacilitycode`, {
        method: 'post', // or 'PATCH' depending on your server implementation
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenState,
        },
        body: JSON.stringify(updatedRow),
        credentials: 'include',
      });
  
      if (response.ok) {
        // If successful, you might want to fetch the updated data
        fetchData();
      } else {
        console.error('Error updating data:', response.statusText);
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

  return (
    <>
      <button className="dropbtn btn btn-outline-success" onClick={addTableRows}>
        Create New
      </button>
      <table className="table tablepos">
        <tbody>
          <TableRows
            rowsData={rowsData}
            handleChange={handleChange}
            saveTableRows={saveTableRows}
          />
        </tbody>
      </table>
    </>
  );
}

export default AddDeleteTableRows;
