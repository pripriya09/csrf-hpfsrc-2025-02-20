import React, { useEffect, useState, useMemo } from 'react'
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


const EAFTracker = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isAnyRowEditable, setIsAnyRowEditable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [permissions, setPermissions] = useState([]);
  const [userCount, setUserCount] = useState();
  const [pageItemCount, setPageItemCount] = useState();
  const [totalPageCount, setTotalPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = pageItemCount; // Adjust this value based on your actual items per page
  const arrayToMap = Array.from({ length: userCount });
  // Assuming user.enroll is initially 'false'
  const [userEnrollStatus, setUserEnrollStatus] = useState({});
  //console.log('totalPageCount- default',totalPageCount)
  // const [csrfTokenState, setcsrfTokenState] = useState(null);

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


  
  const getCsrfToken = async () => {
    try {
      const response = await fetch(baseurl + '/csrf-token', {
        method: 'GET',
        credentials: 'include', // Include cookies for CSRF protection
      });
      const data = await response.json();
      // setCsrfTokenState(data.csrfToken); // Store the CSRF token in your state
      return data.csrfToken; // Return CSRF token for later use
    } catch (error) {
      console.error("Error fetching CSRF token", error);
      return null;
    }
  };

  const navigate = useNavigate();
  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const response = await fetch(baseurl + `/admin/getalluserform?page=${currentPage}`, {
        headers: {
          Authorization:  Cookies.get('session')
        }
      });



      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();
      //console.log("Fetched data:", apiData); // Log fetched data

      if (apiData.success && Array.isArray(apiData.data)) {
        const modifiedUserData = apiData.data.map(user => {
          const modifiedDiseases = user.specialDiseases ? user.specialDiseases.map(disease => '<i className="fa-solid fa-code"></i>') : [];
          return {
            ...user,
            specialDiseases: modifiedDiseases,
          };
        });

        // Filter data based on the selected year or if effective_date is empty

        setUserData(modifiedUserData);
        setUserCount(apiData.maxMedicationCount);

        const userEnrollData = apiData.data.reduce((acc, user) => {
          if (user && typeof user.enroll !== 'undefined') {
            acc[user._id] = user.enroll?.toLowerCase() === "true" || user.enroll?.toLowerCase() === "true";
          }
          return acc;
        }, {});

        setUserEnrollStatus(userEnrollData);
        //"userEnrollStatus------------->", userEnrollStatus);
        setData(apiData.data);
      } else {
        console.error('Invalid API response:', apiData);
        setUserData([]);
      }
      setLoading(false); // End loading state

    } catch (error) {
      console.error('Error fetching data from API:', error);
      setLoading(false); // End loading state
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
      "enrollment_date": formattedDate,
    };

    //console.log()
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
        //console.log("API Response:", data);

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
  
  useEffect(() => {

    // Additional UI logic here based on the state changes
  }, [userEnrollStatus, userData])
  //handal click for the pending status
  const [selectedUserId, setSelectedUserId] = useState();

  useEffect(() => {
    // Fetch user data from the API
    fetch(baseurl + `/admin/getalluserform?page=${currentPage}`, {
      headers: {
        Authorization:  Cookies.get('session')
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Invalid token') {
          // Redirect to login page if the token is invalid
          navigate('/login');
          return;
        }
        //console.log("useEffect api call ho rahi hai ")
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
            setUserData(data.data);
            // console.log("setPageItemCounteee---->",data.totalPages);
            // Ensure that user data has the expected structure

            const userEnrollData = data.data.reduce((acc, user) => {
              if (user && typeof user.enroll !== "undefined") {
                acc[user._id] = user.enroll; // Store "true" or "false" as-is
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

  // State for filter criteria
  const [filterCriteria, setFilterCriteria] = useState('');

  // State for sorting
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'




  // Fetch data from API
  // const fetchData1 = async () => {
  //   try {
  //     const response = await fetch(baseurl + `/admin/getalluserform?page=${currentPage}`, {
  //       headers: {
  //         Authorization: localStorage.getItem('adminAuthToken')
  //       }
  //     });
  //     setLoading(true);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);

  //     }
  //     console.log("fetchdata1 api call ho rahi hai ")
  //     const apiData = await response.json();
  //     //console.log("fetchData1");
  //     // console.log(apiData)
  //     if (apiData.success && Array.isArray(apiData.data)) {
  //       setData(apiData.data);
  //       setLoading(false);
  //       // setTotalDataCount(apiData.totalCount); // Assuming the API provides the total count
  //     } else {
  //       console.error('Invalid API response:', apiData);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data from API:', error);
  //   }
  // };
  //const totalPageCount = Math.ceil(totalDataCount / itemsPerPage);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    handleSearch(null, true); // Clear search results
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

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAgentData();
  }, []);

  // const handleAgentChange = (userId, assignedagentname) => {
  //   setUserAgents(prevState => ({
  //     ...prevState,
  //     [userId]: assignedagentname
  //   }));
  // };


  // Filtering logic

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

  // Sorting function
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    //console.log("Sorting:", aValue, bValue);

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return 0;
  });


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedData.length);
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleColumnClick = (column) => {
    // console.log("Column clicked:", column);
    if (column === sortColumn) {
      setSortOrder((prevOrder) => {
        const newOrder = prevOrder === 'asc' ? 'desc' : 'asc';
        // console.log("Updated sort order:", newOrder);
        return newOrder;
      });
    } else {
      setSortColumn(column);
      setSortOrder('asc');
      // console.log("Set new sort column:", column);
    }
  };
  //end filterization 

  //search functionality 
  const [selectedOption, setSelectedOption] = useState('fullname');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedButton, setSelectedButton] = useState('showAll'); // Default to "Show All" as selected


  const handleSearch = async (status = null, showAll = false) => {
    try {
      // Clear search results for 'showAll'
       const token = Cookies.get('session');
       const searchPayload = showAll
       ? {} // Empty payload to fetch all items
       : status
       ? { status } // Payload for verified status search
       : { [selectedOption]: searchValue }; // Payload for regular search input
       const itemsPerPage =200;
       const csrfTokenstate = await getCsrfToken();
       if (!csrfTokenstate) {
        console.error("CSRF token is missing.");
        return;
      }

      const response = await fetch(baseurl + `/admin/search?page=${currentPage}&limit=${itemsPerPage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenstate, 
        },
        credentials: 'include', 
        body: JSON.stringify(searchPayload),
      });
      const data = await response.json();

      //console.log("data---------", data);

      if (response.ok) {
        // If either data.success is false or data.data is empty, handle it
        if (!data.success || !data.data || data.data.length === 0) {
          //console.log("No results found, clearing search results.");
          setSearchResults([]); // Clear previous results
          setTotalResults(0); // Clear total results count

          // Show an info alert for no results found
          Swal.fire({
            icon: 'info',
            title: 'No Matching Results Found',
            text: data.message,
            position: 'top',
          });
        } else {
          // If there are matching results with "Pending" status
          //console.log("Results found: ", data.data);
          setSearchResults(data.data); // Update state with matching results
          setTotalResults(data.totalCount); // Set total results

        }
      } else {
        // If the response status is not OK, handle the error
        console.error("API error: ", data.message); // Log the error
        setSearchResults([]); // Clear previous results
        setTotalResults(0); // Clear total results count

        Swal.fire({
          icon: 'info',
          title: 'No matching results found',
          text: data.message,
          position: 'top',
        });
      }
    } catch (error) {
      // Catch any errors from the fetch operation (network errors, etc.)
      console.error("Fetch error: ", error); // Log network error
      setSearchResults([]); // Clear previous results
      setTotalResults(0); // Clear total results count

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || error,
        position: 'top',
      });
    }
  };
  //console.log("searchResults.length====",searchResults.length)
  // useEffect(() => {
  //   fetchData1();
  // }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleButtonClick = (button, searchFunction) => {
    setSelectedButton(button); // Update the active button
    searchFunction(); // Execute the search function
    setLoading(true); // Start loading
    setTimeout(() => {
      setLoading(false); // Stop loading after the operation is complete
    }, 2000); // Replace 2000 with actual processing time or API call
  };

  // const handlePendingSearch = async () => {
  //   try {
  //      const token = Cookies.get('session');
  //     // Create the search payload with 'status: Pending'
  //     const searchPayload = { status: 'Pending' };

  //     // Make the API request
  //     const response = await fetch(baseurl + `/admin/search?page=${currentPage}&limit=${itemsPerPage}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': token,
  //       },
  //       body: JSON.stringify(searchPayload),
  //     });

  //     const data = await response.json();

  //     console.log("Pending Search Response: ", data);

  //     // Check if the response is successful
  //     if (response.ok) {
  //       // If either data.success is false or data.data is empty, handle it
  //       if (!data.success || !data.data || data.data.length === 0) {
  //         console.log("No results found, clearing search results.");
  //         setSearchResults([]); // Clear previous results
  //         setTotalResults(0); // Clear total results count

  //         // Show an info alert for no results found
  //         Swal.fire({
  //           icon: 'info',
  //           title: 'No Pending Results Found',
  //           text: data.message || 'No Pending items found.',
  //           position: 'top',
  //         });
  //       } else {
  //         // If there are matching results with "Pending" status
  //         console.log("Results found: ", data.data);
  //         setSearchResults(data.data); // Update state with matching results
  //         setTotalResults(data.totalCount); // Set total results
  //       }
  //     } else {
  //       // If the response status is not OK, handle the error
  //       console.error("API error: ", data.message); // Log the error
  //       setSearchResults([]); // Clear previous results
  //       setTotalResults(0); // Clear total results count

  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: data.message || 'An error occurred while fetching the Pending data.',
  //         position: 'top',
  //       });
  //     }
  //   } catch (error) {
  //     // Catch any errors from the fetch operation (network errors, etc.)
  //     console.error("Fetch error: ", error); // Log network error
  //     setSearchResults([]); // Clear previous results
  //     setTotalResults(0); // Clear total results count

  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: error.message || error,
  //       position: 'top',
  //     });
  //   }
  // };


  useEffect(() => {
    //console.log("Updated searchResults after state update: ", searchResults);
  }, [searchResults]);  // This will log whenever searchResults change



  ////console.log("Current Page: ", currentPage);
  //console.log("Items Per Page: ", itemsPerPage);



  // Individual search functions
  // Button click handler for "Show All"
  const handleShowAll = () => {
    setSearchValue(''); // Clear the search input if any
    handleSearch(null, true); // Trigger search to show all items
  };
  const handleVerifiedSearch = () => handleSearch('Verified');
  const handlePendingSearch = () => handleSearch('Pending');
  const handleDeclinedSearch = () => handleSearch('Declined');



  // Filter and sort renderData based on conditions

  const renderData = (searchResults.length > 0 ? searchResults : sortedData)
    .filter((item) => {
      const effectiveDate = item.effective_date ? new Date(item.effective_date) : null;
      return (
        effectiveDate === null || // Include items where effective_date is null
        (effectiveDate.getFullYear() === parseInt(selectedYear, 10)) // Include items matching the selected year
      );

    })

    //if effective date are null and does not show the all online submissions
    // Filter and sort renderData based on conditions
    // const renderData = (searchResults.length > 0 ? searchResults : sortedData)
    //   .filter((item) => {
    //     const effectiveDate = item.effective_date ? new Date(item.effective_date) : null;
    // return (
    //   effectiveDate !== null && // Ensure effective_date exists
    //   effectiveDate.getFullYear() === parseInt(selectedYear, 10) // Only include items matching the selected year
    // );
    //})

    .sort((a, b) => {
      if (!sortColumn) return 0;

      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });

  //console.log("renderData------>", renderData);


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
  //console.log("totalPages------>", totalPages);

  // Ensure that currentPage is within the valid range
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));


  // Calculate the index range for the current page
  const indexOfFirstItem = (validCurrentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(validCurrentPage * itemsPerPage, renderData.length);

  // console.log("indexOfFirstItem------>", indexOfFirstItem);
  // console.log("indexOfLastItem------>", indexOfLastItem);

  // Extract the data for the current page
  const currentPageData = renderData.slice(indexOfFirstItem, indexOfLastItem);

  //console.log("currentPageData------>", currentPageData);
  //console.log("itemsPerPage------>", itemsPerPage);
  //console.log("currentPage------>", validCurrentPage);
  //console.log("searchResults------>", searchResults.length);
  //end search functionality


  const resetPage = () => {
    setCurrentPage(1);
  };


  const handleNewSearch = () => {
    if (selectedOption === 'assignedagentname' && searchValue.trim() === '') {
      // If assignedagentname is selected and input is blank, fetch null items
      handleSearchNullAgent();
    } else if (searchValue.trim() === '') {
      Swal.fire({
        icon: '',
        title: '',
        text: 'Search value is required.', // Show error message
        position: 'top',
      });
    } else {
      resetPage(); // Reset the page to 1 before initiating a new search
      handleSearch(); // Perform the new search with the current search value
    }
  };

  const handleClear = () => {
    handleSearch(null, true); // Clear search results
    setSearchResults([]); // Clear search results
    setCurrentPage(1); // Reset currentPage to 1
    setSearchValue('');
    setSelectedOption('fullname'); // Clear the search input value
    // You may also want to fetch the default data or update the data in another way
    // For example:
    // fetchData(); // Fetch default data
    fetchData();
  };
  // end reffresh the data on page

  // Function to fetch items with assignedagentname: null
  const fetchNullItems = async () => {
    try {
       const token = Cookies.get('session');
       const csrfTokenstate = await getCsrfToken();
       if (!csrfTokenstate) {
        console.error("CSRF token is missing.");
        return;
      }

      const response = await fetch(baseurl + `/admin/search?page=${currentPage}&limit=${pageItemCount}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
           'xsrf-token': csrfTokenstate, 
        },
        credentials: 'include', 
        body: JSON.stringify({ assignedagentname: null }), // Sending a request to get null items
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      //console.log("Assigned Agent Null Data data",data);
      setData(data.data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching null items:', error);
      // Handle the error, e.g., show an alert or a message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch items.',
        position: 'top',
      });
    }
  }




  const handleSearchNullAgent = () => {
    // Check if the assignedagentname is empty
    if (searchValue.trim() === '') {
      // Fetch all items with assignedagentname: null
      fetchNullItems();
    } else {
      resetPage(); // Reset the page to 1 before initiating a new search
      handleSearch(); // Perform the new search with the current search value
    }
  };


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
  //console.log("data sort hua ke nahi",sortedData);

  // data updating functionality
  const [editableRows, setEditableRows] = useState({});
  const [editedData, setEditedData] = useState({});

  const handleInputChange = (_id, field, value) => {
    const newData = { ...editedData[_id] };
    newData[field] = value;
    setEditedData({ ...editedData, [_id]: newData });

  };



  const formatDateToUTC = (date) => {
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const month = (utcDate.getMonth() + 1).toString().padStart(2, '0');
    const day = utcDate.getDate().toString().padStart(2, '0');
    const year = utcDate.getFullYear();
    return `${month}/${day}/${year}`;
  };


  const handleSave = async (_id) => {

    // Ensure assigned_date is not null or undefined, and format it to MM/DD/YYYY
    const assignedDate = editedData[_id]?.assigned_date
      ? formatDate(new Date(editedData[_id]?.assigned_date))
      : formatDate(getUSCurrentDate());



    // Ensure effective_date is not null or undefined, and format it to MM/DD/YYYY
    const effectiveDate = editedData[_id]?.effective_date
      ? formatDate(new Date(editedData[_id]?.effective_date))
      : editedData[_id]?.effective_date;



    const updatedData = {
      ...editedData[_id],
      effective_date: effectiveDate,
      _id: _id
    };

    try {
       const token = Cookies.get('session');
       const csrfTokenstate = await getCsrfToken();
       if (!csrfTokenstate) {
        console.error("CSRF token is missing.");
        return;
      }

      const response = await fetch(baseurl + '/admin/update-user-details', {
        method: 'POST',
        body: JSON.stringify(updatedData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenstate, 
        },
        credentials: 'include', 
      });
      const data = await response.json();

      if (response.ok) {
        // Update local state to remove the row that was edited
        const updatedEditableRows = { ...editableRows };
        delete updatedEditableRows[_id];
        setEditableRows(updatedEditableRows);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message, // Displaying success message
          position: 'top',
        });

        // Clear any "editing" flags
        setIsAnyRowEditable(false);
        fetchData();
        handleSearch();
        // Call fetchData to reload the data after saving


      } else {
        // Show error message if something went wrong
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message, // Displaying error message
          position: 'top',
        });
        handleCancel(_id); // Optionally reset the row state
      }
    } catch (error) {
      // Show generic error message if the request fails
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update data. Please try again.',
        position: 'top',
      });
      handleCancel(_id); // Optionally reset the row state
    }
  };

  const handleCancel = (_id) => {
    const updatedEditableRows = { ...editableRows };
    delete updatedEditableRows[_id];
    setEditableRows(updatedEditableRows);
    setEditedData({ ...editedData, [_id]: null });
    setIsAnyRowEditable(false);
  };


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
          const csrfTokenstate = await getCsrfToken();
          if (!csrfTokenstate) {
           console.error("CSRF token is missing.");
           return;
         }   
          const response = await fetch(baseurl + '/admin/delete-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
              'xsrf-token': csrfTokenstate, 
            },
            credentials: 'include', 
            body: JSON.stringify({
              "_id": userId,
            })
          });
          if (response.ok) {
            fetchData(); 
            handleClear();
          } else {
            console.error('Failed to delete User');
          }
        } catch (error) {
          console.error('Error making API call:', error);
        }
      }
    });
  };


  // data updating functionality end
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 15000);
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
  // Function to get the current date in US Eastern Time Zone
  const getUSCurrentDate = () => {
    const currentDate = new Date();
    const usDate = currentDate.toLocaleString('en-US', {
      timeZone: 'America/New_York', // Set to US Eastern Timezone
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    // Return the formatted date
    return usDate;
  };

  const handleEdit = (_id) => {
    setEditableRows({ ...editableRows, [_id]: true });
    const originalData = data.find(item => item._id === _id);
    setEditedData({ ...editedData, [_id]: { ...originalData } });
    setIsAnyRowEditable(true);
    fetchAgentData();

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

  const handleEffectiveDateChange = (userId, field, date) => {
    if (!date) return;
  
    // Get the UTC date components manually
    const year = date.getFullYear();
    const month = date.getMonth(); // Month is 0-based
    const day = date.getDate();
  
    // Construct a UTC date string (YYYY-MM-DD) without time
    const utcDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
    // Update state with the formatted UTC date
    setEditedData(prevState => ({
      ...prevState,
      [userId]: {
        ...prevState[userId],
        [field]: utcDateString,
      },
    }));
  };
  


  const formatday = (dateString) => {
    if (!dateString) return ''; // Return an empty string if dateString is null or undefined
    const parts = dateString.split('-'); // Split the date string
    // Rearrange parts to match "YYYY-MM-DD"
    const formattedDate = `${parts[2]}/${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
    return formattedDate;
  };

  const displayData = currentPageData.length > 0
    ? currentPageData
    : searchResults.length > 0
      ? searchResults
      : sortedData; // Make sure you use sortedData here


  // console.log("setTotalResults",totalResults)
  // console.log("itemsPerPage",itemsPerPage)
  // console.log("searchResults",searchResults)
  // console.log("searchResults.length",searchResults.length)
  const downloadFile = async () => {
    try {
      // Prompt the user to enter the verification code
      const userCode = await Swal.fire({
        title: 'Enter Verification Code',
        input: 'text',
        inputPlaceholder: 'Enter code here',
        showCancelButton: true,
        confirmButtonText: 'Verify',
        position: 'top',
      });
  
        // Check if the user entered the correct code
        if (userCode.isDismissed) {
          return; // Exit the function if the code is incorrect
        }
      // Check if the user entered the correct code
      if (userCode.value !== '$K854jyT480S') {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Invalid code. File download is not authorized.',
          position: 'top',
        });
        return; // Exit the function if the code is incorrect
      }
  
      

      // Proceed with the file download if the code is correct
      const token = Cookies.get('session');
  
      const response = await fetch(baseurl + `/admin/getalluserdata`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const blob = await response.blob(); // Convert the response to a Blob
      const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
  
      // Create an anchor element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "userData.xlsx"; // Set the default file name
      document.body.appendChild(a); // Append the anchor to the body
      a.click(); // Programmatically trigger the download
      a.remove(); // Remove the anchor element after download
  
      // Revoke the Blob URL to free memory
      window.URL.revokeObjectURL(url);
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'File downloaded successfully.',
        position: 'top',
      });
    } catch (error) {
      console.error("There was an error downloading the file:", error);
  
      // Display error using Swal or any other alert mechanism
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to download the file.',
        position: 'top',
      });
    }
  };


  const changeeffectivedatetonextyear = async () => {
    try {
       const token = Cookies.get('session');
       const csrfTokenstate = await getCsrfToken();
       if (!csrfTokenstate) {
        console.error("CSRF token is missing.");
        return;
      }

      const response = await fetch(`${baseurl}/admin/duplicateuserrows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'xsrf-token': csrfTokenstate, 
        },
        credentials: 'include', 
      });

      const result = await response.json(); // Parse the response JSON
      // Display success message
      if (!response.ok) {
        Swal.fire({
          icon: 'info',
          title: 'info',
          text: result.message,
          position: 'top',
        });

      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: result.message || 'Operation completed successfully!',
          position: 'top',
        });
        handleClear();
      }

    } catch (error) {
      // Display error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong. Please try again later.',
        position: 'top',
      });
    }
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

  useEffect(() => {
    fetchUserPermissions();
  }, []);



 

  return (
    <>

      <div className="EAFT-container">

        <HeaderTwo />
        <div className="content">
          <div className="search-header">



            <div className="status-EAF">
              <label htmlFor="searchOption" >Report View:</label>
              <select
                className="dropdown-eaf"
                value={selectedButton}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedButton(value);
                  if (value === 'showAll') {
                    handleShowAll();
                  } else if (value === 'verified') {
                    handleVerifiedSearch();
                  } else if (value === 'pending') {
                    handlePendingSearch();
                  } else if (value === 'declined') {
                    handleDeclinedSearch();
                  }
                }}
              >
                <option value="showAll">Show All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="declined">Declined</option>
              </select>
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
              <label htmlFor="searchOption" >Filter:</label>

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
                <option value="assignedagentname">Assigned Agent</option>
                <option value="submission_type">Submission Type</option>

                {/* Add more options as needed */}
              </select>


              <input
                type="text"
                id="searchValue"
                value={
                  selectedOption === 'phonenumber'
                    ? phonenumber
                    : selectedOption === 'ssn'
                      ? ssn
                      : searchValue
                }
                placeholder="Enter the value..."
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSearchValue(newValue); // Update the search value immediately

                  if (selectedOption === 'phonenumber') {
                    handleInputPhoneChange(e);
                  } else if (selectedOption === 'ssn') {
                    handleInputSsnChange(e);
                  }
                  // No action needed for assignedagentname in onChange
                }}
              />


              <div className='input-flex'>
                <button onClick={handleNewSearch}>Search</button>
                <button onClick={handleClear}>Clear Search</button>
              </div>
              <div className='input-flex'>
                {permissions === 'Super Admin' && (
                  <button onClick={downloadFile}>Download Database</button>
                  // <button>Download Database</button>

                )}
              </div>

            </div>

          </div>
          <div className="EAFT-table">
            <table className="response-table">
              <thead>
                <tr>

                  <td >PDF</td>
                  <td >AOR</td>
                  <td onClick={() => handleColumnClick('serialNumber')}>Client ID</td>
                  <td onClick={() => handleColumnClick('facilty_code')}>Facilty Code</td>
                  <td onClick={() => handleColumnClick('facilty_name')}>Facilty Name</td>
                  <td onClick={() => handleColumnClick('fullname')} >Enrollee Name</td>
                  <td onClick={() => handleColumnClick('submission_date')}>Submission Date</td>
                  <td onClick={() => handleColumnClick('submission_type')}>Submission Type</td>
                  <td onClick={() => handleColumnClick('verified_date')}>Verified Date</td>
                  <td onClick={() => handleColumnClick('status')}>Authorization Status</td>
                  <td onClick={() => handleColumnClick('assignedagentname')}>Agent Assigned</td>
                  <td onClick={() => handleColumnClick('assigned_date')}>Assignment Date</td>
                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>
                  {/* <td> Enroll status </td> */}

                  <td> Enrolled</td>
                  <td onClick={() => handleColumnClick('status')}>Enrollment Date</td>
                  <td className="effective_date">Effective Date</td>
                  <td className="ahap">AHAP</td>

                  <td >Carrier</td>
                  <td >Plan</td>
                  <td >Policy Number</td>
                  <td >Not Enrolled</td>
                  <td > NE Reason </td>
                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>

                  {/* CHANGE ON -2024-08-23*/}
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

                  {/* CHANGE ON -2024-08-23*/}


                  <td className="blank_raw">  </td>
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
                  <td className="notes-td-head">Additional Information</td>
                  {/* <td className="notes-td-head">e_sign</td> */}
                  {/* <td className="notes-td-head">Spouse Details</td> */}
                  {/* Client were asking to hide it in EAF  - 2024-01-31*/}
                  {/* <td>Former AOR</td>
                  <td>Electronic Signature</td>
                  <td>Signature Date</td>
                  <td>IP Address</td> */}

                  <td className="blank_raw">  </td>
                  <td className="blank_raw">  </td>

                  {permissions === 'Super Admin' && (
                 <td >Action</td>
                  // <button>Download Database</button>
                )}
                  

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
                {loading ? (
                  <tr>
                    <td colSpan="25" style={{ textAlign: 'center' }}>
                      <div className="loader-container">
                        <div className="spinner"></div>
                      </div>
                    </td>
                  </tr>
                ) : renderData.length === 0 ? (
                  <tr>
                    <td colSpan="20" className="search-resuls">
                      <p>No matching results found</p>
                    </td>
                  </tr>
                ) : (
                      displayData.map((user, index) => (
                        <tr key={user._id}>




{/* {permissions === 'Admin' ? (
  <td>
  {(
    (userEnrollStatus[user._id] === true ||
      user.enroll === "true" ||
      user.enroll === "TRUE") ||
    (userEnrollStatus[user._id]?.ahap === "true" ||
      user.ahap === "true") ||  (user.noenrolled === "true" ||
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
) : (
  <td>
                            <Link target="_blank" to={`/user-details/${user._id}`}>
                              <button className="btndownload">Show details</button>
                            </Link>
                          </td>
)} */}

<td>
                            <Link target="_blank" to={`/user-details/${user._id}`}>
                              <button className="btndownload">Show details</button>
                            </Link>
                          </td>

                          <td>
                            <Link target="_blank" to={`/user-AOR/${user._id}`}>
                              <button className="btndownload">Show details</button>
                            </Link>
                          </td>
                          {/* <td data-label="S.No.">{(currentPage - 1) * itemsPerPage + index + 1}</td> */}
                          <td data-label="Client ID">{user.serialNumber}</td>
                          <td data-label="Correctional Facility">{user.facilty_code}</td>
                          <td data-label="Correctional Facility">{user.facility_name}</td>
                          <td data-label="Contact" className="name-column">
                            <span
                              className={`btn-name-edit ${editableRows[user._id] ? 'editable' : ''}`}
                              onClick={() => !editableRows[user._id] && !isAnyRowEditable && handleEdit(user._id)}
                              style={{ cursor: editableRows[user._id] || isAnyRowEditable ? 'default' : 'pointer' }}
                            >
                              {user.fullname}
                            </span>
                          </td>
                          <td data-label="Submission Date">
                            {user.submission_date ? formatDate(user.submission_date) : ""}
                          </td>
                          <td data-label="Submission Type">{user.submission_type}</td>
                          <td data-label="Verified Date">{user.verified_date ? formatDate(user.verified_date) : ""}</td>
                          <td data-label="Authorization Status" style={{ fontWeight: user.status === 'Verified' ? 'bold' : 'normal', color: user.status === 'Verified' ? 'green' : (user.status === 'Declined' ? 'red' : 'inherit') }}>
                            {user.status === 'Pending' ? (
                              <span style={{ color: 'blue' }}>
                                Pending
                              </span>
                            ) : (
                                user.status
                              )}
                          </td>
                          <td data-label="Agent">
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
                          </td>
                          <td data-label="assigned_date" className="planname">
                            {editableRows[user._id] ? (
                              <DatePicker
                                selected={
                                  editedData[user._id]?.assigned_date
                                    ? new Date(editedData[user._id].assigned_date)
                                    : user.assigned_date
                                      ? new Date(user.assigned_date)
                                      : new Date()
                                }
                                onChange={(date) => handleDateChange(user._id, 'assigned_date', date)}
                                dateFormat="MM/dd/yyyy"
                              />
                            ) : (
                                user.assigned_date ? formatDate(user.assigned_date) : ""
                              )}
                          </td>
                          {/* <td data-label="assigned_date">{user.assigned_date}</td> */}

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
                          <td className="blank_raw" data-label="Verified Date"> </td>
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
                          <td>
                            <input
                              type="checkbox"
                              checked={userEnrollStatus[user._id] === true || user.enroll?.toLowerCase() === "true" || user.enroll === "TRUE"} // Check if the status is "true"
                              onChange={(e) => {
                                if (
                                  user.status === "Pending" ||
                                  user.status === "Declined" ||
                                  user.permission !== "Agent"
                                ) {
                                  e.preventDefault(); // Prevent checkbox change
                                } else {
                                  handleCheckboxChange(user._id); // Toggle the checkbox state
                                }
                              }}
                              className="readonly-checkbox"
                            />
                          </td>

                          <td data-label="Enrollment Date">
                            {userEnrollStatus[user._id] === true || user.enroll?.toLowerCase() === "true" || user.enroll === "TRUE" && user.enrollment_date // Display date only if "true"
                              ? formatDate(user.enrollment_date)
                              : ""}
                          </td>



                          
                          <td data-label="effective_date" className="planname">
  {(userEnrollStatus[user._id]?.enroll?.toLowerCase() === "true" || user.enroll?.toLowerCase() === "true") ? (
    editableRows[user._id] ? (
      <DatePicker
        selected={
          editedData[user._id]?.effective_date
            ? new Date(editedData[user._id]?.effective_date)  // Use the edited date if it exists
            : user.effective_date
            ? new Date(user.effective_date)  // Otherwise, use the original effective date
            : new Date()  // Default to current date if no effective date exists
        }
        onChange={(date) => handleEffectiveDateChange(user._id, 'effective_date', date)}  // Only call onChange when a new date is selected
        dateFormat="MM/dd/yyyy"
      />
    ) : (
      user.effective_date ? formatDate(user.effective_date) : ""  // Display the formatted date if not editable
    )
  ) : (
    ""
  )}
</td>
                          

                          {/* <td data-label="effective_date" className="planname">

                            {user.effective_date ? formatDate(user.effective_date) : ""}

                          </td> */}

                          <td data-label="ahap">
                            <input
                              type="checkbox"
                              checked={userEnrollStatus[user._id]?.ahap === 'true' || user.ahap === 'true'}
                              className="readonly-checkbox"
                              readOnly
                            />
                          </td>

                          <td data-label="Carrier">
                            {editableRows[user._id] ? (
                              <select
                                value={
                                  editedData[user._id]?.carrier !== undefined
                                    ? editedData[user._id]?.carrier
                                    : user.carrier
                                }
                                onChange={(e) => handleInputChange(user._id, 'carrier', e.target.value)}
                                disabled={userEnrollStatus[user._id]?.noenrolled === 'true' || user.noenrolled === 'true'} // Disable if noenrolled is 'true'
                              >
                                {carriers.map((carrier, index) => (
                                  <option key={index} value={carrier}>
                                    {carrier}
                                  </option>
                                ))}
                              </select>
                            ) : (
                                user.carrier
                              )}
                          </td>
                          <td data-label="Plan">
                            {/* {user.plan} */}
                            {editableRows[user._id] ? (
                              <input
                                type="text"
                                value={editedData[user._id]?.plan !== undefined
                                  ? editedData[user._id]?.plan
                                  : user.plan
                                }
                                onChange={(e) => handleInputChange(user._id, 'plan', e.target.value)}
                                disabled={userEnrollStatus[user._id]?.noenrolled === 'true' || user.noenrolled === 'true'} // Disable if noenrolled is 'true'
                              />
                            ) : (
                                user.plan
                              )}
                          </td>

                          <td data-label="Policy Number">
                            {/* {user.policyNumber} */}

                            {editableRows[user._id] ? (
                              <input
                                type="text"
                                value={editedData[user._id]?.policyNumber !== undefined
                                  ? editedData[user._id]?.policyNumber
                                  : user.policyNumber}
                                onChange={(e) => handleInputChange(user._id, 'policyNumber', e.target.value)}
                                disabled={userEnrollStatus[user._id]?.noenrolled === 'true' || user.noenrolled === 'true'} // Disable if noenrolled is 'true'
                              />
                            ) : (
                                user.policyNumber
                              )}
                          </td>

                          <td data-label="noenrolled">
                            <input
                              type="checkbox"
                              checked={userEnrollStatus[user._id]?.noenrolled === 'true' || user.noenrolled === 'true'}
                              className="readonly-checkbox"
                              readOnly
                            />
                          </td>

                          <td data-label="NE Reason">
                            {user.nereason}
                          </td>

                          <td className="blank_raw" data-label="Verified Date"> </td>
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
    user.ahap?.toLowerCase() === "true")) ||
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
                          <td className="blank_raw" data-label="Verified Date"> </td>
                          {/* {specialDiseases.map((disease) => (
          <td key={disease} data-label={disease}>
          {user.special_disease && user.special_disease.includes(disease) ? (
            <i style={{ color: "green" }} className="fa-solid fa-check"></i>
            ) : <i style={{ color: "red" }} className=""></i>}
            </td>
          ))} */}
                          <td className="notes-td" data-label="Notes"> {user.notes}</td>
                          <td className="blank_raw" data-label="Verified Date"> </td>
                          <td className="blank_raw" data-label="Verified Date"> </td>
                          
                          {permissions === 'Super Admin' && (
                 <td data-label="Action">
                          
                 <button
                   className="btn_delete"
                   onClick={() => handleDeleteUser(user._id)}
                   data-tooltip-content="Delete"
                   data-tooltip-id="my-tooltip-delete"
                 >
                   <i className="fa-solid fa-trash"></i>
                 </button>
               </td>
                  // <button>Download Database</button>

                )}
                          
                         
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
                      ))
                    )}
              </tbody>
            </table>

          </div>

          <div className="pagination-right">
            {searchResults && searchResults.length > 0 ? (
              <div className="pagination">
                {totalResults > itemsPerPage && (
                  <ul className="pagination">
                    <li>
                      <button className="btn_prev" onClick={handlePrevClick} disabled={isPrevButtonDisabled}>
                        &larr; Prev
            </button>
                    </li>
                    <li>
                      <button className="btn_prev" onClick={handleNextClick} disabled={isNextButtonDisabled}>
                        Next &rarr;
            </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : null}
          </div>


          <div className= "footer-txt">
            *Carrier, Plan Type and Policy Number for renewing 1/1/2025 insureds may reflect 2024 policy information.  We are working to update with 2025 plan year information as it becomes available.
            </div>
        </div>
     
      </div>
      {/* <Footer /> */}
    </>

  )

}

export default EAFTracker
