import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../../constant/enviroment/enviroment";
import HeaderTwo from '../../layouts/Header2/HeaderTwo'

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [facilityName, setFacilityName] = useState('');
  const [facilityCode, setFacilityCode] = useState('');
  const [idUser, setIdUser] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [folderName, setFolderName] = useState('');
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
    
   
  

  // Fetch data from API
  
  const fetchData1 = async () => {
    
    try {
      if (!csrfTokenState) {
       console.error("CSRF token is missing.");
       return;
     }
      
      const response = await fetch(baseurl + `/admin/get-all-facilityitems`, {
        
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
        setFacilityName(apiData.facility_name);
        setIdUser(apiData.facility_id);
      } else {
        console.error('Invalid API response:', apiData);
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData1();
  }, []); // Empty dependency array ensures the effect runs once after the first render

  // Fetch files from the idUser folder
  const handleFetchFiles = async () => {
    try {
      if (!idUser) {
        setError('Facility ID not loaded yet');
        return;
      }
  
      const response = await axios.get(`${baseurl}/api/list-files`, {
        params: { folderName: idUser }
      });
  
      //console.log(response.data); // Log response to check its structure
  
      if (response.data.success) {
        setFiles(response.data.data);
        setError(null);
      } else {
        setError('Failed to retrieve files');
      }
    } catch (err) {
      setError('Error fetching files');
      console.error(err);
    }
  };

 useEffect(() => {
  if (idUser) {
    handleFetchFiles();
  }
}, [idUser]);

useEffect(() => {
  //console.log(files); // Log files to ensure it's populated correctly
}, [files]);

const handleListFiles = async () => {
  try {
    const response = await axios.get(`${baseurl}/api/list-files`, {
      params: { folderName } // Pass folderName as a query parameter
    });

    if (response.data.success) {
      setFiles(response.data.data);
      setError(null);
    } else {
      setError('Failed to retrieve files');
    }
  } catch (err) {
    setError('Error retrieving files');
    console.error(err);
  }
};



  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first");
      return;
    }

    if (!idUser) {
      alert("Facility ID not loaded yet");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    formData.append("folderName", idUser); // Use facility_id as folder name

    try {
      if (!csrfTokenState) {
        console.error("CSRF token is missing.");
        return;
      }
      const response = await axios.post(
        `${baseurl}/api/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: Cookies.get('session'), // Include auth token if needed
            'xsrf-token': csrfTokenState, 
          },
          withCredentials: true,
        }
      );
      //console.log("File uploaded successfully:", response.data);
      alert("File uploaded successfully");
      handleFetchFiles(); // Refresh file list after upload
    } catch (error) {
      const errorMessage = error.response ? JSON.stringify(error.response.data, null, 2) : error.message;
      console.error("Error uploading file:", errorMessage);
      alert(`Error uploading file: ${errorMessage}`);
    }
  };

  // const handleGetDownloadUrl = async () => {
  //   try {
  //     const response = await axios.get(`${baseurl}/api/download-file`, {
  //       params: { fileName } // Ensure fileName is passed as a query parameter
  //     });
  //     if (response.data.success) {
  //       setDownloadUrl(response.data.data.url);
  //       setFolderName(response.data.data.folderName);
  //       setError(null);
  //     } else {
  //       setError('Failed to retrieve download URL');
  //     }
  //   } catch (err) {
  //     setError('Error retrieving download URL');
  //     console.error(err);
  //   }
  // };


  return (
    <>
    <HeaderTwo />
      <div>

      <div className="search-header">
            <div className="flt_name">
              <p>Facilty Name:<span>{facilityName}</span></p>
              <p>Facility Code:<span>{facilityCode}</span></p>
              <p>ID:<span>{idUser}</span></p>

            </div>

            <div className="dash-top">

            </div>

            
          </div>
        <form onSubmit={handleSubmit}>
          <input 
            type="file" 
            accept="*/*" 
            onChange={handleFileChange} 
          />
          <button type="submit">Upload File</button>
        </form>
      </div>


      <div>
      {error && <div className="error">{error}</div>}
      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>

      {/* <div>


      <h1>Download File</h1>
      
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Enter file name"
      />
      <button onClick={handleGetDownloadUrl}>Get Download URL</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {downloadUrl && (
        <div>
          <p><strong>Folder Name:</strong> {folderName}</p>
          <p>Click the link below to download the file:</p>
          <a href={downloadUrl} download={fileName}>
            Download File
          </a>
        </div>
      )}
    </div> */}

<div>

      <h1>List and Download Files</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {files.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Last Modified Date</th>
              <th>Size</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.Key}>
                <td>{file.FileName}</td>
                <td>{new Date(file.LastModified).toLocaleString()}</td>
                <td>{file.Size} bytes</td>
                <td>
                  <a href={file.DownloadUrl} download>
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No files available.</p>
      )}
    </div>
    </>
  );
};

export default FileUpload;
