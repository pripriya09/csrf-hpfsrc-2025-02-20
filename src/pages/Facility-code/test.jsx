import React, { useState, useEffect } from "react";
import './Facility-code.css'
import HeaderTwo from '../../layouts/Header2/HeaderTwo'
import FacilityTableRows from "../../components/comman/FacilityTableRows";
import { baseurl } from '../../constant/enviroment/enviroment';
import Cookies from 'js-cookie';



const Facilitycode = () => {


  const [rowsData, setRowsData] = useState([]);
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
    facility_code: "",
    status: "",

  });



  //check box for the enable / disable

  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = async (_id, status) => {

    try {
      const token = Cookies.get('session');
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }

      // Make an API call to update the status based on the current checkbox state
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
          "checked": status === 'true' ? false : true, // Toggle the current status
        })
      });

      // Handle the API response as needed
      if (response.ok) {

        //console.log('API call successful');
        // Update the local state to reflect the new checkbox state
        setCheckedItems(prevState => ({
          ...prevState,
          [_id]: !prevState[_id], // Toggle the local state as well
        }));
      } else {
        console.error('API call failed');
      }
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };

  // end for check box enable disable 
  useEffect(() => {
    fetchData();
  }, []);

  const [rowsfacilityData, setRowsfacilityData] = useState();
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
      const data = await response.json();
      setRowsfacilityData(data.data)
      // console.log('data-----',data);

      if (data.data[0].status === 'false') {
        //console.log('false aa gaya hai');
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const addTableRows = () => {
    setRowsData([...rowsData, newRowData]);
    setNewRowData({
      name: "",
      state: "",
      county: "",
      verification_contact: "",
      emailid: "",
      facility_code: "",
      dedicated_facility_link: "",
      status: "",
    });
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
      const data = await response.json();
      if (data.success) {
        // If successful, you might want to fetch the updated data
              window.confirm(data.message);
        fetchData();
        
      } else {
        console.error('Error updating data 1:', data.message);
        alert(`${data.message}\nPlease check the correct facility code and add with a new facility code`);

      }
    } catch (error) {
      console.error('Error updating data:', data.message);
    }
  };

  // const deleteTableRow = async (index) => {
  //   const deletedRow = rowsData[index];

  //   try {
  //     const token = Cookies.get('session');
  //     const response = await fetch(baseurl + `/admin/deletefacilitycode/${deletedRow.facility_code}`, {
  //       method: 'delete',
  //       headers: {
  //         'Authorization': token,
  //       },
  //     });

  //     if (response.ok) {
  //       // If successful, you might want to fetch the updated data
  //       fetchData();
  //     } else {
  //       console.error('Error deleting data:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting data:', error);
  //   }
  // };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const updatedRows = [...rowsData];
    updatedRows[index][name] = value;
    setRowsData(updatedRows);
  };

  return (
    <>
      <div className="facility-code-parent mt-3">
        <div className="container">
          <HeaderTwo />
          <div className="addtable pb-4">
            <div className="add-row-btn">
              
              <button className="dropbtn btn_facility_manager" onClick={addTableRows}> Add Facility
      </button>
            </div>
            {/*    */}

            <div className="admin-table">
              <table className="table tablepos">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Facility Name</th>
                    <th>State</th>
                    <th>County</th>
                    <th>Verification Contact</th>
                    <th>Contact Email</th>
                    <th>Facility Code</th>
                    <th>Dedicated Facility Link</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  <FacilityTableRows
                    rowsData={rowsData}
                    handleChange={handleChange}
                    saveTableRows={saveTableRows}
                    deleteTableRow={deleteTableRow}
                  />
                </tbody>

                <tbody className="dataform">
                  {Array.isArray(rowsfacilityData) && rowsfacilityData.map((item, index) => (
                    <tr key={item._id}>
                      <td data-label="Facility Code">{index + 1}</td>
                      <td data-label="Facility Code">{item.name}</td>
                      <td data-label="Contact">{item.state}</td>
                      <td data-label="Contact">{item.county}</td>
                      <td data-label="Contact">{item.verification_contact}</td>
                      <td data-label="Contact">{item.emailid}</td>
                      <td data-label="Contact">{item.facility_code}</td>
                      <td data-label="Contact"> <a href={item.dedicated_facility_link} target="_blank" rel="noopener noreferrer">
    {item.dedicated_facility_link}
  </a></td>
                      <td data-label="Contact">
                        <input
                          type="checkbox"
                          defaultChecked={(checkedItems && item.status === 'true') || (!checkedItems && item.status === 'false')}
                          onClick={() => handleCheckboxChange(item._id, item.status)}
                        />
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
  )
}

export default Facilitycode
