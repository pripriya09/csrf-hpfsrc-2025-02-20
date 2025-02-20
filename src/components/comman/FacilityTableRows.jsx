// FacilityTableRows.jsx

import React, { useState, useEffect, useRef } from 'react'
import { Tooltip } from 'react-tooltip'
import { baseurl } from '../../constant/enviroment/enviroment'
import Swal from 'sweetalert2';




function FacilityTableRows({ rowsData, handleChange, saveTableRows, deleteTableRow, isEditing, setIsEditing ,  setIsAnyRowEditable}) {


  // State abbriviation drop down
  const [counties, setCounties] = useState([]);
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(''); // Add this line
  const stateAbbreviationsList = [
    'NC','SC','TN','AL','FL','GA','MS','OH','TX','LA','OK','IN','AZ','UT',
    'WI','WY','NH','AK','HI','KY','AR','MO','IA','KS','NE','CA','IL','HA',
    'OR','WA','MT','CO','MA','ME','NY','NJ','PA','DE','RI','VT','CT','MD',
    'VA','WV','MN','SD','ND','NV','ID','NM','MI'
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);
  const [errorMessageState, setErrorMessageState] = useState('');
  const [selectedState, setSelectedState] = useState('');

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

  const handleStateChange = (event) => {
    const value = event.target.value.toUpperCase();
    setSearchTerm(value);

    if (!/^[A-Z]*$/.test(value) || value.length > 2) {
      // Check if the entered value contains only uppercase letters
      // and has a length less than or equal to 2
      setFilteredStates([]);
      setErrorMessageState('Invalid State Code! Please enter only uppercase letters with 2 characters.');
      setSearchTerm(newValue);
    } else {
      const filteredSuggestions = stateAbbreviationsList.filter(
        (state) => state.startsWith(value)
      );

      setFilteredStates(filteredSuggestions);
      setErrorMessageState('');
    }
  };
  const handleSelect = async (selectedState) => {
    setSearchTerm(selectedState);
    setFilteredStates([]);
    setSelectedState(selectedState);
    setIsStateSelected(true);
    await fetchCountiesByState(selectedState);

    // Update the state
    setSelectedState(selectedState);

  };

  const handleStateBlur = () => {
    // Reset the error message when the user clicks outside the input
    setErrorMessageState('');
  };

  //Fetch cunties trough API 
  const fetchCountiesByState = async (state) => {
    try {
      const validState = state.toUpperCase();

      if (stateAbbreviationsList.includes(validState)) {
        const response = await fetch(baseurl + `/admin/get-counties-by-state`, {
          method: 'POST',
            credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
           'xsrf-token': csrfTokenState,
          },
       
          body: JSON.stringify({ "state": validState }),
        });

        const data = await response.json();
        if (!response.ok) {
          setCounties(data.data);
          //console.error('Errordd:', response.status, response.statusText);
          Swal.fire({
            icon: '',
            title: '',
            text: 'No counties found for the specified state,\nPlease enter your County manually', // Use backticks for template literals
            position: 'top',
        });
          //setAlertMessage("No counties found for the specified state , Please enter your County manually ");
          setSelectedCounty('');

          return;
        }

        //console.log('API Response:', data);

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
  // const handleDeleteClick = (index) => {
  //   const isConfirmed = window.confirm("Are you sure you want to Cancle this row?");
  //   if (isConfirmed) {
  //     deleteTableRow(index);
  //     setIsEditing(false);
  //     setIsAnyRowEditable(false);
  //   }
  //   // If not confirmed, do nothing (cancel the delete)
  // };


 const handleDeleteClick = (index) => {
    Swal.fire({
      title: '',
      text: 'You are about to cancel this row. This action cannot be undone.',
      icon: '',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText : 'No',
      position:'top'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTableRow(index);
        setIsEditing(false);
        setIsAnyRowEditable(false);
      }
    });
  };



  const handleSaveClick = (index) => {
    // Check if any of the relevant input fields is empty
    const { name, state, county, verification_contact, emailid, emailid2, emailid3, facility_code, dedicated_facility_link } = rowsData[index];
    const isValidFacilityCode = /^\d{6}$/.test(facility_code);

    if (!name || !state || !county || !verification_contact || !emailid) {
      
      Swal.fire({
        icon: '',
        title: '',
        text: `Please fill in all fields before saving.`, // Use backticks for template literals
        position: 'top',
    }); 
      //setAlertMessage("Please fill in all fields before saving.");
       
   
        return;
    } else if (!isValidFacilityCode) {
      Swal.fire({
        icon: '',
        title: '',
        text: `Please check the facility code you entered.\nIt should have exactly 6 digits.`, // Use backticks for template literals
        position: 'top',
    }); 
      // setAlertMessage("Please check the facility code you entered. It should have exactly 6 digits.");
      // openModal();
        return;
       } 

    
       Swal.fire({
        title: '',
        text: 'Are you sure you want to add new facility data ?',
        icon: '',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
        position:'top'
      }).then((result) => {
        if (result.isConfirmed) {
      saveTableRows(index);
      deleteTableRow(index);
      setSearchTerm('');
      setCounties([]);
      setSelectedCounty('');
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
            {/* <input
              type="text"
              name="state"
              value={row.state}
              onChange={(e) => handleChange(index, e)}
            /> */}


            <input
              id="state"
              type="text"
              value={row.state = searchTerm}
              onChange={handleStateChange}
              maxLength="2"
              placeholder="Enter your state"
            />
            <ul className="state-dropdown">
              {filteredStates.map((state, index) => (
                <li key={index} onClick={() => handleSelect(state)}>
                  {state}
                </li>
              ))}
            </ul>
          </td>
          <td>
            {/* 
            <input
              type="text"
              name="county"
              value={row.county}
              onChange={(e) => handleChange(index, e)}
            /> */}

            {isStateSelected ? (
              counties.length > 0 ? (
                <select
                  id="counties"
                  value={row.county = selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
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
                    value={row.county = selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    placeholder="Enter your county"
                  />
                )
            ) : null}
          </td>
          <td>
            <input
              type="text"
              name="verification_contact"
              value={row.verification_contact}
              onChange={(e) => handleChange(index, e)}
            // onChange={(e) => {
            //   // Ensure only digits are entered
            //   const sanitizedValue = e.target.value.replace(/\D/g, '');

            //   // Limit the input to 10 digits
            //   const limitedValue = sanitizedValue.slice(0, 10);

            //   // Format the phone number (888) 888-8888 after 10 digits
            //   const formattedValue = limitedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

            //   // Update the state
            //   handleChange(index, { target: { name: 'verification_contact', value: formattedValue } });
            // }}
            // placeholder="(888) 888-8888"
            // pattern="\(\d{3}\) \d{3}-\d{4}"
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
              type="text"
              name="emailid2"
              value={row.emailid2}
              onChange={(e) => handleChange(index, e)}
            />
          </td>
          <td>
            <input
              type="text"
              name="emailid3"
              value={row.emailid3}
              onChange={(e) => handleChange(index, e)}
            />
          </td>
          <td>
            <input
              type="number"
              name="facility_code"
              value={row.facility_code}
              onChange={(e) => {
                // Ensure only digits are entered
                const sanitizedValue = e.target.value.replace(/\D/g, '');

                // Limit the input to 6 digits
                const limitedValue = sanitizedValue.slice(0, 6);

                // Update the state
                handleChange(index, { target: { name: 'facility_code', value: limitedValue } });
              }}
            />
          </td>
          <td>
            {/* <input
              type="text"
              name="dedicated_facility_link"
              value={row.dedicated_facility_link}
              onChange={(e) => handleChange(index, e)}
            /> */}
          </td>
          <td >
          </td>
          <div className="addrowbuttons">
            <td>
              <button
                className="btn_add"
                onClick={() => handleSaveClick(index)}
                data-tooltip-content="Add"
                data-tooltip-id="my-tooltip-add"
              > <i className="fa-solid fa-check"></i>
              </button>

              <Tooltip id="my-tooltip-add" />
            </td>
            <td>
              <button
                className="btn_cancel"
                onClick={() => handleDeleteClick(index)}
                data-tooltip-content="Cancel"
                data-tooltip-id="my-tooltip-cancel"
              >
                <i className="fa-solid fa-close"></i>
              </button>

              <Tooltip id="my-tooltip-cancel" />
            </td>
          </div>
        </tr>
      ))}
    </>
  );
}

export default FacilityTableRows;
