import React, { useEffect, useState } from 'react';
import "./UserDetails.css"
import { useParams, Link } from 'react-router-dom';
import { baseurl } from '../../constant/enviroment/enviroment'; // Import your base URL
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Cookies from 'js-cookie';



const UserDetails = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);
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


    useEffect(() => {
        // Delay the printing action by 3000 milliseconds (3 seconds)
        const delayPrint = setTimeout(() => {
          // Perform any necessary actions before printing
          // ...
    
          // Trigger automatic printing
          window.print();
        }, 3000);
    
        return () => clearTimeout(delayPrint); // Clear the timeout if the component is unmounted before the timeout is reached
      }, []);


    const specialDiseases = [
        "HIV",
        "Diabetes",
        "Congestive Heart Failure",
        "Hypertension",
        "Coronary Artery Disease",
        "Cancer",
        "Arthritis",
        "Asthma",
        "COPD"
    ];

    useEffect(() => {
        // Fetch user details based on userId
        const fetchUserDetails = async () => {
            try {
                const token = Cookies.get('session');
                const csrfTokenstate = await getCsrfToken(); // Wait for CSRF token
                if (!csrfTokenstate) {
                  console.error("CSRF token is missing.");
                  return;
                }
        
                const response = await fetch(`${baseurl}/admin/get-user-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                        'xsrf-token': csrfTokenstate,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ _id: userId }),
                });


                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const userData = await response.json();

                if (userData.success) {
                    setUserDetails(userData.data);
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (!userDetails) {
        return <p>Loading...</p>; // Add a loading indicator while fetching data
    }

    if (userDetails.error) {
        return <p>Error: {userDetails.error}</p>; // Display an error message if there's an error
    }

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


    // Render user details
    return (
        <>

                
        {/* <div className ="download_btn-2">
        <button className="btndownload" onClick={handlePrint}>Download Now</button>
        </div> */}
        <div className='Enr-form'>
      <div className="form-data">
     
        <div className='logo'>
      <Link to="/">
          <img src="/images/big-hpf-logo.png" alt="logo" />
        </Link>
        
        </div>
        
        <h1 className="enr-head">Enrollment Authorization Form</h1>
        <div className="form-row">
            
            <div className="form-box-1">
                <div>
                    <label>Full Legal Name:</label>
                    <p className="form-data-para">{userDetails.fullname}</p>
                </div>
            </div>
            <div className="form-box-1">
                <div>
                    <label>Phone Number:</label>
                    <p className="form-data-para">{userDetails.phonenumber}</p>
                </div>
            </div>
            
            <div className="form-box-1">
                <div>
                    <label>Email Address</label>
                    <p className="form-data-para">{userDetails.emailid}</p>
                </div>
            </div>
        </div>
        <div className="form-row">
        <div className="form-box-1">
                <div>
                    <label>Date of Birth:</label>
                    <p className="form-data-para">{userDetails.dob}</p>
                </div>
            </div>
            <div className="form-box-1">
                <div>
                    <label>SSN:</label>
                    <p className="form-data-para">{userDetails.ssn}</p>
                </div>
            </div>
            
            <div className="form-box-1">
                <div>
                    <label>Gender:</label>
                    <p className="form-data-para">{userDetails.gender}</p>
                </div>
            </div>
        </div>
        <div className="form-row">
        <div className="form-box-1">
                <div>
                    <label>Street Address:</label>
                    <p className="form-data-para">{userDetails.address}</p>
                </div>
            </div>
            <div className="form-box-1">
                <div>
                    <label>City:</label>
                    <p className="form-data-para">{userDetails.city}</p>
                </div>
            </div>
            
            <div className="form-box-1">
                <div>
                    <label>Zip Code:</label>
                    <p className="form-data-para">{userDetails.zipcode}</p>
                </div>
            </div>
        </div>
        <div className="form-row">
        <div className="form-box-1">
                <div>
                    <label>State:</label>
                    <p className="form-data-para">{userDetails.state}</p>
                </div>
            </div>
            <div className="form-box-1">
                <div>
                    <label>Select County:</label>
                    <p className="form-data-para">{userDetails.county}</p>
                </div>
            </div>
          
            <div className="form-box-1">
                <div>
                    <label>Marital Status:</label>
                    <p className="form-data-para">{userDetails.maritalstatus}</p>
                </div>
            </div>
        </div>
        <div className="form-row">
            <div className="form-box-1">
                <div>
                    <label>Projected Income:</label>
                    <p className="form-data-para">{userDetails.income}</p>
                </div>
            </div>
            <div className="form-box-1">
                <div>
                    <label>Facility Code:</label>
                    <p className="form-data-para">{userDetails.facilty_code}</p>
                </div>
            </div>
          
        </div>
       
        
        {/* <h3 className="sec-header-txt med-pdf">Ongoing Medical Conditions :</h3> */}
        {/* <div className="form-row-disease">
        {specialDiseases.map((disease) => (
                                                    <div className="disease" key={disease}>

                                                        <p data-label={disease}>
                                                            {userDetails.special_disease && userDetails.special_disease.includes(disease) ? (
                                                                <i style={{ color: "#0075ff" }} className="fa-solid fa-square-check"></i>
                                                            ) : (
                                                                    <i style={{ color: "#000" }} className="fa-regular fa-square"></i>
                                                                   
                                                                )}
                                                        </p>
                                                        <p >{disease}</p>
                                                    </div>
                                                ))}
        </div> */}
        {/* <h3 className="sec-header-txt med-pdf">Medications :</h3> */}
        {/* <p className="med-txt-pdf">Do you take any medications currently? <strong>{userDetails.takesMedication}</strong>
        </p> */}
        {/* <div className="form-row med-table-pdf">
            <div className="disease-table">
                <table className="disease-data">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Name</th>
                            <th>Dosage (ml/mg)</th>
                        </tr>
                    </thead>
                    <tbody>

                                            {userDetails.medication && userDetails.medication.length > 0 ? (
                                                userDetails.medication.map((med, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td data-label="Sr. No.">Medication #{index + 1}:</td>
                                                            <td data-label="Name">{med.name}</td>
                                                            <td data-label="Dosage (ml/mg)">{med.dosage} (ml/mg)</td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                    <tr>

                                                        <td data-label="Medication Name">1</td>
                                                        <td data-label="Medication Name">No medication</td>
                                                        <td data-label="Dosage">No dosage</td>
                                                    </tr>
                                                )}
                                       </tbody>
                </table>
            </div>
        </div> */}
        <h3 className="sec-header-txt">Additional Information:</h3>
        <p id="notes">{userDetails.notes}</p>
        <p className="text-area">{userDetails.notes}</p>
        <div className="terms">
        <h3 className="sec-header-txt">Attestation / Signature</h3>
        <p>By signing and submitting this form I agree to the following:</p>
        <div className="term-row">
            <div>
                <input type="checkbox"  className="check" defaultChecked />
            </div>
            <div>
                <p>I authorize HealthPlan Freedom to enroll me in a health insurance plan if, and only if, I qualify for a $0 premium plan through the ACA.</p>
            </div>
        </div>
        <div className="term-row">
            <div>
                <input type="checkbox" name="" className="check" id="" defaultChecked />
            </div>
            <div>
                <p>
                    I attest that all information provided in this form is accurate.</p>
            </div>
        </div>
        <div className="term-row">
            <div>
                <input type="checkbox" name="" className="check" id="" defaultChecked />
            </div>
            <div>
                <p>
                    I grant HealthPlan Freedom authorization to maintain the agent of record until I withdraw my authorization in writing. I also rescind and or revoke the agent of record for any other agent, including but not limited to: <span className="limited_txt">{userDetails.txt_label_3 ? userDetails.txt_label_3 : '___________________'}</span></p>
            </div>
        </div>
        <div className="term-row">
            <div>
                <input type="checkbox" name="" className="check" id="" defaultChecked />
            </div>
            <div>
                <p>
                    I authorize the Correctional Facility and their designated medical service provider to share any necessary information about me required by HealthPlan Freedom to complete my application for health insurance and coordinate any necessary care upon enrollment.I authorize HealthPlan Freedom, Inc  to share any health insurance policy information with the Correctional Facility and their medical service provider.</p>
            </div>
        </div>
       
    </div>
    <div className="box-sig box-sig-pdf-aor">
                                    <div className="b15 aor">
                                        <p>
                                            <label htmlFor='signature'>Electronic Signature :</label>
                                        </p>
                                        <p className="enrollment-sign-aor">
  {userDetails.e_sign && userDetails.e_sign.startsWith("data:image/png;base64,") ? (
    <img
      src={userDetails.e_sign}
      alt="Signature"
      style={{ width: '200px', height: 'auto' }}
    />
  ) : (
    userDetails.e_sign // Display the contents as text if it doesn't start with the specified string
  )}
</p>
                                        
                                    </div>


                                    <div className="b15 aor">
                                        <p>
                                            <label htmlFor='sign-date'>Signature Date :</label>
                                        </p>

                                        <p className="enrollment-date-aor">{userDetails.submission_date}</p>
                                    </div>
                                    <div className="b15 aor aor-ip-createdAt">
                                        <p className="txt_size">
                                           <label htmlFor='ip'><span className='aor-ip-print'>Responce captured from</span> IP address : {userDetails.ip_address}</label>
                                        </p>
                                        {/* <p className="enrollment-ip">{userDetails.ip_address}</p> */}
                                    </div>
                                    <div className="b15 aor aor-ip-createdAt">
                                        <p className="txt_size">
                                            <label htmlFor='ip'>Timestamp : {formatDatee(userDetails.createdAt)}</label>
                                        </p>
                                        {/* <p className="enrollment-ip">{userDetails.ip_address}</p> */}
                                    </div>

                                </div>
   

	
    {/* <div className="form-row">
        <button className="submit-btn" type="submit">Submit</button>
        <button onClick={() => window.print()} className='print-page'>Download Now</button>
    </div> */}
      </div>
  </div>
    </>
    );
};



export default UserDetails;
