import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { baseurl } from "../../constant/enviroment/enviroment"; // Ensure this is correctly set
import HeaderTwo from '../../layouts/Header2/HeaderTwo';
import Footer from "../../layouts/Footer/Footer";
import Cookies from 'js-cookie';

const CSVFileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]); // State for upload history
  const [loading, setLoading] = useState(false); // For loading state when fetching upload history
  const [uploading, setUploading] = useState(false); // For file upload
  const fileInputRef = useRef(null);

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
 // Define fetchUploadHistory outside useEffect
const fetchUploadHistory = async () => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${baseurl}/api/csvuploadhistory`,
      {
        headers: {
          Authorization: Cookies.get('session'),
    
        },
  
      }
    );
    if (response.data && Array.isArray(response.data.data)) {
      setUploadHistory(response.data.data);
    } else {
      console.error("Upload history is not an array or is undefined");
    }
  } catch (error) {
    console.error("Error fetching upload history:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error Fetching History',
      text: "There was a problem loading the upload history.",
      position: 'top',
    });
  } finally {
    setLoading(false);
  }
};


// Fetch upload history on page load
useEffect(() => {
  fetchUploadHistory();
}, []); // Empty dependency array means this runs once when the component mounts


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
        Swal.fire({
            icon: 'warning',
            title: 'No File Selected',
            text: "Please choose a CSV file to upload.",
            position: 'top',
        });
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Log the FormData content to ensure the file is being sent
    for (let [key, value] of formData.entries()) {
        //console.log(key, value);
    }

    try {
        setUploading(true);
       if (!csrfTokenState) {
            console.error("CSRF token is missing.");
            return;
          }
          
        const response = await axios.post(
            `${baseurl}/api/csvupload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: Cookies.get('session'),
                    'xsrf-token': csrfTokenState,
                },
                withCredentials: true, 
            }
        );

        // Log the full response to verify the structure
        //console.log("API Response:", response); // Logs the entire response object to check its structure

        const { duplicateMessages = [], message = "", success = true } = response.data;

        //console.log("Response Data:", response.data); // Check response structure in detail

        // Check if the response indicates failure
        if (!success) {
            //console.log("Upload failed with message:", message); // Check the failure message
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: message || "An error occurred during the upload.",
                position: 'top',
            });
            return;  // Stop further execution if there is an error
        }

        // Handle successful upload
        if (duplicateMessages.length === 0) {
            Swal.fire({
                icon: 'success',
                title: 'Upload Successful',
                text: "Your CSV file has been uploaded successfully.",
                position: 'top',
            }).then(() => {
                fetchUploadHistory(); // Refresh history
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Upload Successful',
                text: `Your CSV file has been uploaded partially.\n\nHowever, some duplicates were skipped:\n${duplicateMessages.join('\n')}`,
                position: 'top',
            }).then(() => {
                fetchUploadHistory(); // Refresh history
            });
        }

        // Reset file input and state
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFile(null);

    } catch (error) {
        // Log the error to see what went wrong
        console.error("Error uploading file:", error);

        if (error.response) {
            //console.log("Error Response:", error.response); // Check if error contains the response object
            const errorMessage = error.response.data.message || error.response.data.join('\n') || error.message;
            Swal.fire({
                icon: 'error',
                title: "Upload failed!",
                text: errorMessage,
                position: 'top',
            });
        } else {
            // Handle non-response errors (network issues, etc.)
            Swal.fire({
                icon: 'error',
                title: "Upload failed!",
                text: error.message,
                position: 'top',
            });
        }

        // Reset file input and state
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFile(null);

    } finally {
        setUploading(false);
    }
};



  return (
    <>
      <HeaderTwo />
      <div className="csv-drive-upload content">
        <h1>Upload CSV File</h1>
        <div className="upload">
          <p>Browse CSV Files to upload</p>
          <form onSubmit={handleSubmit} className="form-inpt">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              className="input-upload"
              onChange={handleFileChange}
            />
            <button type="submit" className="custom-upload-button">
              Upload File
            </button>
          </form>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {uploading && (
          <div className="loader">
            <div className="spinner"></div>
            Please wait while we are uploading your file.
          </div>
        )}

        {/* Show loading spinner while fetching history */}
        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            Loading upload history...
          </div>
        )}

        {/* Upload History Table */}
        {uploadHistory.length > 0 && !loading && (
  
  
  <div className="upload-history">
    <h2>Upload History</h2>
    <div className="csv-table">
    <table>
      <thead>
        <tr>
          <th>Sr. No.</th>
          <th>File Name</th>
          <th>Upload Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {uploadHistory.map((history, index) => (
          <tr key={index}>
            <td>{index + 1}</td> {/* Use the correct property name here */}
            <td>{history.filename}</td> {/* Use the correct property name here */}
            <td>{new Date(history.uploadDate).toLocaleString()}</td>
            <td>{history.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
)}
        {uploadHistory.length === 0 && !loading && (
          <p>No upload history available yet.</p>
        )}
      </div>
      <div className="footer-parent1">
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default CSVFileUpload;
