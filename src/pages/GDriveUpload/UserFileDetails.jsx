import { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../constant/enviroment/enviroment";
import HeaderTwo from "../../layouts/Header2/HeaderTwo";
import "./FileUpload.css";
import Footer from "../../layouts/Footer/Footer";
import Cookies from 'js-cookie';

const UserFileDetails = () => {
  const [facilityManagers, setFacilityManagers] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [error, setError] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState('lastModified'); // Default sort criteria
  const [sortDirection, setSortDirection] = useState(''); // Default sort direction
  const [loading, setLoading] = useState(true); // Loader state
  const [data, setData] = useState([]);
  const [facilityCodes, setFacilityCodes] = useState([]);
  const itemsPerPage = 1000;
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

  

  const fetchFacilityManagers = async () => {
    const apiUrl = `${baseurl}/admin/getallfacility-manager`;
    const token = Cookies.get('session');

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });

      if (response.ok) {
        const result = await response.json();
        //console.log("result",result);
        if (result.success && result.data.length > 0) {
          setFacilityManagers(result.data);
          handleFetchFiles(result.data);
        } else {
          setError("No facility managers found");
        }
      } else {
        setError('Failed to fetch facility managers');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  const handleFetchFiles = async (managers) => {
    try {
    
      const fileFetchPromises = managers.map(async (manager) => {
        if (!manager._id) {
          setError("Facility ID not loaded yet");
          return [];
        }
  
        try {
          // Fetch files for the current manager
          const response = await axios.get(`${baseurl}/api/list-files`, {
            params: { folderName: manager._id },
          });
  
          if (response.data.success) {
            // Map over the files to fetch status and match facility codes
            const filesWithStatusPromises = response.data.data.map(async (file) => {
              const status = await fetchFileStatus(file.FileName);
              
              
              //console.log("file.ChildFolder----------", file.ChildFolder);
              //console.log("file.FacilityName----------",file.FacilityName);
  
              // Return an object with the file data and matched facility details
              return {
                facilityCode: file.ChildFolder,
                fileName: file.FileName,
                lastModified: new Date(file.LastModified), // Ensure this is a Date object
                downloadUrl: file.DownloadUrl,
                childFolder: file.ChildFolder,
                facilityName: file.FacilityName ?file.FacilityName : "Not Matched" ,
                downloaded: status,

              };
            });
  
            // Wait for all file status fetches to complete
            return await Promise.all(filesWithStatusPromises);
          } else {
            setError("Failed to retrieve files for facility: " + manager.facility_name);
            return [];
          }
        } catch (err) {
          setError("Error fetching files for manager: " + err.message);
          return [];
        }
      });
  
      // Wait for all manager file fetches to complete
      const results = await Promise.all(fileFetchPromises);
  
      // Flatten the array of files from all managers
      const allFiles = results.flat();
  
      // Sort files by `lastModified` in descending order (most recent first)
      allFiles.sort((a, b) => {
        // Ensure correct sorting by Date object comparison
        return b.lastModified - a.lastModified;
      });
  
      // Debugging: Log the sorted files to check the sorting order
      //console.log("Sorted files:", allFiles);
  
      // Update state with the fetched and sorted files
      setCombinedData(allFiles);
      setError(null);
    } catch (err) {
      setError("Error fetching files: " + err.message);
    } finally {
      setLoading(false); // Hide loader after data fetching
    }
  };
  

  const sortData = () => {
    const sortedData = [...combinedData].sort((a, b) => {
      if (a[sortCriteria] < b[sortCriteria]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortCriteria] > b[sortCriteria]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setCombinedData(sortedData);
  };


  const fetchFileStatus = async (fileName) => {
    try {
      const response = await axios.get(`${baseurl}/api/get-file-status`, {
        params: { fileName }
      });
      if (response.data.success) {
        return response.data.data.downloaded; // Correct key
      } else {
        return false; // Default to false if API call fails
      }
    } catch (error) {
      return false; // Default to false if an error occurs
    }
  };

  const updateDownloadStatus = async (fileName, status) => {
    try {
      // Send POST request with headers and body properly configured
      await axios.post(
        `${baseurl}/api/download-file-status`,
        { fileName, status },
        {
          headers: {
            'xsrf-token': csrfTokenState, // CSRF token header
          },
          withCredentials: true, // Use `withCredentials` instead of `credentials`
        }
      );
    } catch (error) {
      // Handle error silently or show a user-friendly message if needed
      console.error("Error updating download status:", error);
    }
  };
  
  const handleFileDownload = async (fileName) => {
    try {
      // Save the downloaded state in localStorage

      //localStorage.setItem(`downloaded_${fileName}`, JSON.stringify(true));
      Cookies.set(`downloaded_${fileName}`, JSON.stringify(true)); // Optional: Set expiration (e.g., 7 days)


      // Update the status on the server
      await updateDownloadStatus(fileName, true);

      // Update the flag for the file in the component state
      setCombinedData((prevData) =>
        prevData.map((file) =>
          file.fileName === fileName ? { ...file, downloaded: true } : file
        )
      );
    } catch (error) {
      // Handle error silently or show a user-friendly message if needed
    }
  };

  const filteredData = combinedData.filter((item) => {
    const regex = new RegExp(escapeRegExp(filterCriteria), 'i');
    return (
      regex.test(item.facilityCode) ||
      regex.test(item.facilityName) ||
      regex.test(item.fileName) ||
      regex.test(item.lastModified)
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchFacilityManagers();
    sortData();
  }, [sortCriteria, sortDirection]);

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return (
    <>
      <HeaderTwo />
      <div className="content">
        <div className="gdrive-table">
          <div className="searchfor">
            <h1>All users uploaded data </h1>
            <input
              className="search"
              type="text"
              placeholder="Search.... "
              value={filterCriteria}
              onChange={(e) => setFilterCriteria(e.target.value)}
            />
          </div>

          {loading && (
            <div className="loader">
              <div className="spinner">
              </div> Please wait... while we are loading files.
            </div>
          )}
          {error && <p>{error}</p>}
          {!loading && !error && paginatedData.length === 0 && <p>No files available.</p>}
          {paginatedData.length > 0 && (
  <>
    <div className="table-container">
      <table className="gdrive-data">
        <thead>
          <tr>
            {/* <th>Sr. No. </th> */}
            <th onClick={() => { setSortCriteria('fileName'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
              Uploaded File Name{' '}
              {sortCriteria === 'fileName' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => { setSortCriteria('lastModified'); setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc'); }}>
              Date Uploaded{' '}
              {sortCriteria === 'lastModified' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => { setSortCriteria('facilityCode'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
              Client Code{' '}
              {sortCriteria === 'facilityCode' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
             <th onClick={() => { setSortCriteria('facilityName'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                Client Name{' '}
                {sortCriteria === 'facilityName' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th> 
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              {/* <td>{index + 1}</td> */}
              <td>
                <a
                  href={item.downloadUrl}
                  download
                  onClick={() => handleFileDownload(item.fileName)}
                  style={{ fontWeight: item.downloaded ? 'normal' : 'bold' }}
                >
                  {item.fileName}
                </a>
              </td>
              <td>
                {/* Format the lastModified date */}
                {new Date(item.lastModified).toLocaleString()}
              </td>
              <td>{item.facilityCode}</td>
               <td>{item.facilityName}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  </>
)}

        </div>
      </div>
      {/* <Footer /> */}
    </>

  );
};
export default UserFileDetails;
