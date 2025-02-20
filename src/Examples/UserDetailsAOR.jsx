
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { baseurl } from '../constant/enviroment/enviroment'; // Import your base URL
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Cookies from 'js-cookie';


const UserDetails = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);

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
    
 //////////////////////////////////////////////////////
 const handlePrint = async () => {
    const pdf = new jsPDF('p', 'pt', 'a4');

    // Get the HTML content of the section
    const printSection = document.querySelector('.enrollment-form');

    if (printSection) {
      // Use html2canvas to convert the HTML to an image
      const canvas = await html2canvas(printSection);

      // Calculate the aspect ratio of the content
      const aspectRatio = canvas.width / canvas.height;

      // Calculate the width and height for the image on the PDF
      const pdfWidth = pdf.internal.pageSize.width;
      const pdfHeight = pdfWidth / aspectRatio;

      // Add the image to the PDF, keeping the original size and positioning
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save('AOR_pdf_{userDetails.fullname}.pdf');
    } else {
      console.error('Print section not found');
    }
  };

/////////////////////////////////////////////////

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
                // if (!csrfTokenState) {
                //     console.error("CSRF token is missing.");
                //     return;
                //   }
                  
                const token = Cookies.get('session');
                const response = await fetch(`${baseurl}/admin/get-user-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                        //'xsrf-token': csrfTokenState, 
                    },
                    //credentials: 'include',
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

                <div className =" download_btn">
                <button className="btndownload" onClick={handlePrint}>Download Now</button>
                </div>

            <section className=' enrollment-form section' >
            <div className="box-row-lozxcgo">
                                        
                                       
                                        </div>
        

                <div className="enroll-header-pdf">
                    <Link to="/">
                        <img src="/images/big-hpf-logo.png" alt="logo" />
                    </Link>
                  </div>
                <div className="form-section">

                    <section>
                        <form >

                            <div className="registration-pdf">





                                <div className="box1">
                                    <div className="attestation" >
                                        <h3 className='sec-header-txt'> Attestation / Signature	</h3>

                                    </div>
                                    <div className="box-row-lozxcgo">
                                        
                                       
                                        </div>
                                    <p className="read1">By signing and submitting this form I agree to the following:</p>


                                    <div className="read aor_lbl">
                                        <div className="attes-checkbox">
                                        <i style={{ color: "#0075ff" }} className="fa-solid fa-square-check"></i>
                                        </div>
                                        <label htmlFor="checkbox3">I grant HealthPlan Freedom authorization to maintain the agent of record until I withdraw my authorization in writing.  I also rescind and or revoke the agent of record for any other agent, including but not limited to: <span className="limited_txt">{userDetails.txt_label_3 ? userDetails.txt_label_3 : '___________________'}</span></label> </div>

                                </div>

                                <div className="box-sig box-sig-pdf-aor">
                                    <div className="b15 aor">
                                        <p>
                                            <label htmlFor='signature'>Electronic Signature :</label>
                                        </p>
                                        <p className="enrollment-sign-aor">
                                        <img src={`${userDetails.e_sign}`}
                                             alt="Signature"
                                             style={{ width: '200px', height: 'auto' }}
                                            />
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
                                            <label htmlFor='ip'>Responce captured from IP address : {userDetails.ip_address}</label>
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

 

                            </div>

                        </form>

                    </section>

                </div>
            </section>
            {/* <div className ="download_btn-2">
            <button className="btndownload" onClick={handlePrint}>Download Now</button>
            </div> */}

        </>
    );
};



export default UserDetails;
