import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { baseurl } from "../../constant/enviroment/enviroment";
import HeaderTwo from "../../layouts/Header2/HeaderTwo";
import "./FileUpload.css";
import Footer from "../../layouts/Footer/Footer";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [facilityCode, setFacilityCode] = useState(""); // Keep track of the selected facility code
  const [idUser, setIdUser] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  

  const fileInputRef = useRef(null);

    const getCsrfToken = async () => {
      try {
        const response = await fetch(baseurl + '/csrf-token', {
          method: 'GET',
          //credentials: 'include', // Include cookies for CSRF protection
        });
        const data = await response.json();
        // setCsrfTokenState(data.csrfToken); // Store the CSRF token in your state
        return data.csrfToken; // Return CSRF token for later use
      } catch (error) {
        console.error("Error fetching CSRF token", error);
        return null;
      }
    };

  // Fetch data from API (for facility codes)
  const fetchData1 = async () => {
    try {
   // Ensure CSRF token is fetched and set
   const csrfTokenState = await getCsrfToken(); // Wait for CSRF token
   if (!csrfTokenState) {
            console.error("CSRF token is missing.");
            return;
          }
          
      const response = await fetch(baseurl + "/admin/get-all-facilityitems", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get('session'),
          'xsrf-token': csrfTokenState,
        },
        credentials: 'include',  
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const apiData = await response.json();
      //console.log("API Data:", apiData);
  
      const defaultIDuser = apiData.facility_id; // Get the first facility code
      console.log("setIdUser:", apiData.facility_id);
      const defaultFacilityCode = apiData.facility_code[0]; // Get the first facility code
      setFacilityCode(defaultFacilityCode); // Set it as the default facility code
      setIdUser(defaultIDuser); // Make sure this is the correct ID
  
      // Call handleFetchFiles only if idUser and defaultFacilityCode are available
      if (defaultIDuser && defaultFacilityCode) {
        handleFetchFiles(defaultFacilityCode);
      }
  
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };
 


  // Fetch files for selected facility code
  const handleFetchFiles = async (facilityCode) => {
    if (!facilityCode || !idUser) {
      return; // Do nothing if no facility code or user ID is available
    }
    
    setLoading(true);
    
    try {
      // Construct the folder name correctly by including the user ID
      const folderName = `${idUser}/${facilityCode}`; // Use idUser to create the folder name
  
      console.log("facilityCode:", facilityCode);
      console.log("folderName:", folderName); // Log to verify folderName
      console.log("userIddata:", idUser); // Log userId data
  
      const response = await axios.get(`${baseurl}/api/list-files`, {
        params: { folderName }, // Send the constructed folder name
      });
  
      //console.log("File fetch response:", response.data);
  
      if (response.data.success) {
        setFiles(response.data.data);
        setError(null);
      } else {
        setError("Failed to retrieve files");
      }
    } catch (err) {
      setError("Error fetching files");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      Swal.fire({
        icon: '',
        title: '',
        text: "Please choose a file that you want to upload into the share drive.",
        position: 'top',
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);

    const folderName = `${idUser}/${facilityCode}`;
    formData.append("folderName", folderName);  // Modify folderName to include idUser and facilityCode

    try {
      setUploading(true);  // Set uploading state to true before file upload
      const csrfTokenstate = await getCsrfToken();
      if (!csrfTokenstate) {
       console.error("CSRF token is missing.");
       return;
     }

      const response = await axios.post(`${baseurl}/api/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: Cookies.get('session'),
          'xsrf-token': csrfTokenstate, 
               
        },
        withCredentials: true,
      });
console.log("response --->",response)
      Swal.fire({
        icon: '',
        title: '',
        text: "Thank you, your file has been uploaded successfully.",
        position: 'top',
      });

      handleFetchFiles(facilityCode);  // Refresh the files for the selected facility

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);  // Set uploading state to false after the process finishes
    }
  };

  useEffect(() => {
    fetchData1(); // Fetch the facility data and files on component mount
  }, []); // Empty array to run only on mount
  
  useEffect(() => {
    if (idUser && facilityCode) {
      handleFetchFiles(facilityCode); // Fetch files whenever idUser or facilityCode is updated
    }
  }, [idUser, facilityCode]); // Dependencies: run this effect when idUser or facilityCode changes
  
  return (
    <>
      <HeaderTwo />
      <div>
        <div className="content">
          <div className="drive-upload">
            <p className="para">
              Please click on the choose file link below to identify the file that you want to upload into the share drive.
            </p>
            <div className="upload">
              <p>Browse Files on Directory</p>
              <form onSubmit={handleSubmit} className="form-inpt">
                <input
                  type="file"
                  accept="*/*"
                  ref={fileInputRef}
                  className="input-upload"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit" className="custom-upload-button">
                  Upload File
                </button>
              </form>
            </div>
          </div>

          <div className="gdrive-table">
            <h1>File Upload History</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {loading ? (
              <p>Loading files...</p>
            ) : files.length > 0 ? (
              <div className="table-container1">
                <table>
                  <thead>
                    <tr>
                    <th>Sr. No.</th>
                      <th>File Name</th>
                      <th>Date</th>
                      <th>Size</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file ,index) => (
                      <tr key={file.Key}>
                          <td>{index + 1}</td>
                        <td>{file.FileName}</td>
                        <td>{new Date(file.LastModified).toLocaleDateString()}</td>
                        <td>{(file.Size / (1024 * 1024)).toFixed(2)} MB</td>
                        <td>
                          <a href={file.DownloadUrl} download={file.FileName}>
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No files uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default FileUpload;
