import React, { useEffect, useState, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import './EAFTracker.css'
import HeaderTwo from '../../layouts/Header2/HeaderTwo'
import { baseurl } from '../../constant/enviroment/enviroment'
import { format, addHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '../../layouts/Footer/Footer'
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';


const HPFagentportal = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isAnyRowEditable, setIsAnyRowEditable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
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

  const specialDiseases = [
    "HIV",
    "Hypertension",
    "Arthritis",
    "Diabetes",
    "Cancer",
    "Asthma",
    "Congestive Heart Failure",
    "Coronary Artery Disease",
    "COPD"
  ];

  const carriers = [
    'Not Applicable',
    'BCBST',
    'Aetna',
    'CIGNA',
    'United Healthcare',
    'BCBS NC',
    'BCBS SC',
    'BCBS FL',
    'Health First',
    'Care Source',
    'Oscar',
    'Baylor Scott & White',
    'BCBS of AL',
    'Ambetter',
    'Anthem',
    'Alliant',
    'Ascension',
    'AvMed',
    'Medicare',
    'Christus',
    'Highmark',
    'Keiser',
    'Molina',
    'AmeriHealth Caritas',
    'Sentara',
    'Kaiser Permanente' // Add more options as needed
  ].sort();

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await fetch(baseurl + `/admin/getalluserfromagent?page=${currentPage}`, {
        headers: {
          Authorization: Cookies.get('session')
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        //console.log("USERS data", data);
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
    const currentDate = new Date();
    const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Calculate next month's date
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const formattedNextMonthDate = `${(nextMonthDate.getMonth() + 1).toString().padStart(2, '0')}/${nextMonthDate.getDate().toString().padStart(2, '0')}/${nextMonthDate.getFullYear()}`;

    const requestBody = {
      "_id": [userId],
      "enroll": true,
      "ahap": false,
      'noenrolled': false,
      "enrollment_date": formattedDate,
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
        ////console.log("API Response:", data);

        // Handle API response and update the table
        fetchData();
        fetchData1();
        handleSearch();
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
  const arrayToMap = Array.from({ length: userCount });
  // Assuming user.enroll is initially 'false'
  const [userEnrollStatus, setUserEnrollStatus] = useState({});
  //console.log('totalPageCount- default',totalPageCount)

  useEffect(() => {
    // Example: Log the updated states to the console
    // console.log('userEnrollStatus updated:', userEnrollStatus);
    // console.log('userData updated:', userData);

    // Additional UI logic here based on the state changes
  }, [userEnrollStatus, userData])
  //handal click for the pending status
  const [selectedUserId, setSelectedUserId] = useState();

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



  //end handle click for pending status 


  useEffect(() => {
    // Fetch user data from the API
    fetch(baseurl + `/admin/getalluserfromagent?page=${currentPage}`, {
      headers: {
        Authorization: Cookies.get('session')
      }
    })


      .then(response => response.json())
      .then(data => {
        if (data.message === 'Invalid token') {
          // Redirect to login page if the token is invalid
          navigate('/login');
          return;
        }

        if (data.success) {
          //console.log(data);
          // console.log("fetch");

          if (Array.isArray(data.data)) {
            const modifiedUserData = data.data.map(user => {
              // Check if user.specialDiseases is defined before mapping
              const modifiedDiseases = user.specialDiseases ? user.specialDiseases.map(disease => '<i className="fa-solid fa-code"></i>') : [];
              return {
                ...user,
                specialDiseases: modifiedDiseases,
              };
            });

            setUserData(modifiedUserData);
            setUserCount(data.maxMedicationCount);
            setTotalPageCount(data.totalPages);
            setPageItemCount(data.pageSize);
            // Set user data in the component state
            // console.log("setPageItemCounteee---->",data.totalPages);

            setUserData(data.data);
            // console.log("setPageItemCounteee---->",data.totalPages);
            // Ensure that user data has the expected structure
            const userEnrollData = data.data.reduce((acc, user) => {
              // Ensure 'enroll' property exists and is not undefined
              if (user && typeof user.enroll !== 'undefined') {
                acc[user._id] = user.enroll?.toLowerCase() === 'true' || user.enroll?.toLowerCase() === true;
              }
              return acc;
            }, {});

            setUserEnrollStatus(userEnrollData);
          } else {
            // console.error('Data is not an array:', data.data);
            setUserData([]);
          }
        } else {
          console.error('Failed to fetch user data');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [currentPage]);


  const [data, setData] = useState([]); // Initialize with an empty array
  const [loading, setLoading] = useState(false);
  const [agentName, setAgentName] = useState();


  // State for filter criteria
  const [filterCriteria, setFilterCriteria] = useState('');

  // State for sorting
  //const [sortColumn, setSortColumn] = useState(null);
  const [sortColumn, setSortColumn] = useState('status');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const fetchData1 = async () => {
    try {
      const response = await fetch(baseurl + `/admin/getalluserfromagent?page=${currentPage}`, {
        headers: {
          Authorization: Cookies.get('session')
        }
      });
      setLoading(true);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();
      //console.log("fetchData1", apiData);
      if (apiData.success && Array.isArray(apiData.data)) {
        setData(apiData.data);

        // Create a mapping of userId to ahap and noenrolled status
        const userStatus = apiData.data.reduce((acc, user) => {
          acc[user._id] = {
            enroll: user.enroll,
            ahap: user.ahap,
            noenrolled: user.noenrolled // Set `noenrolled` based on `ahap`
          };
          return acc;
        }, {});

        // Update the userEnrollStatus state with the fetched data
        setUserEnrollStatus(userStatus);
        //console.log("userStatus------------->", userStatus)
        if (apiData.data.length > 0) {
          setAgentName(apiData.data[0].assignedagentname);
          // console.log("setAgentName", apiData.data[0].assignedagentname);
        }
        setLoading(false);
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


  const [agents, setAgents] = useState([]);
  const [userAgents, setUserAgents] = useState({});
  const fetchAgentData = async () => {
    try {
      const token = Cookies.get('session');
      const response = await fetch(baseurl + '/admin/get-all-useradmin', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });

      const apiData = await response.json();
      //console.log("api data EAF---->", apiData);

      if (apiData.message === 'Invalid token') {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Filter the users with permission "Agent"
      const agents = apiData.data.filter(user => user.permission === 'Agent');
      setAgents(agents);

      //console.log("agents---->", agents)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAgentData();
  }, []);

  const handleAgentChange = (userId, assignedagentname) => {
    setUserAgents(prevState => ({
      ...prevState,
      [userId]: assignedagentname
    }));
  };

  useEffect(() => {
    fetchAgentData();
  }, []);


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

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;

    return 0;
  });
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
      // Ensure that both searchValue and assignedagentname are present
      if (searchValue.trim() === '') {
        return; // Optionally show a message to the user that input is required
      }

      const token = Cookies.get('session');

      // Construct the request body
      const body = {
        [selectedOption]: searchValue, // Dynamic field based on selectedOption
        assignedagentname: agentName // Assuming assignedAgentName is a state variable
      };
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(baseurl + `/admin/agentsearchdata?page=${currentPage}&limit=${itemsPerPage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenState,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();
      //console.log("Response from agentsearchdata:", data);

      if (response.ok) {
        // Only update search results if there is relevant data
        if (data.data.length > 0) {
          setSearchResults(data.data);
          setTotalResults(data.totalCount); // Set the totalResults from the server response
        } else {
          // Optionally show a message if no results were found
          setSearchResults([]); // Clear results if none are found
          Swal.fire({
            icon: 'info',
            title: 'No Results',
            text: 'No items match your search criteria.',
            position: 'top',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Search Error',
          text: data.message || 'An error occurred while searching.',
          position: 'top',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An unexpected error occurred.',
        position: 'top',
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage]); // Re-run the search when the page changes

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderData = (searchResults.length > 0 ? searchResults : sortedData)
    .filter((item) => {
      const effectiveDate = item.effective_date ? new Date(item.effective_date) : null;
      return (
        effectiveDate === null || // Include items where effective_date is null
        (effectiveDate.getFullYear() === parseInt(selectedYear, 10)) // Include items matching the selected year
      );

    })


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
        position: 'top',
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

  // Update the selectedOption state when the dropdown changes
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  //start ssn
  const [ssn, setSsn] = useState('');

  const handleInputSsnChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = formatSsn(inputValue); // Format SSN

    if (inputValue.length <= 9) {
      setSsn(formattedValue);
    }
  };

  const formatSsn = (ssn) => {
    const cleaned = ssn.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }

    return ssn;
  };

  //end ssn
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

  // data updating functionality
  const [editableRows, setEditableRows] = useState({});
  const [editedData, setEditedData] = useState({});

  const handleInputChange = (_id, field, value) => {
    const newData = { ...editedData[_id] };
    newData[field] = value;
    setEditedData({ ...editedData, [_id]: newData });

  };
  const handleInputChangeForNe = (_id, field, value) => {
    // Ensure defaulting to "Not Applicable" if value is empty or null
    const defaultValue = value || "Not Applicable";
    setEditedData((prevData) => ({
      ...prevData,
      [_id]: {
        ...prevData[_id],
        [field]: defaultValue,
      },
    }));
  };
  const handleEdit = (_id) => {
    setEditableRows({ ...editableRows, [_id]: true });
    const originalData = data.find(item => item._id === _id);
    setEditedData({ ...editedData, [_id]: { ...originalData } });
    setIsAnyRowEditable(true);

  };

  const handleSave = async (_id) => {
    const updatedData = { ...editedData[_id] }; // Update the state value
    const userStatus = userEnrollStatus[_id]; // Get the user status for the current row
  //console.log("updatedData ------- userStatus-------->",updatedData, userStatus)
    // Check if the conditions are met
    if ((updatedData.nereason === "Not Applicable" || updatedData.nereason === "" || updatedData.nereason === null) && userStatus?.noenrolled === "true") {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select a valid NE reason before saving.',
        position: 'top',
      });
      return; // Stop further execution if validation fails
    }
  
    try {
      const token = Cookies.get('session');
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      const response = await fetch(baseurl + '/admin/update-user-details', {
        method: 'POST',
        body: JSON.stringify(updatedData),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenState,
        },
      });
  
      const data = await response.json();
      //console.log('API Response:', data);
  
      if (response.ok) {
        // Data updated successfully
        const updatedEditableRows = { ...editableRows };
        delete updatedEditableRows[_id];
        setEditableRows(updatedEditableRows);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
          position: 'top',
        });
        setIsAnyRowEditable(false);
        fetchData1();
      } else {
        // Handle API error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message,
          position: 'top',
        });
        handleCancel(_id);
      }
    } catch (error) {
      // Handle fetch error
      console.error('Error updating data:', error);
      handleCancel(_id);
    }
  };

  
  const handleCancel = (_id) => {
    const updatedEditableRows = { ...editableRows };
    delete updatedEditableRows[_id];
    setEditableRows(updatedEditableRows);
    setEditedData({ ...editedData, [_id]: null });
    setIsAnyRowEditable(false);
  };
  // data updating functionality end
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 12000);
  }, []);

  // Function to calculate the effective date for next month
  const calculateNextMonthDate = () => {
    const currentDate = new Date();
    // Set the date to 1 to get the first date of the next month
    currentDate.setDate(1);
    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    // Convert to US time zone
    const usDate = currentDate.toLocaleString('en-US', {
      timeZone: 'America/New_York', // Set to US Eastern Timezone
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    // Return the formatted date
    return usDate;
  };

  const handleDateChange = (userId, field, date) => {
    // Convert the selected date to the desired format
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;

    // Update the editedData with the new value
    const updatedData = { ...editedData };
    if (!updatedData[userId]) {
      updatedData[userId] = {};
    }
    updatedData[userId][field] = formattedDate;
    setEditedData(updatedData);
  };

  const formatday = (dateString) => {
    if (!dateString) return ''; // Return an empty string if dateString is null or undefined
    const parts = dateString.split('-'); // Split the date string
    // Rearrange parts to match "YYYY-MM-DD"
    const formattedDate = `${parts[2]}/${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
    return formattedDate;
  };


  const handleCheckboxChangeAHAP = (userId, statusType) => {
    const token = Cookies.get('session');

    setUserEnrollStatus((prevStatus) => {
      // Get the current status of the user
      const currentUserStatus = prevStatus[userId] || { ahap: "false", noenrolled: "true" };

      // Determine the new statuses based on the clicked checkbox
      let newAhapStatus = currentUserStatus.ahap;
      let newNoenrolledStatus = currentUserStatus.noenrolled;

      if (statusType === 'ahap') {
        newAhapStatus = currentUserStatus.ahap === "true" ? "false" : "true";
        newNoenrolledStatus = newAhapStatus === "true" ? "false" : newNoenrolledStatus;
      } else if (statusType === 'noenrolled') {
        newNoenrolledStatus = currentUserStatus.noenrolled === "true" ? "false" : "true";
        newAhapStatus = newNoenrolledStatus === "true" ? "false" : newAhapStatus;
      }

      // Set `enroll` to `false` if either `ahap` or `noenrolled` is `true`
      const newEnrollStatus = newAhapStatus === "true" || newNoenrolledStatus === "true" ? "false" : "true";

      // Prepare the request body with string values
      const requestBody = {
        "_id": [userId],
        "ahap": newAhapStatus,
        "noenrolled": newNoenrolledStatus,
        "enroll": newEnrollStatus
      };

      // Send the update request
      fetch(baseurl + '/admin/update-ahap', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(requestBody),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Handle API response and update the table
            fetchData();
            fetchData1();
            handleSearch();

          } else {
            console.error('API Error:', data.message);
          }
        })
        .catch(error => {
          console.error('Error updating checkbox:', error);
        });

      // Return the new state to update the local state for UI consistency
      return {
        ...prevStatus,
        [userId]: {
          ...prevStatus[userId],
          ahap: newAhapStatus,
          noenrolled: newNoenrolledStatus,
          enroll: newEnrollStatus
        },
      };
    });
  };
  const handleEffectiveDateChange = (userId, field, date) => {
    // Get the UTC date components
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    // Convert to ISO string in UTC
    const utcDateString = utcDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd

    // Update the editedData state with the formatted UTC date
    setEditedData(prevState => ({
      ...prevState,
      [userId]: {
        ...prevState[userId],
        [field]: utcDateString,
      },
    }));
  };



  return (
    <>
      <div className="EAFT-container">

        <HeaderTwo />
        <div className="content">
          <h1>HPF Agent Portal</h1>
          <div className="search-header">
            <div className="dash-top">
              {/* <div className="search">
              <input
                type="text"
                placeholder="Filter... "
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              />

            </div>  */}
              <div>


                <h1>Agent Name: <span> {agentName}</span></h1>

              </div>
            </div>
            <div className="search-txt-box">
              <label htmlFor="searchOptionEffective">Plan Year:</label>
              <select
                id="searchOptionEffective"
                value={selectedYear || ''} // Default to an empty string if no year is selected
                onChange={(e) => {
                  const year = e.target.value;
                  setSelectedYear(year); // Update the selected year state
                  resetPage(); // Reset the page for new selection
                }}
              >
                {Array.from({ length: 2 }, (_, index) => new Date().getFullYear() - 1 + index).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>


            </div>
            <div className="search-txt-box">
              <label htmlFor="searchOption" >Search For:</label>

              <select
                id="searchOption"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="fullname">Full Name</option>
                <option value="emailid">Email</option>
                <option value="phonenumber">Phone Number</option>
                <option value="dob">DOB</option>
                {/* <option value="maritalstatus">Marital Status</option>
                <option value="gender">Gender</option> */}
                <option value="city">City</option>
                <option value="state">State</option>
                {/* <option value="income">Income</option>
                <option value="notes">Notes</option> */}
                {/* <option value="e_sign">E_sign</option> */}
                <option value="ssn">SSN</option>
                <option value="zipcode">Zip Code </option>
                <option value="facilty_code">Facilty Code</option>
                <option value="submission_type">Submission Type</option>

                {/* Add more options as needed */}
              </select>

              <input
                type="text"
                id="searchValue"
                value={selectedOption === 'phonenumber' ? phonenumber : (selectedOption === 'ssn' ? ssn : searchValue)}
                placeholder="Enter the value... "
                onChange={(e) => {
                  if (selectedOption === 'phonenumber') {
                    handleInputPhoneChange(e);
                  } else if (selectedOption === 'ssn') {
                    handleInputSsnChange(e);
                  } else {
                    setSearchValue(e.target.value);
                  }
                }}
              />

              <div className='input-flex'>
                <button onClick={handleNewSearch}>Search</button>
                <button onClick={handleClear}>Clear Search</button>
              </div>
            </div>
          </div>
          <div className="EAFT-table">
            <table className="response-table">
              <thead className="fntagenttr1">
                <tr className="fntagenttr">

                  <td >PDF</td>
                  {/*  <td >AOR</td> */}
                  <td onClick={() => handleColumnClick('serialNumber')}>Client ID</td>
                  {/* <td onClick={() => handleColumnClick('assignedagentname')}> Agent Assigned</td> */}
                  <td onClick={() => handleColumnClick('facilty_code')}>Facilty Code</td>
                  <td onClick={() => handleColumnClick('fullname')} >Enrollee Name</td>
                  <td onClick={() => handleColumnClick('submission_date')}>Submission Date</td>
                  <td onClick={() => handleColumnClick('submission_type')}>Submission Type</td>
                  <td onClick={() => handleColumnClick('verified_date')}>Verified Date</td>


                  <td onClick={() => handleColumnClick('assigned_date')}>Assignment Date</td>
                  <td onClick={() => handleColumnClick('status')}>Authorization Status</td>
                  {/* <td> Enroll status </td> */}
                  <td> Enrolled</td>
                  <td onClick={() => handleColumnClick('enrollment_date')}>Enrollment Date </td>

                  <td className="effective_date">Effective Date</td>
                  <td> AHAP</td>

                  {/* <td className="effective date"> Effective Date </td> */}
                  <td > Not Enrolled </td>
                  <td > NE Reason </td>
                  <td > Carrier </td>
                  <td > Plan </td>
                  
                  <td > Policy Number </td>

                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>
                  <td onClick={() => handleColumnClick('emailid')}>Email Address</td>
                  <td onClick={() => handleColumnClick('phonenumber')}>Phone Number</td>
                  <td onClick={() => handleColumnClick('dob')}>Date of Birth</td>
                  <td onClick={() => handleColumnClick('ssn')}>SSN</td>
                  <td>Street Address</td>
                  <td onClick={() => handleColumnClick('city')}>City</td>
                  <td onClick={() => handleColumnClick('state')}>State</td>
                  <td onClick={() => handleColumnClick('zipcode')}>Zip Code</td>
                  <td onClick={() => handleColumnClick('county')}>County</td>
                  <td onClick={() => handleColumnClick('gender')}>Gender</td>
                  <td onClick={() => handleColumnClick('maritalstatus')}>Marital Status</td>
                  <td onClick={() => handleColumnClick('income')}>Projected Income</td>



                  {/* <td > Update</td> */}

                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>
                  {/* Client were asking to hide it in EAF  - 2024-01-29*/}
                  {/* <td>HIV</td>
                  <td>Hypertension</td>
                  <td>Arthritis </td>
                  <td>Diabetes</td>
                  <td>Cancer</td>
                  <td>Asthma</td>
                  <td>Congestive Heart Failure</td>
                  <td>Coronary Artery Disease</td>
                  <td>COPD</td> */}
                  <td className="notes-td-head">Notes</td>
                  {/* <td className="notes-td-head">e_sign</td> */}
                  {/* <td className="notes-td-head">Spouse Details</td> */}
                  {/* Client were asking to hide it in EAF  - 2024-01-31*/}
                  {/* <td>Former AOR</td>
                  <td>Electronic Signature</td>
                  <td>Signature Date</td>
                  <td>IP Address</td> */}

                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>

                  {/* Client were asking to hide it in EAF  - 2024-01-29*/}
                  {/* {arrayToMap.map((_, index) => (
                    <React.Fragment key={index}>
                      <td>Medication Name #{index + 1}</td>
                      <td>Dosage #{index + 1}</td>
                    </React.Fragment>
                  ))} */}
                  {/* {arrayToMap.map((_, index) => (
                    <React.Fragment key={index}>
                      <td>Spouse Name #{index + 1}</td>
                      <td>Spouse Number #{index + 1}</td>
                    </React.Fragment>
                  ))}   */}



                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="25" style={{ textAlign: 'center' }}>
                      <div className="loader-container">
                        <div className="spinner"></div>
                      </div>
                    </td>
                  </tr>
                )}
                {(currentPageData.length > 0 ? currentPageData : (searchResults.length > 0 ? searchResults : sortedData)).map((user, index) => (
                  <tr className="fntagenttr" key={user._id}>
                    
                    

                   

                    <td>
  {(
    (userEnrollStatus[user._id] === true ||
      user.enroll?.toLowerCase() === "true" ||
      user.enroll === "TRUE") ||
    (userEnrollStatus[user._id]?.ahap?.toLowerCase() === "true" ||
    user.ahap?.toLowerCase() === "true") || 
      (user.noenrolled?.toLowerCase() === "true" ||
      user.noenrolled === "TRUE")
  ) ? (
    <button
      className="btndownloaddis"
    >
      Show details
    </button>
  ) : (
    <Link target="_blank" to={`/user-details/${user._id}`}>
      <button className="btndownload">
        Show details
      </button>
    </Link>
  )}
</td>


                    
{/*                     
                    <td>
                      <Link target="_blank" to={`/user-details/${user._id}`}>
                        <button className="btndownload">Show details</button>
                      </Link>
                    </td> */}
                    {/* <td>
                      <Link target="_blank" to={`/user-AOR/${user._id}`}>
                        <button className="btndownload">Show details</button>
                      </Link>
                    </td> */}
                    {/* <td data-label="S.No.">{(currentPage - 1) * itemsPerPage + index + 1}</td> */}
                    <td data-label="Client ID">{user.serialNumber}</td>
                    {/* <td data-label="Agent">{user.assignedagentname}</td> */}

                    <td data-label="Correctional Facility">{user.facilty_code}</td>

                    <td data-label="Contact" className="name-column">
                      <span
                        className={`btn-name-edit ${editableRows[user._id] ? 'editable' : ''}`}
                        onClick={() => !editableRows[user._id] && !isAnyRowEditable && handleEdit(user._id)}
                        style={{ cursor: editableRows[user._id] || isAnyRowEditable ? 'default' : 'pointer' }}
                      >
                        {user.fullname}
                      </span>
                    </td>

                    <td data-label="Submission Date">{user.submission_date ? formatDate(user.submission_date) : ""}</td>
                    <td data-label="Submission Type">{user.submission_type}</td>
                    <td data-label="Verified Date">{user.verified_date ? formatDate(user.verified_date) : ""}</td>

                    {/* <td data-label="Agent">
                      {editableRows[user._id] ? (
                        <select
                          value={editedData[user._id]?.assignedagentname || user.assignedagentname}
                          onChange={(e) => handleInputChange(user._id, 'assignedagentname', e.target.value)}
                        >
                          <option value="">Select Agent</option>
                          {agents.map(agent => (
                            <option key={agent._id} value={agent.name}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        user.assignedagentname
                      )}
                    </td> */}



                    {/* <td data-label="assigned_date">
                      {editableRows[user._id] ? (
                        <DatePicker
                          selected={editedData[user._id]?.assigned_date !== null ? new Date(editedData[user._id]?.assigned_date) : new Date(calculateNextMonthDate())}
                          onChange={(date) => handleDateChange(user._id, 'assigned_date', date)}
                          dateFormat="MM/dd/yyyy"
                        //disabled={editedData[user._id]?.effective_date === null}
                        />
                      ) : (
                          user.assigned_date
                        )}
                    </td> 
                  */}
                    <td data-label="assigned_date">{user.assigned_date ? formatDate(user.assigned_date) : ""}</td>


                    {/* <td data-label="assigned_date">{user.assigned_date}</td> */}

                    <td data-label="Authorization Status" style={{ fontWeight: user.status === 'Verified' ? 'bold' : 'normal', color: user.status === 'Verified' ? 'green' : (user.status === 'Declined' ? 'red' : 'inherit') }}>
                      {user.status === 'Pending' ? (
                        <span style={{ color: 'blue' }}>
                          Pending
                        </span>
                      ) : (
                          user.status
                        )}
                    </td>
                    {/* <td data-label="Authorization Status" style={{ fontWeight: user.status === 'Verified' ? 'bold' : 'normal', color: user.status === 'Verified' ? 'green' : (user.status === 'Declined' ? 'red' : 'inherit') }}>
                          {user.status === 'Pending' ? (
                            <a style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer', }}
                              onClick={(e) => alert('A new verification email has been sent to the facility manager.') || handleSendMail(user._id)}
                            >
                              Pending
                            </a>
                          ) : (
                              user.status
                            )}
                        </td> */}

                    {/* <td data-label="Verified Date">{user.AutherizedAt}</td> */}


                    {/* <td data-label="Authrizationd status"></td> */}


                    <td data-label="Enroll">
                      <input
                        type="checkbox"
                        checked={userEnrollStatus[user._id]?.enroll?.toLowerCase() === true || user.enroll?.toLowerCase() === 'true' }
                        onChange={() => handleCheckboxChange(user._id, 'enroll')}
                        disabled={!editableRows[user._id] || user.status === 'Pending' || user.status === 'Declined'}
                      />
                    </td>



                    {/* <td data-label="Enroll">
                      <input
                        type="checkbox"
                        checked={userEnrollStatus[user._id] ? userEnrollStatus[user._id] : false}
                        onChange={(e) => {
                          if (user.status === 'Pending' || user.status === 'Declined' || userEnrollStatus[user._id]) {
                            e.preventDefault();
                          } else {
                            handleCheckboxChange(user._id);
                          }
                        }}
                        disabled={user.status === 'Pending' || user.status === 'Declined'}
                      />
                    </td> */}

                    <td data-label="Enroll">
                      {userEnrollStatus[user._id] && user.enrollment_date ? formatDate(user.enrollment_date) : ''}
                    </td>

                    <td data-label="effective_date" className="planname">
  {(userEnrollStatus[user._id].enroll?.toLowerCase() === "true" || user.enroll?.toLowerCase() === "true") ? (
    editableRows[user._id] ? (
      <DatePicker
        selected={
          editedData[user._id]?.effective_date
            ? new Date(editedData[user._id]?.effective_date)
            : user.effective_date
              ? new Date(user.effective_date)
              : new Date()
        }
        onChange={(date) => handleEffectiveDateChange(user._id, 'effective_date', date)}
        dateFormat="MM/dd/yyyy"
      />
    ) : (
      user.effective_date ? formatDate(user.effective_date) : ""
    )
  ) : (
    "" // Show nothing if "enroll" is not "true"
  )}
</td>



                    <td data-label="AHAP Check">
                      <input
                        type="checkbox"
                        checked={userEnrollStatus[user._id]?.ahap?.toLowerCase() === 'true' || user.ahap?.toLowerCase() === 'true'}
                        onChange={() => handleCheckboxChangeAHAP(user._id, 'ahap')}
                        disabled={!editableRows[user._id]}

                      />
                    </td>
                    <td data-label="Notenroll">
                      <input
                        type="checkbox"
                        checked={userEnrollStatus[user._id]?.noenrolled?.toLowerCase() === 'true' || user.noenrolled?.toLowerCase() === 'true'}
                        onChange={() => handleCheckboxChangeAHAP(user._id, 'noenrolled')}
                        disabled={
                          userEnrollStatus[user._id]?.noenrolled?.toLowerCase() === 'true' ||
                          user.noenrolled?.toLowerCase() === 'true' ||
                          !editableRows[user._id]
                        } // Disables the checkbox if it's already checked or not editable
                      />
                    </td>

                    <td data-label="NE Reason">
  {editableRows[user._id] ? (
    <select
      value={editedData[user._id]?.nereason ?? user.nereason ?? ""}
      onChange={(e) => handleInputChangeForNe(user._id, 'nereason', e.target.value)}
      onFocus={() => {
        if (!user.nereason || !user.enroll?.toLowerCase() === 'true') {
          // Automatically set "Medicare" as the default value if no `nereason` is set
          handleInputChangeForNe(user._id, 'nereason', e.target.value);
        }
      }}
      disabled={
        userEnrollStatus[user._id]?.enroll?.toLowerCase() === 'true' ||
        user.enroll?.toLowerCase() === 'true' ||
        userEnrollStatus[user._id]?.ahap?.toLowerCase() === 'true' ||
        user.ahap?.toLowerCase() === 'true'
      }
    >
      <option value=""> </option>
      <option value="Medicare">Medicare</option>
      <option value="VA">VA</option>
      <option value="Income too high">Income too high</option>
      <option value="Income too low">Income too low</option>
      <option value="No Income">No Income</option>
      <option value="No Social Security">No Social Security</option>
      <option value="Under 18">Under 18</option>
      <option value="DOB Missing">DOB Missing</option>
      <option value="SSN Missing">SSN Missing</option>
      <option value="Address Missing">Address Missing</option>
      <option value="Phone # Missing">Phone # Missing</option>
      <option value="Marital Status Missing">Marital Status Missing</option>
      <option value="Unable to Verify">Unable to Verify</option>
      <option value="Illegible Information">Illegible Information</option>
      <option value="Multiple Data Issues">Multiple Data Issues</option>
      <option value="No Signature">No Signature</option>
      <option value="Citzenship Issue">Citzenship Issue</option>
      <option value="Convicted/Sentenced">Convicted/Sentenced</option>
      <option value="Declined">Declined</option>
      <option value="DNE Per Facility">DNE Per Facility</option>
      <option value="Income Issue">Income Issue</option>
      <option value="Incomplete Name">Incomplete Name</option>
      <option value="Plan Cancelled">Plan Cancelled</option>
    </select>
  ) : (
    user.nereason || "" // Do not show anything if there is no value
  )}
</td>



                    <td data-label="Carrier">
                      {editableRows[user._id] ? (
                        <select
                          value={editedData[user._id]?.carrier || user.carrier}
                          onChange={(e) => handleInputChange(user._id, 'carrier', e.target.value)}
                          disabled={userEnrollStatus[user._id]?.noenrolled?.toLowerCase() === 'true' || user.noenrolled?.toLowerCase() === 'true'} // Disable if noenrolled is 'true'
                        >
                          {carriers.map((carrier) => (
                            <option key={carrier} value={carrier}>
                              {carrier}
                            </option>
                          ))}
                        </select>
                      ) : (
                          user.carrier
                        )}
                    </td>

                    <td data-label="Plan" className="planname">
                      {editableRows[user._id] ? (
                        <input
                          type="text"
                          value={editedData[user._id]?.plan || user.plan}
                          onChange={(e) => handleInputChange(user._id, 'plan', e.target.value)}
                          disabled={userEnrollStatus[user._id]?.noenrolled?.toLowerCase() === 'true' || user.noenrolled?.toLowerCase() === 'true'} // Disable if noenrolled is 'true'
                        />
                      ) : (
                          user.plan
                        )}
                    </td>



                    <td data-label="Policy Number">
                      {editableRows[user._id] ? (
                        <input
                          type="text"
                          value={editedData[user._id]?.policyNumber || user.policyNumber}
                          onChange={(e) => handleInputChange(user._id, 'policyNumber', e.target.value)}
                          disabled={userEnrollStatus[user._id]?.noenrolled?.toLowerCase()=== 'true' || user.noenrolled?.toLowerCase() === 'true'} // Disable if noenrolled is 'true'
                        />
                      ) : (
                          user.policyNumber
                        )}
                    </td>  


                    {editableRows[user._id] ? (
                      <td data-label="Contact" className="edit-name-btn edit-name-btn1">
                        <button className="btn_add" onClick={() => handleSave(user._id)}>
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button className="btn_cancel" onClick={() => handleCancel(user._id)}>
                          <i className="fa-solid fa-close"></i>
                        </button>
                      </td>
                    ) : (
                        <td data-label="Contact" className="edit-name-btn not-display"></td> // Empty td to keep structure
                      )}
                    <td className="blank_raw" data-label="Verified Date"> </td>
                    <td className="blank_raw" data-label="Verified Date"> </td>
                    <td data-label="Email Address">{user.emailid}</td>
                    <td data-label="Phone Number">{user.phonenumber}</td>
                    <td data-label="Date of Birth">{user.dob}</td>
                    <td data-label="SSN">
  {user.submission_type === "Online" &&
  ((userEnrollStatus[user._id] === true ||
  user.enroll?.toLowerCase() === "true" ||
    user.enroll === "TRUE") ||
    (userEnrollStatus[user._id]?.ahap?.toLowerCase() === "true" ||
      user.ahap === "true")) ||
  (user.noenrolled?.toLowerCase() === "true" || user.noenrolled === "TRUE") ? (
    user.ssn && typeof user.ssn === "string" ? (
      "******" + user.ssn.slice(-4)
    ) : (
      ""
    )
  ) : (
    user.ssn || ""
  )}
</td>

                    <td data-label="Street Address">{user.address}</td>
                    <td data-label="City">{user.city}</td>
                    <td data-label="State">{user.state}</td>
                    <td data-label="Zip Code">{user.zipcode}</td>
                    <td data-label="County">{user.county}</td>
                    <td data-label="Gender">{user.gender}</td>
                    <td data-label="Marital Status">{user.maritalstatus}</td>
                    <td data-label="Projected Income">${user.income}</td>

                    <td className="blank_raw" data-label="Verified Date"> </td>
                    <td className="blank_raw" data-label="Verified Date"> </td>
                    {/* {specialDiseases.map((disease) => (
                        <td key={disease} data-label={disease}>
                        {user.special_disease && user.special_disease.includes(disease) ? (
                          <i style={{ color: "green" }} className="fa-solid fa-check"></i>
                          ) : <i style={{ color: "red" }} className=""></i>}
                          </td>
                        ))} */}
                    <td className="notes-td" data-label="Notes"> {user.notes}</td>
                    {/* <td className="notes-td" data-label="Notes">
  {user.e_sign && user.e_sign.startsWith("data:image/png;base64,") ? (
    <img
      src={user.e_sign}
      alt="Signature"
      style={{ width: '200px', height: 'auto' }}
      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} // Hide image if src is invalid
    />
  ) : (
    <span>{user.e_sign}</span>
  )}
</td> */}

                    {/* <td className="notes-td" data-label="Notes"> {user.spouses}</td> */}

                    {/* 
                    <td data-label="edit" className="edit-btn">
                      {editableRows[user._id] ? (
                        <>
                          <button className="btn_add" onClick={() => handleSave(user._id)}><i className="fa-solid fa-check"></i></button>
                          <button className="btn_cancel" onClick={() => handleCancel(user._id)}><i className="fa-solid fa-close"></i></button>
                        </>
                      ) : (
                        <button className="btn-edit" onClick={() => handleEdit(user._id)}><i className="fa-solid fa-pen-to-square"></i></button>
                      )}
                    </td> */}

                    {/* <td data-label="Notes">{user.txt_label_3}</td>
                          <td data-label="Notes">{user.e_sign}</td>
                      <td data-label="Notes">{user.submission_date}</td>
                      <td data-label="IP">{user.ip_address}</td>
                      <td className="blank_raw" data-label="Verified Date"> </td>
                      <td className="blank_raw" data-label="Verified Date"> </td> */}

                    {/* {user.medication && user.medication.length > 0 ? (
                        user.medication.map((med, index) => (
                          <React.Fragment key={index}>
                            <td data-label="Medication Name">{med.name}</td>
                            <td data-label="Dosage">{med.dosage}/(ml/mg)</td>
                          </React.Fragment>
                        ))
                      ) : (
                          <React.Fragment>
                            <td data-label="Medication Name">No medication</td>
                            <td data-label="Dosage">No dosage</td>
                          </React.Fragment>
                        )} */}
                    {/* <td className="blank_raw" data-label="Verified Date"> </td>
                        <td className="blank_raw" data-label="Verified Date"> </td>
                              {user.spouse && user.spouse.length > 0 ? (
                        user.spouse.map((spousee, index) => (
                          <React.Fragment key={index}>
                            <td data-label="Medication Name">{spousee.spousename}</td>
                            <td data-label="Dosage">{spousee.spousenum}</td>
                            
                          </React.Fragment>
                        ))
                      ) : (
                          <React.Fragment>
                            <td data-label="Medication Name">Not Available</td>
                            <td data-label="Dosage">Not Available</td>
                          </React.Fragment>
                        )}  */}


                    {/*<td data-label="Projected Income">{user.Medication[0]}</td>
                         <td data-label="Projected Income">{user.Medication[1]}</td>*/}
                  </tr>

                ))}
              </tbody>
            </table>

          </div>

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
      {/* <Footer /> */}
    </>

  )

}

export default HPFagentportal
