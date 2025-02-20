import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import './ClientPortal.css'
import HeaderTwo from '../../layouts/Header2/HeaderTwo'
import { baseurl } from '../../constant/enviroment/enviroment'
import { format, addHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import Footer from '../../layouts/Footer/Footer'
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const SpecialClientPortal = () => {
  const [userData, setUserData] = useState([]);
  const [isDataVisible, setIsDataVisible] = useState(true); // Step 1: State for toggling visibility
  const [facilityName, setFacilityName] = useState('');
  const [facilityCode, setFacilityCode] = useState('');
  const [idUser, setIdUser] = useState('');
  const navigate = useNavigate();
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
  const fetchData = async () => {
    try {
      //if (!csrfTokenState) {
    //    console.error("CSRF token is missing.");
//        return;
   //   }
      const response = await fetch(baseurl + `/admin/get-all-facilityitems?page=${currentPage}`, {
        headers: {
          Authorization: Cookies.get('session'),
          //'xsrf-token': csrfTokenState, 
        },
        //credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      //console.log("data---->", data)
      if (data.success) {
        // console.log(data);

        if (Array.isArray(data.data)) {
          const modifiedUserData = data.data.map(user => {
            const modifiedDiseases = user.specialDiseases ? user.specialDiseases.map(disease => '<i className="fa-solid fa-code"></i>') : [];
            return {
              ...user,
              specialDiseases: modifiedDiseases,
            };
          });

          setUserData(modifiedUserData);
          setUserCount(data.maxMedicationCount);
          setUserData(data.data);

          const userEnrollData = data.data.reduce((acc, user) => {
            if (user && typeof user.enroll !== 'undefined') {
              acc[user._id] = user.enroll?.toLowerCase() === 'true' || user.enroll?.toLowerCase() === true;
            }
            return acc;
          }, {});

          setUserEnrollStatus(userEnrollData);
        } else {
          console.error('Data is not an array:', data.data);
          setUserData([]);
        }
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleCheckboxChange = (userId) => {
    const token = Cookies.get('session');
    const currentDate = new Date().toISOString().slice(0, 10);

    const requestBody = {
      "_id": [userId],
      "enroll": true,
      "enrollment_date": currentDate,
    };

    fetch(baseurl + '/admin/fetch-enroll-date', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        // console.log("API Response:", data);

        // Handle API response and update the table
        fetchData();
      })
      .catch(error => {
        console.error('Error updating checkbox:', error);
      });
  };


  // Automatic Date //
  const [currentDate, setCurrentDate] = useState('');
  const [currentTimeZone, setCurrentTimeZone] = useState('');
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const easternTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimeZone(easternTimeZone);
    const zonedDate = utcToZonedTime(today, easternTimeZone);
    const formattedDate = format(zonedDate, 'MM/dd/yyyy HH:mm:ss XXXX', {
      timeZone: easternTimeZone,
    });
    setCurrentDate(formatDate(formattedDate));
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  };
  //end automatic Date //

  const [userCount, setUserCount] = useState();
  const [pageItemCount, setPageItemCount] = useState();
  const [totalPageCount, setTotalPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = pageItemCount; // Adjust this value based on your actual items per page

  // Assuming user.enroll is initially 'false'
  const [userEnrollStatus, setUserEnrollStatus] = useState({});
  //console.log('totalPageCount- default',totalPageCount)

  useEffect(() => {
    // Example: Log the updated states to the console
    // console.log('userEnrollStatus updated:', userEnrollStatus);
    // console.log('userData updated:', userData);

    // Additional UI logic here based on the state changes
  }, [userEnrollStatus, userData])



  // console.log('selectedUserId---', selectedUserId);
  const handleSendMail = (userId) => {
    const token = Cookies.get('session');
    if (!csrfTokenState) {
      console.error("CSRF token is missing.");
      return;
    }
    // Make the POST request to the API endpoint
    fetch(baseurl + '/admin/send-pending-mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'xsrf-token': csrfTokenState,

      },
      credentials: 'include',
      body: JSON.stringify({
        _id: userId,
      }),

    })

      .then(response => {
        // console.log('response---', response);
        // Handle the response
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Handle success if needed
      })
      .catch(error => {
        // console.error('There was a problem with the fetch operation:', error);
      });
  };



  const [data, setData] = useState([]); // Initialize with an empty array

  // State for filter criteria
  const [filterCriteria, setFilterCriteria] = useState('');

  // State for sorting
  const [sortColumn, setSortColumn] = useState('status');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Fetch data from API
  const fetchData1 = async () => {
    try {
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      
      const response = await fetch(baseurl + `/admin/get-all-facilityitems?page=${currentPage}`, {
        method: 'POST',
        headers: {
          Authorization: Cookies.get('session'),
          'xsrf-token': csrfTokenState,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();
      //console.log("apiData---->", apiData)
      setFacilityCode(apiData.facility_code);
      setFacilityName(apiData.facility_name);
      setIdUser(apiData.facility_id);
     

      if (apiData.success && Array.isArray(apiData.data)) {

        setTotalPageCount(apiData.totalPages)
        setPageItemCount(apiData)
        setData(apiData.data);
        setFacilityCode(apiData.facility_code);
        setFacilityName(apiData.facility_name);
        setIdUser(apiData.facility_id);

        // setTotalDataCount(apiData.totalCount); // Assuming the API provides the total count
      } else {
        console.error('Invalid API response:', apiData);
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };
  //const totalPageCount = Math.ceil(totalDataCount / itemsPerPage);


  // Fetch data on component mount
  useEffect(() => {
    fetchData1();
  }, [currentPage]); // Empty dependency array ensures the effect runs once after the first render



  // Filtering logic
  const filteredData = data.filter((user) => {
    const match = Object.entries(user).some(([key, value]) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filterCriteria.toLowerCase());
      } else if (typeof value === 'number') {
        return value === parseFloat(filterCriteria);
      }
      return false;
    });

    return match;
  });

  // Sorting logic

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const statusOrder = { 'Pending': 2, 'Verified': 1, 'Declined': 0 };

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    // Custom sorting for the 'status' column
    if (sortColumn === 'status') {
      const aStatusOrder = statusOrder[aValue];
      const bStatusOrder = statusOrder[bValue];

      if (aStatusOrder < bStatusOrder) return sortOrder === 'asc' ? -1 : 1;
      if (aStatusOrder > bStatusOrder) return sortOrder === 'asc' ? 1 : -1;
    }

    // Default sorting behavior for other columns
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;

    return 0;
  });


  //  sorting in multiple coloum
  // Sorting logic
  //  const sortedData = [...filteredData].sort((a, b) => {
  //   const statusOrder = { 'Pending': 2, 'Verified': 1, 'Declined': 0 };

  //   const aValue = a['status'];
  //   const bValue = b['status'];

  //   // Sort by status column first
  //   const statusComparison = statusOrder[aValue] - statusOrder[bValue];
  //   if (statusComparison !== 0) {
  //     return sortOrder === 'asc' ? statusComparison : -statusComparison;
  //   }

  //   // If statuses are equal, then sort by Submission Date
  //   if (a['submission_date'] !== b['submission_date']) {
  //     return sortOrder === 'asc' ? a['submission_date'] - b['submission_date'] : b['submission_date'] - a['submission_date'];
  //   }

  //   // If Submission Dates are equal, then sort by Name
  //   return sortOrder === 'asc' ? a['fullname'].localeCompare(b['fullname']) : b['fullname'].localeCompare(a['fullname']);
  // });

  //end
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedData.length);
  const paginatedData = sortedData.slice(startIndex, endIndex);
  // Handle column click to change sorting
  // Calculate pagination

  // Handle column click to change sorting
  const handleColumnClick = (column) => {
    if (column === sortColumn) {
      // Toggle between 'asc' and 'desc' if clicking on the same column
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set a new column for sorting
      setSortColumn(column);
      setSortOrder('asc');
    };
  }
  //end filterization 

  //search functionality 
  const [selectedOption, setSelectedOption] = useState('fullname');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async () => {
    try {
      if (searchValue.trim() === '') {
        return;
      }

      const token = Cookies.get('session');
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(baseurl + `/admin/search-facility-items?page=${currentPage}&limit=${itemsPerPage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenState,
        },
        credentials: 'include',
        body: JSON.stringify({ [selectedOption]: searchValue }),
      });

      const data = await response.json();
    
      if (response.ok) {
        setSearchResults(data.data);
        setTotalResults(data.totalCount); // Set the totalResults from the server response
      } else {
        Swal.fire({
          icon: '',
          title: '',
          text: data.message, // Displaying data.message in the text value
          position:'top',
      });
      }
    } catch (error) {
      Swal.fire({
        icon: '',
        title: '',
        text: data.error, // Displaying data.message in the text value
        position:'top',
    });
    }
  };
  useEffect(() => {
    handleSearch();
  }, [currentPage]); // Re-run the search when the page changes

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const renderData = searchResults.length > 0 ? searchResults : sortedData;
  // console.log("renderData------>", renderData);


  const handlePrevClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };



  const handleNextClick = () => {
    const newPage = currentPage + 1;
    const indexOfLastItem = newPage * itemsPerPage;

    // Ensure the newPage is within the valid range
    const validNewPage = Math.min(newPage, totalPageCount);

    // Disable Next button if we have reached the last page
    const isNextButtonDisabled = validNewPage > totalPageCount;

    if (!isNextButtonDisabled) {
      setCurrentPage(validNewPage);
    }
  };
  //console.log("data for next", currentPage,  totalPageCount, renderData.length ,itemsPerPage);

  const isNextButtonDisabled = currentPage >= totalPageCount || renderData.length < itemsPerPage;
  const isPrevButtonDisabled = currentPage <= 1;


  // Calculate the total number of pages based on the itemsPerPage
  const totalPages = Math.ceil(renderData.length / itemsPerPage);
  // console.log("totalPages------>", totalPages);

  // Ensure that currentPage is within the valid range
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  // console.log("validCurrentPage------>", validCurrentPage);
  // console.log("setPageItemCount---->",totalPageCount);

  // Calculate the index range for the current page
  const indexOfFirstItem = (validCurrentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(validCurrentPage * itemsPerPage, renderData.length);
  // console.log("indexOfFirstItem------>", indexOfFirstItem);
  // console.log("indexOfLastItem------>", indexOfLastItem);

  // Extract the data for the current page
  const currentPageData = renderData.slice(indexOfFirstItem, indexOfLastItem);

  // console.log("currentPageData------>", currentPageData);
  // console.log("itemsPerPage------>", itemsPerPage);
  // console.log("currentPage------>", validCurrentPage);
  // console.log("searchResults------>", searchResults.length);
  //end search functionality


  const resetPage = () => {
    setCurrentPage(1);
  };

  // reffresh the data on page
  const handleNewSearch = () => {
    if (searchValue.trim() === '') {
      Swal.fire({
        icon: '',
        title: '',
        text: 'Search value is required.', // Displaying data.message in the text value
        position:'top',
    });
     // alert('Search value is required.');
    } else {

      resetPage(); // Reset the page to 1 before initiating a new search
      handleSearch(); // Perform the new search
    }

  };

  const handleClear = () => {
    setSearchResults([]); // Clear search results
    setCurrentPage(1); // Reset currentPage to 1
    setSearchValue('');
    setSelectedOption('fullname'); // Clear the search input value
    // You may also want to fetch the default data or update the data in another way
    // For example:
    // fetchData(); // Fetch default data
  };
  // end reffresh the data on page

  //Set and format phone Number
  const [phonenumber, setPhonenumber] = useState('');
  const handleInputPhoneChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = formatInputValue(inputValue); // Format based on selected option

    if (inputValue.length <= 10) {
      setSearchValue(formattedValue); // Set formatted value to the searchValue state
      setPhonenumber(formattedValue);
    }
  };

  const formatInputValue = (value) => {
    // Check the selected option and apply formatting accordingly
    if (selectedOption === 'phonenumber') {
      return formatPhoneNumber(value);
    }
    // Add more formatting options for other cases if needed

    // If none of the specific formatting conditions match, return the value as is
    return value;
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber;
  };




  //start change date format for Created At//
  const formatDatee = (dateString) => {
    if (!dateString || isNaN(Date.parse(dateString))) {
      return ''; // Return empty string if dateString is invalid or empty
    }
    const date = new Date(dateString);
    const formattedDate = `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;
    return formattedDate;
  };
  //end change date format for Created At//
  // console.log(sortedData);

  const [status, setStatus] = useState(); // Assuming `status` is the state variable you want to update

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      const token = Cookies.get('session');
      const response = await fetch(baseurl + '/admin/update-user-status', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          _id: userId,
          newStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchData1();
        // Update status in state for the specific user
        setStatus((prevStatus) => {
          // Assuming `prevStatus` contains the previous status state
          // If `status` is an object, you may need to spread its properties
          return newStatus; // or { ...prevStatus, status: newStatus }
        });
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleToggleData = () => {
    setIsDataVisible(!isDataVisible);
  };

  return (
    <>
      <div className="EAFT-container">
        <HeaderTwo />
        <div className="content">
          <h1 className="hdr_txt">Special Client Portal</h1>
          <div className="search-header">
            <div className="flt_name">
              <p>Facility Name:<span>{facilityName}</span></p>
              <p>Facility Code:<span>{facilityCode}</span></p>
              {/* <p>ID:<span>{idUser}</span></p> */}
            </div>

            <div className="search-txt-box">
              <label htmlFor="searchOption">Search For:</label>
              <select
                id="searchOption"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="fullname">Enrollee Name</option>
                <option value="submission_date">Submission Date</option>
                <option value="status">Authorization Status</option>
                <option value="verified_date">Verified Date</option>
                <option value="enrollment_date">Enrollment Date</option>
                {/* <option value="effective_date">Effective Date</option> */}
                <option value="carrier">Carrier</option>
                <option value="plan">Plan</option>
                <option value="policyNumber">Policy Number</option>
                {/* Add more options as needed */}
              </select>

              <input
                type="text"
                id="searchValue"
                value={searchValue}
                placeholder="Enter the value... "
                onChange={(e) => setSearchValue(e.target.value)}
              />

              <button onClick={handleNewSearch}>Search</button>
              <button onClick={handleClear}>Clear Search</button>
            </div>
          </div>

          <div>
          <label className="toggle_btn">
  <input type="checkbox" checked={isDataVisible} onChange={handleToggleData} />
  <span className="slider"></span>
</label>
</div>

          {/* Conditional rendering of the table */}
          {isDataVisible ? (
            <div className="EAFT-table">
              <table className="response-table">
                <thead>
                  <tr>
                    <td onClick={() => handleColumnClick('fullname')}>Enrollee Name</td>
                    <td onClick={() => handleColumnClick('submission_date')}>Submission Date</td>
                    <td>Verified</td>
                    <td>Declined</td>
                    <td onClick={() => handleColumnClick('status')}>Authorization Status</td>
                    <td onClick={() => handleColumnClick('verified_date')}>Verified Date</td>
                    <td onClick={() => handleColumnClick('enrollment_date')}>Enrollment Date</td>
                    <td className="blank_raw"></td>
                    <td className="blank_raw"></td>
                    <td onClick={() => handleColumnClick('effective_date')}>Effective Date</td>
                    <td onClick={() => handleColumnClick('carrier')}>Carrier</td>
                    <td onClick={() => handleColumnClick('plan')}>Plan</td>
                    <td onClick={() => handleColumnClick('policyNumber')}>Policy Number</td>
                  </tr>
                </thead>
                <tbody>
                  {(currentPageData.length > 0 ? currentPageData : (searchResults.length > 0 ? searchResults : sortedData)).map((user) => (
                    <tr key={user._id}>
                      <td data-label="Applicant Full Legal Name">{user.fullname}</td>
                      <td data-label="Submission Date">{user.submission_date}</td>
                      <td data-label="Verified">
                        <input
                          type="radio"
                          id={`verified-radio-${user._id}`}
                          checked={user.status === 'Verified'}
                          onChange={() => handleUserStatusChange(user._id, true)}
                          disabled={user.status === 'Verified'}
                          className="verification-radio verified-radio"
                        />
                        <label htmlFor={`verified-radio-${user._id}`} className="custom-radio"></label>
                      </td>
                      <td data-label="Declined">
                        <input
                          type="radio"
                          id={`declined-radio-${user._id}`}
                          checked={user.status === 'Declined'}
                          onChange={() => handleUserStatusChange(user._id, false)}
                          disabled={user.status === 'Verified'}
                          className="verification-radio declined-radio"
                        />
                        <label htmlFor={`declined-radio-${user._id}`} className="custom-radio"></label>
                      </td>
                      <td data-label="Authorization Status" style={{ fontWeight: user.status === 'Verified' ? 'bold' : 'normal', color: user.status === 'Verified' ? 'green' : (user.status === 'Declined' ? 'red' : 'inherit') }}>
                        <span style={{ color: user.status === 'Verified' ? 'green' : (user.status === 'Declined' ? 'red' : 'inherit') }}>
                          {user.status}
                        </span>
                      </td>
                      <td data-label="Verified Date">{user.verified_date}</td>
                      <td data-label="Enrollment Date">
                        {userEnrollStatus[user._id] ? currentDate : user.enrollment_date}
                      </td>
                      <td className="blank_raw" data-label="Verified Date"></td>
                      <td className="blank_raw" data-label="Verified Date"></td>
                      <td data-label="Effective Date">{user.effective_date}</td>
                      <td data-label="Carrier">{user.carrier}</td>
                      <td data-label="Plan">{user.plan}</td>
                      <td data-label="Policy Number">{user.policyNumber}</td>
                    </tr>
                  ))}
                  {currentPageData.length === 0 && searchResults.length === 0 && sortedData.length === 0 && (
                    <tr>
                      <td colSpan="14">No data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            //Show more data when toogle
            <div className="EAFT-table">
              <table className="response-table">
                <thead>
                  <tr>
                    <td>Effective Date</td>
                    <td>Carrier</td>
                  </tr>
                </thead>
                <tbody>
                  {(currentPageData.length > 0 ? currentPageData : (searchResults.length > 0 ? searchResults : sortedData)).map((user) => (
                    <tr key={user._id}>
                      <td data-label="Effective Date">{user.effective_date}</td>
                      <td data-label="Carrier">{user.carrier}</td>
                    </tr>
                  ))}
                  {currentPageData.length === 0 && searchResults.length === 0 && sortedData.length === 0 && (
                    <tr>
                      <td colSpan="2">No data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="pagination-right">
            {searchResults && searchResults.length > 0 ? (
              <div className="pagination">
                {totalResults > itemsPerPage && (
                  <div className="pagination">
                    {Array.from({ length: Math.ceil(totalResults / itemsPerPage) }, (_, index) => (
                      <button className="btn_prev btn-search" key={index} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <ul className="pagination">
                  <li>
                    <button className="btn_prev" onClick={handlePrevClick} disabled={isPrevButtonDisabled}>&larr; Prev</button>
                  </li>
                  <li>
                    <button className="btn_prev" onClick={handleNextClick} disabled={isNextButtonDisabled}>&rarr; Next</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className="footer-parent">
        <div className="footer section">
          <div className='footer-align'>
            <Link to="/">
              <img src="/images/hpf-logo.png" alt="" />
            </Link>
            <div className="privacy-terms-txt">
              <p>© Copyright 2024 - Proprietary and Confidential Property of <Link to="/" className='green-txt'>HealthPlan Freedom, Inc.</Link></p>
              <div><Link to="/privacypolicy">Privacy Policy</Link> | <Link to="/clienttermandconditions"> Terms of Use</Link></div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};


export default SpecialClientPortal
