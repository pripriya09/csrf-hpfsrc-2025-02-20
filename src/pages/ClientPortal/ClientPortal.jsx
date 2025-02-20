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

const ClientPortal = () => {
    const [userData, setUserData] = useState([]); // Initialize as an empty array

    const [facilityName, setFacilityName] = useState('');
    const [facilityCode, setFacilityCode] = useState('');
    const [selectedFacility, setSelectedFacility] = useState(''); // Store selected facility name
    const [facilityCodes, setFacilityCodes] = useState([]); // Store facility codes as an array
    const [facilityNames, setFacilityNames] = useState([]); // Store facility names as an array
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredEnrollData, setFilteredEnrollData] = useState([]);
    const [filteredUnverifiedData, setUnverifiedEnrollData] = useState([]);
    const [filteredAhapData, setFilteredAhapData] = useState([]);
    const [filteredMissingData, setFilteredMissingData] = useState([]);
    const [selectedTab, setSelectedTab] = useState('tab0'); // State to manage the selected tab
    const [idUser, setIdUser] = useState('');
    // State for editing rows
    const [editableRows, setEditableRows] = useState({});
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isAnyRowEditable, setIsAnyRowEditable] = useState(false);
    const [selectedOptionEffective, setSelectedOptionEffective] = useState('effective_date'); // Default selection
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
    


    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        handleClear();
    };

    // const navigate = useNavigate();

    // //data yaha se load nhi ho raha hai 
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(baseurl + `/admin/get-all-facilityitems?page=${currentPage}`, {
    //       headers: {
    //         Authorization: Cookies.get('session')
    //       }
    //     });

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }

    //     const data = await response.json();

    //     if (data.success) {
    //       if (Array.isArray(data.data)) {
    //         const modifiedUserData = data.data.map(user => {
    //           const modifiedDiseases = user.specialDiseases ? user.specialDiseases.map(disease => '<i className="fa-solid fa-code"></i>') : [];
    //           return {
    //             ...user,
    //             specialDiseases: modifiedDiseases,
    //           };
    //         });

    //         setUserData(modifiedUserData); // Set the modified data
    //         setUserCount(data.maxMedicationCount);

    //         const userEnrollData = data.data.reduce((acc, user) => {
    //           if (user && typeof user.enroll !== 'undefined') {
    //             acc[user._id] = user.enroll === 'true' || user.enroll === true || user.ahap;
    //           }
    //           return acc;
    //         }, {});

    //         setUserEnrollStatus(userEnrollData);
    //       } else {
    //         console.error('Data is not an array:', data.data);
    //         setUserData([]); // Set to empty array if not valid
    //       }
    //     } else {
    //       console.error('Failed to fetch user data');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //   }
    // };



    const handleInputChange = (_id, field, value) => {
        const newData = { ...editedData[_id] };
        newData[field] = value;
        setEditedData({ ...editedData, [_id]: newData });
    };

    const handleSave = async (_id) => {
        const updatedData = {
            _id: _id,
            notes: editedData[_id]?.notes, // Include only the fields you want to update
        };

        //console.log('Payload being sent to API:', updatedData); // Log the payload

        try {
            const token = Cookies.get('session');
            if (!csrfTokenState) {
                console.error("CSRF token is missingKKKK.");
                return;
              }
            const response = await fetch(baseurl + '/admin/update-user-details', {
                method: 'POST',
               
                body: JSON.stringify(updatedData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'xsrf-token': csrfTokenState,
                },
                credentials: 'include', 
            });

            const data = await response.json();
            //console.log('API response:', data); // Log the API response

            if (response.ok) {
                // Successful update
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message,
                    position: 'top',
                });

                // Fetch the updated data after successful update
                fetchData1(); // Call your data fetching function here

                // Optionally reset any local editable state if necessary
                const updatedEditableRows = { ...editableRows };
                delete updatedEditableRows[_id];
                setEditableRows(updatedEditableRows);
                setIsAnyRowEditable(false);
            } else {
                // Handle any errors from the response
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    position: 'top',
                });
                handleCancel(_id);
            }
        } catch (error) {
            console.error('Error during update:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update data. Please try again.',
                position: 'top',
            });
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

    const handleEdit = (_id) => {
        setEditableRows({ ...editableRows, [_id]: true });
        const originalData = data.find(item => item._id === _id);
        setEditedData({ ...editedData, [_id]: { ...originalData } });
        setIsAnyRowEditable(true);
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



    const handleFacilityChange = (e) => {
        const selectedFacilityName = e.target.value;
        setSelectedFacility(selectedFacilityName);

        if (selectedFacilityName === "show-all") {
            setFacilityName(''); // Clear facility name if "Show All" is selected
            setFacilityCode(''); // Clear facility code if "Show All" is selected

        } else {
            const index = facilityNames.indexOf(selectedFacilityName);
            setFacilityName(selectedFacilityName); // Set the facility name
            setFacilityCode(index !== -1 ? facilityCodes[index] : ''); // Set the corresponding facility code
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
                fetchData1();
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
    const itemsshowingPerPage = 500; // Adjust this value based on your actual items per page
    //console.log("itemsPerPage",itemsPerPage)
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
            console.error("CSRF token is missingKKKK.");
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
    // Fetch data from API
    // Fetch data from API
    //get all facility code to dispay the data -working 

    const fetchData1 = async () => {
        try {
            if (!csrfTokenState) {
                return;
              }
            const response = await fetch(`${baseurl}/admin/get-all-facilityitems?page=${currentPage}`, {
                
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

            if (apiData.success) {
                // Filter data based on the selected year or if effective_date is empty
                const filteredData = apiData.data.filter((item) => {
                    const effectiveDate = item.effective_date ? new Date(item.effective_date) : null; // Handle empty date
                    return (
                        effectiveDate === null || // Include if effective_date is empty
                        (!selectedYear || effectiveDate.getFullYear() === parseInt(selectedYear)) // Match selected year or show all
                    );
                });

                setFacilityCodes(apiData.facility_code);
                setFacilityNames(apiData.facility_name);
                setIdUser(apiData.facility_id);
                setUserData(filteredData); // Use filtered data here
                setTotalPageCount(apiData.totalPages);
                setPageItemCount(apiData.pageSize);

                const userEnrollData = apiData.data.reduce((acc, user) => {
                               if (user && typeof user.enroll !== 'undefined') {
                                 acc[user._id] = user.enroll === 'true' || user.enroll === true || user.ahap;
                           }
                               return acc;
                            }, {});
                
                            setUserEnrollStatus(userEnrollData);

            } else {
                console.error('Invalid API response:', apiData);
            }
        } catch (error) {
            console.error('Error fetching data from API:', error);
        }
    };

    useEffect(() => {
        fetchData1(); // Automatically fetch data when selectedYear or currentPage changes
    }, [selectedYear, currentPage]);

    useEffect(() => {
        //console.log("User Data after fetching:", userData);
    }, [userData]);

    useEffect(() => {
        //console.log("User Data before filtering:", userData);

        // Check if "Show All" is selected (facilityCode is empty)
        const isShowAll = facilityCode === "";

        // Filter users based on selected facility or show all users
        const filteredUsers = !isShowAll && Array.isArray(userData)
            ? userData.filter(user => {
                const userFacilityCode = String(user.facilty_code).trim(); // Adjusted property name
                return userFacilityCode === String(facilityCode).trim();
            })
            : userData; // Show all users if "Show All" is selected

        //console.log("Filtered Users Count:", filteredUsers.length);


        // Filter Enroll data based on the filtered users
        const filteredUnverifiedData = Array.isArray(filteredUsers)
            ? filteredUsers.filter(user => user.submission_type === 'Online')
            : [];

        // Sort the filtered data by 'status' in the order: Pending, Verified, Declined
        filteredUnverifiedData.sort((a, b) => {
            const statusOrder = { 'Pending': -1, 'Verified': 1, 'Declined': 2 };

            const aStatusOrder = statusOrder[a.status] ?? Number.MAX_SAFE_INTEGER;
            const bStatusOrder = statusOrder[b.status] ?? Number.MAX_SAFE_INTEGER;

            return aStatusOrder - bStatusOrder;
        });

        // Debugging to ensure sorting works as expected

        const filteredEnrollData = Array.isArray(filteredUsers)
            ? filteredUsers.filter(user => String(user.enroll) === "true")
            : [];

        // Filter AHAP data based on the filtered users
        const filteredAhapData = Array.isArray(filteredUsers)
            ? filteredUsers.filter(user => String(user.ahap) === "true")
            : [];
        // Filter AHAP data based on the filtered users
        const filteredMissingData = Array.isArray(filteredUsers)
            ? filteredUsers.filter(user =>
                (user.missing_notes && user.missing_notes.trim() !== '') ||
                (user.noenrolled === 'true') || (user.noenrolled === 'null')
            )
            : [];

        //console.log("Filtered AHAP Data Count:", filteredAhapData.length);


        //console.log("Filtered missing Data Count:", filteredMissingData.length);

        // Set filtered users and filtered AHAP data
        setFilteredUsers(filteredUsers);
        setUnverifiedEnrollData(filteredUnverifiedData);
        setFilteredEnrollData(filteredEnrollData);
        setFilteredAhapData(filteredAhapData);
        setFilteredMissingData(filteredMissingData)

    }, [selectedFacility, facilityCode, userData]);

    //console.log("filteredUsers1===========>",filteredUsers)
    // console.log("filteredAhapData1===========>",filteredAhapData)
    //console.log("filteredMissingData===========>",filteredMissingData)

    useEffect(() => {
        filteredAhapData;
    }, [currentPage]);

    useEffect(() => {
        filteredMissingData;
    }, [currentPage]);

    // Additional logic for filteredData (if needed)
    const filteredData = Array.isArray(userData) ? userData.filter(user => {
        return Object.entries(user).some(([key, value]) => {
            if (typeof value === 'string') {
                return value.toLowerCase().includes(filterCriteria.toLowerCase());
            } else if (typeof value === 'number') {
                return value === parseFloat(filterCriteria);
            }
            return false;
        });
    }) : [];
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
    const [searchValueEffective, setSearchValueEffective] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [searchResultsEnroll, setSearchResultsEnroll] = useState([]);
    const [totalResultsEnroll, setTotalResultsEnroll] = useState(0);
    const [searchResultsOnline, setSearchResultsOnline] = useState([]);
    const [totalResultsOnline, setTotalResultsOnline] = useState(0);
    const [searchResultsAHAP, setSearchResultsAHAP] = useState([]);
    const [totalResultsAHAP, setTotalResultsAHAP] = useState(0);
    const [searchResultsMissing, setSearchResultsMissing] = useState([]);
    const [totalResultsMissing, setTotalResultsMissing] = useState(0);


    
    const handleSearch = async () => {
        try {


            // Ensure that either searchValue or searchValueEffective has a value
            if (searchValue.trim() === '' && searchValueEffective.trim() === '') {
                return;
            }
            // Construct the body object based on the selected filter
            const body = selectedOption && searchValue
                ? { [selectedOption]: searchValue }
                : selectedOptionEffective && searchValueEffective
                    ? { [selectedOptionEffective]: searchValueEffective }
                    : {};

            const token = Cookies.get('session');
            if (!csrfTokenState) {
                console.error("CSRF token is missingKKKK.");
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
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                setSearchResults(data.data);
                setPageItemCount(data.pageSize);
                //console.log("data.data",data.data)
                setTotalResults(data.totalCount); // Set the totalResults from the server response

                //console.log("setSearchResults--->", data.data);


                // Filter the Unverified data
                const filteredUnverifiedDataSearch = Array.isArray(data.data)
                    ? data.data.filter(user =>
                        user.submission_type === 'Online'
                    )
                    : [];
                // Set the filtered AHAP data
                setSearchResultsOnline(filteredUnverifiedDataSearch);
                // Store the length of filtered Enroll data, defaulting to 0 if empty
                const renderUnverifiedData = filteredUnverifiedDataSearch.length > 0 ? filteredUnverifiedDataSearch.length : 0;
                setTotalResultsOnline(renderUnverifiedData); // Set total count based on filtered data length


                // Filter the Enroll data
                const filteredEnrollDataSearch = Array.isArray(data.data)
                    ? data.data.filter(user => String(user.enroll) === "true") // Check if enroll is "true"
                    : [];
                // Set the filtered AHAP data
                setSearchResultsEnroll(filteredEnrollDataSearch);
                // Store the length of filtered Enroll data, defaulting to 0 if empty
                const renderEnrollData = filteredEnrollDataSearch.length > 0 ? filteredEnrollDataSearch.length : 0;
                setTotalResultsEnroll(renderEnrollData); // Set total count based on filtered data length


                // Filter the AHAP data
                const filteredAhapDataSearch = Array.isArray(data.data)
                    ? data.data.filter(user => String(user.ahap) === "true") // Check if ahap is "true"
                    : [];
                // Set the filtered AHAP data
                setSearchResultsAHAP(filteredAhapDataSearch);
                // Store the length of filtered AHAP data, defaulting to 0 if empty
                const renderAHAPData = filteredAhapDataSearch.length > 0 ? filteredAhapDataSearch.length : 0;
                setTotalResultsAHAP(renderAHAPData); // Set total count based on filtered data length

                const filteredMissingDataSearch = Array.isArray(data.data)
                    ? data.data.filter(user =>
                        (user.missing_notes && user.missing_notes.trim() !== '') ||
                        (user.enroll?.toLowerCase() === 'false' && user.ahap?.toLowerCase() === 'false' && user.noenrolled?.toLowerCase() === 'false')
                    )
                    : [];
                // Set the filtered AHAP data
                setSearchResultsMissing(filteredMissingDataSearch);
                const renderMissingData = filteredMissingDataSearch.length > 0 ? filteredMissingDataSearch.length : 0;
                setTotalResultsMissing(renderMissingData); // Set total count based on filtered data length



                //console.log("filteredMissingData------>", renderMissingData);
                //console.log("Filtered Missing Data------>", filteredMissingDataSearch);
            } else {
                Swal.fire({
                    icon: '',
                    title: '',
                    text: data.message, // Displaying data.message in the text value
                    position: 'top',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: '',
                title: '',
                text: data.error, // Displaying data.message in the text value
                position: 'top',
            });
        }
    };
    useEffect(() => {
        handleSearch();
    }, [currentPage]); // Re-run the search when the page changes


    useEffect(() => {
        if (searchValueEffective) {
            handleSearch(); // Trigger the search when the effective date (year) changes
        }
    }, [searchValueEffective]); // Watch for changes in searchValueEffective

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    const renderData = searchResults.length > 0 ? searchResults : sortedData;
    // console.log("renderData------>", renderData);

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //onsole.log("data for next", currentPage,  totalPageCount, renderData.length ,itemsPerPage);
    //console.log("data for show ", currentPage,  totalPageCount, renderData.length ,itemsshowingPerPage);


    const getTableData = () => {
        switch (selectedTab) {
            case 'tab0':
                return searchResultsOnline.length > 0 ? searchResultsOnline : filteredUnverifiedData; // Show search results or filtered users
            case 'tab1':
                return searchResultsEnroll.length > 0 ? searchResultsEnroll : filteredEnrollData; // Show search results or filtered users
            case 'tab2':
                return searchResultsAHAP.length > 0 ? searchResultsAHAP : filteredAhapData; // Show search results or filtered AHAP data
            case 'tab3':
                return searchResultsMissing.length > 0 ? searchResultsMissing : filteredMissingData; // Show search results or filtered missing data
            default:
                return [];
        }
    };

    const handleTabChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedTab(selectedValue);
        handleTabClick(selectedValue); // Reuse your existing tab click functionality
    };

    // console.log("isNextButtonDisabled----->", isNextButtonDisabled);

    // Calculate the total number of pages based on the itemsPerPage
    const totalPages = Math.ceil(renderData.length / itemsshowingPerPage);


    const isNextButtonDisabled = currentPage >= totalPages || renderData.length < itemsshowingPerPage;
    const isPrevButtonDisabled = currentPage <= 1;


    //console.log("totalPages------>", totalPages);

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
        setSearchResultsOnline([]);
        setSearchResultsEnroll([]);
        setSearchResultsAHAP([]);
        setSearchResultsMissing([]);
        setCurrentPage(1); // Reset currentPage to 1
        setSearchValue('');
        setSearchValueEffective('');
        setSelectedOption('fullname'); // Clear the search input value
        setSelectedOptionEffective('effective_date');
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


    // Assuming `itemsPerPage` comes from API or is defined elsewhere
    const dataToDisplay = getTableData().slice(
        (currentPage - 1) * itemsshowingPerPage,
        currentPage * itemsshowingPerPage
    );

    // Calculate total pages
    //const totalPages = Math.ceil(getTableData().length / itemsPerPage);

    const sortedDataToDisplay = [...dataToDisplay].sort((a, b) => {
        const dateA = new Date(a.submission_date).getTime(); // Get timestamp for comparison
        const dateB = new Date(b.submission_date).getTime(); // Get timestamp for comparison
      
        return dateB - dateA; // Sort in descending order (latest date first)
      });


    return (
        <>
            <div className="EAFT-container">
                <HeaderTwo />
                <div className="content">

                    <div className="flt_name">
                         <h3 >Facility Portal</h3>   
                        <span>
                            <p>Facility Name: </p> <span>{facilityNames}</span> &nbsp;  &nbsp; <span>
                                <p> Facility Code:</p> <span>{facilityCodes}</span></span></span>
                    </div>

                    <div className="search-header client-searchbox">
                        <div className="tabs">
                            <label>Report View:</label>
                            <select
                                value={selectedTab}
                                onChange={handleTabChange}
                                className="dropdown"
                            >
                                <option value="tab0">Online EAFs</option>
                                <option value="tab1">Enrolled</option>
                                <option value="tab2">AHAP</option>
                                <option value="tab3">Not Enrolled</option>
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
                            <label htmlFor="searchOption">Filter:</label>
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
                            <br />
                            <button onClick={handleNewSearch}>Search</button>
                            <button onClick={handleClear}>Clear Search</button>
                        </div>
                    </div>
                    {/* Table for Tab 0 */}
                    {selectedTab === 'tab0' && (
                        <div className="EAFT-table">
                            <table className="response-table">
                                <thead>
                                    <tr>
                                        {/* Sorting headers */}
                                        <td onClick={() => handleColumnClick('fullname')}>Enrollee Name</td>
                                        <td onClick={() => handleColumnClick('submission_date')}>Submission Date</td>
                                        <td>Verified</td>
                                        <td>Declined</td>
                                        <td onClick={() => handleColumnClick('status')}>Authorization Status</td>
                                        <td onClick={() => handleColumnClick('verified_date')}>Verified Date</td>
                                        {/* <td> Enroll status </td> */}
                                        <td onClick={() => handleColumnClick('enrollment_date')}>Enrollment Date</td>
                                        {/* <td className="blank_raw">  </td>
            <td className="blank_raw">  </td> */}
                                        <td onClick={() => handleColumnClick('effective_date')} >Effective Date</td>
                                        <td onClick={() => handleColumnClick('carrier')} >Carrier</td>
                                        <td onClick={() => handleColumnClick('plan')} >Plan</td>
                                        <td onClick={() => handleColumnClick('policyNumber')} >Policy Number</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {totalResultsOnline === 0 && searchValue.trim() !== '' ? (
                                        <tr>
                                            <td colSpan="6">No items found.</td>
                                        </tr>
                                    ) :
                                        dataToDisplay.length > 0 ? (
                                            dataToDisplay.map(user => (
                                                <tr key={user._id}>
                                                    <td data-label="Applicant Full Legal Name">{user.fullname}</td>
                                                    <td data-label="Submission Date">{user.submission_date ? formatDate(user.submission_date) : ""}</td>

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

                                                    <td
                                                        data-label="Authorization Status"
                                                        style={{
                                                            fontWeight: user.status === 'Verified' ? 'bold' : 'normal',
                                                            color: user.status === 'Verified' ? 'green' : user.status === 'Declined' ? 'red' : 'inherit'
                                                        }}
                                                    >
                                                        {user.status === 'Pending' ? (
                                                            <a style={{ color: 'blue' }}>Pending</a>
                                                        ) : (
                                                                <span style={{ color: user.status === 'Verified' ? 'green' : user.status === 'Declined' ? 'red' : 'inherit' }}>
                                                                    {user.status}
                                                                </span>
                                                            )}
                                                    </td>

                                                    <td data-label="Verified Date">{user.verified_date}</td>

                                                    <td data-label="Enrollment Date">
                                                        {userEnrollStatus[user._id] && user.enrollment_date ? formatDate(user.enrollment_date) : ''}
                                                    </td>

                                                    <td data-label="effective_date">{user.effective_date}</td>
                                                    <td data-label="Verified Date">{user.carrier}</td>
                                                    <td data-label="Verified Date"> {user.plan}</td>
                                                    <td data-label="Verified Date">{user.policyNumber}</td>

                                                </tr>
                                            ))
                                        ) : (
                                                <tr>
                                                    <td colSpan="11">No data available.</td>
                                                </tr>
                                            )}
                                </tbody>
                            </table>
                        </div>
                    )}


                    {/* Table for Tab 1 */}
                    {selectedTab === 'tab1' && (
                        <div className="EAFT-table">
                            <table className="response-table">
                                <thead>
                                    <tr>
                                        {/* Sorting headers */}
                                        <td onClick={() => handleColumnClick('fullname')}>Enrollee Name</td>
                                        <td onClick={() => handleColumnClick('submission_date')}>Submission Date</td>
                                        <td>Verified</td>
                                        <td>Declined</td>
                                        <td onClick={() => handleColumnClick('status')}>Authorization Status</td>
                                        <td onClick={() => handleColumnClick('verified_date')}>Verified Date</td>
                                        {/* <td> Enroll status </td> */}
                                        <td onClick={() => handleColumnClick('enrollment_date')}>Enrollment Date</td>
                                        {/* <td className="blank_raw">  </td>
            <td className="blank_raw">  </td> */}
                                        <td onClick={() => handleColumnClick('effective_date')} >Effective Date</td>
                                        <td onClick={() => handleColumnClick('carrier')} >Carrier</td>
                                        <td onClick={() => handleColumnClick('plan')} >Plan</td>
                                        <td onClick={() => handleColumnClick('policyNumber')} >Policy Number</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {totalResultsEnroll === 0 && searchValue.trim() !== '' ? (
                                        <tr>
                                            <td colSpan="6">No items found.</td>
                                        </tr>
                                    ) :

                                        sortedDataToDisplay.length > 0 ? (
                                            sortedDataToDisplay.map(user => (
                                                <tr key={user._id}>
                                                    <td data-label="Applicant Full Legal Name">{user.fullname}</td>
                                                    <td data-label="Submission Date">{user.submission_date ? formatDate(user.submission_date) : ""}</td>

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

                                                    <td
                                                        data-label="Authorization Status"
                                                        style={{
                                                            fontWeight: user.status === 'Verified' ? 'bold' : 'normal',
                                                            color: user.status === 'Verified' ? 'green' : user.status === 'Declined' ? 'red' : 'inherit'
                                                        }}
                                                    >
                                                        {user.status === 'Pending' ? (
                                                            <a style={{ color: 'blue' }}>Pending</a>
                                                        ) : (
                                                                <span style={{ color: user.status === 'Verified' ? 'green' : user.status === 'Declined' ? 'red' : 'inherit' }}>
                                                                    {user.status}
                                                                </span>
                                                            )}
                                                    </td>

                                                    <td data-label="Verified Date">{user.verified_date ? formatDate(user.verified_date) : ""}</td>

                                                    <td data-label="Enrollment Date">
                                                        {userEnrollStatus[user._id] && user.enrollment_date ? formatDate(user.enrollment_date) : ''}
                                                    </td>

                                                    <td data-label="effective_date">{user.effective_date ? formatDate(user.effective_date) : ""}</td>
                                                    <td data-label="Verified Date">{user.carrier}</td>
                                                    <td data-label="Verified Date"> {user.plan}</td>
                                                    <td data-label="Verified Date">{user.policyNumber}</td>

                                                </tr>
                                            ))
                                        ) : (
                                                <tr>
                                                    <td colSpan="7">No data available.</td>
                                                </tr>
                                            )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Table for Tab 2 */}
                    {/* Table for Tab 2 */}
                    {selectedTab === 'tab2' && (
                        <div className="EAFT-table">
                            <table className="response-table">
                                <thead>
                                    <tr>
                                        <td onClick={() => handleColumnClick('fullname')}>Enrollee Name</td>
                                        <td onClick={() => handleColumnClick('state')}>Client State</td>
                                        <td onClick={() => handleColumnClick('submission_date')}>Submission Date</td>
                                        <td onClick={() => handleColumnClick('status')}>Status</td>
                                        <td onClick={() => handleColumnClick('carrier')}>Carrier</td>
                                        <td onClick={() => handleColumnClick('plan')}>Plan</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {totalResultsAHAP === 0 && searchValue.trim() !== '' ? (
                                        <tr>
                                            <td colSpan="6">No items found.</td>
                                        </tr>
                                    ) : dataToDisplay.length > 0 ? (
                                        dataToDisplay.map(user => (
                                            <tr key={user._id}>
                                                <td data-label="Applicant Full Legal Name">{user.fullname}</td>
                                                <td data-label="Applicant Full Legal Name">{user.state}</td>
                                                <td data-label="Submission Date">{user.submission_date ? formatDate(user.submission_date) : ""}</td>
                                                <td data-label="Verified Date">{user.ahap === "true" ? "AHAP" : ""}</td>
                                                <td data-label="Carrier">{user.carrier}</td>
                                                <td data-label="Plan">{user.plan}</td>
                                            </tr>
                                        ))
                                    ) : (
                                                <tr>
                                                    <td colSpan="6">No data available.</td>
                                                </tr>
                                            )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* Table for Tab 3 */}
                    {selectedTab === 'tab3' && (
                        <div className="EAFT-table">
                            <table className="response-table">
                                <thead>
                                    <tr>
                                        <td className="txt_red" onClick={() => handleColumnClick('fullname')}>Enrollee Name</td>
                                        <td className="txt_red" onClick={() => handleColumnClick('submission_date')}>Submission Date</td>
                                        <td className="txt_red" onClick={() => handleColumnClick('state')}>Client State</td>
                                        <td className="txt_red" onClick={() => handleColumnClick('Missing_info')}>NE Reason</td>
                                        <td onClick={() => handleColumnClick('notes')}>Notes</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {totalResultsMissing === 0 && searchValue.trim() !== '' ? (
                                        <tr>
                                            <td colSpan="5">No items found.</td> {/* Adjust the colspan as per your table structure */}
                                        </tr>
                                    ) : dataToDisplay.length > 0 ? ( // Removed curly braces here
                                        dataToDisplay.map(user => (
                                            <tr key={user._id}>
                                                <td data-label="Enrollee Name">
                                                    <span
                                                        className={`btn-name-edit ${editableRows[user._id] ? 'editable' : ''}`}
                                                        onClick={() => !editableRows[user._id] && !isAnyRowEditable && handleEdit(user._id)}
                                                        style={{ cursor: editableRows[user._id] || isAnyRowEditable ? 'default' : 'pointer' }}
                                                    >
                                                        {user.fullname}
                                                    </span>
                                                </td>
                                                <td data-label="Submission Date">{user.submission_date ? formatDate(user.submission_date) : ""}</td>
                                                <td data-label="Client State">{user.state}</td>
                                                <td data-label="Missing Information">{user.nereason}</td>
                                                <td data-label="Notes">
                                                    {editableRows[user._id] ? (
                                                        <input
                                                            type="text"
                                                            value={editedData[user._id]?.notes || user.notes}
                                                            onChange={(e) => handleInputChange(user._id, 'notes', e.target.value)}
                                                        />
                                                    ) : (
                                                            user.notes
                                                        )}
                                                </td>
                                                <td data-label="Contact" className="edit-name-btn">
                                                    {editableRows[user._id] ? (
                                                        <>
                                                            <button className="btn_add" onClick={() => handleSave(user._id)}>
                                                                <i className="fa-solid fa-check"></i>
                                                            </button>
                                                            <button className="btn_cancel" onClick={() => handleCancel(user._id)}>
                                                                <i className="fa-solid fa-close"></i>
                                                            </button>
                                                        </>
                                                    ) : (
                                                            <div></div>
                                                        )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                                <tr>
                                                    <td colSpan="5">No data available.</td>
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
                    <div className="footer-txt">
            *Carrier, Plan Type and Policy Number for renewing 1/1/2025 insureds may reflect 2024 policy information.  We are working to update with 2025 plan year information as it becomes available.
            </div>
                </div>
          
            </div>
         
            <div className="footer-parent">
                {/* <div className="footer section">
          <div className='footer-align'>
            <Link to="/">

              <img src="/images/hpf-logo.png" alt="" />
            </Link>


            <div className="privacy-terms-txt">
              <p>© Copyright 2024 - Proprietary and Confidential Property of  <Link to="/" className='green-txt'>HealthPlan Freedom, Inc.</Link> </p>
              <div> <Link to="/privacypolicy">Privacy Policy </Link>| <Link to="/clienttermandconditions"> Terms of Use </Link></div></div>


          </div>
        </div> */}
            </div>
        </>

    )

}

export default ClientPortal
