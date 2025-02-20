
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
    const pdf = new jsPDF('p', 'pt','a4');

    // Get the HTML content of the section
    const printSection = document.querySelector('.enrollment-form');

    if (printSection) {
      // Use html2canvas to convert the HTML to an image
      const canvas = await html2canvas(printSection);

      // Add the image to the PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

      // Save the PDF
      pdf.save('my_pdf_document.pdf');
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
                const token = Cookies.get('session');
                // if (!csrfTokenState) {
                //     console.error("CSRF token is missing.");
                //     return;
                //   }
                const response = await fetch(`${baseurl}/admin/get-user-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                        //'xsrf-token': csrfTokenState,
                    },
                    body: JSON.stringify({ _id: userId }),
                    //credentials: 'include',
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


   
    // Render user details
    return (
        <>

                <div className =" download_btn">
                <button className="btndownload" onClick={handlePrint}>Download Now</button>
                </div>

            <section className=' enrollment-form section' >
                <div className="enroll-header-pdf">
                    <Link to="/">
                        <img src="/images/big-hpf-logo.png" alt="logo" />
                    </Link>
                  </div>
                <div className="form-section">
                    <section className="box">
                        <div  className="heading-pdf">
                            <h2>Authorization Enrollment Form Submission Details</h2>
                        </div>
                    </section>
                    <section>
                        <form >

                            <div className="registration-pdf">
                                <div className="boxs">
                                    <div className="b1">
                                        <p>
                                            <label htmlFor='name'>Applicant Full Legal Name*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.fullname}</p>
                                    </div>

                                    <div className="b2">
                                        <p>
                                            <label htmlFor='number'>Phone Number*</label>

                                        </p>
                                        <p className="enrollment-data">{userDetails.phonenumber}</p>

                                    </div>
                                    <div className="b3">
                                        <p>
                                            <label htmlFor='email'>Email Address</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.emailid}</p>
                                    </div>
                                </div>

                                <div className="boxs">
                                    <div className="b4">
                                        <p>
                                            <label htmlFor='date'>Date of Birth*</label>
                                        </p>

                                        <p className="enrollment-data">{userDetails.dob}</p>
                                    </div>
                                    <div className="b5">
                                        <p>
                                            <label htmlFor='SSN'>SSN*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.ssn}</p>
                                    </div>

                                    <div className="b6">
                                        <p>
                                            <label htmlFor='gender'>Gender*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.gender}</p>
                                    </div>
                                </div>

                                <div className="boxs">
                                <div className="b10">
                                        <p>
                                            <label htmlFor='address'>Street Address*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.address}</p>
                                    </div>

                                    <div className="b11">
                                        <p>
                                            <label htmlFor='city'>City*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.city}</p>
                                    </div>
                                    <div className="b7">
                                        <p>
                                            <label htmlFor='zipcode'>Zip Code*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.zipcode}</p>

                                    </div>
                                    

                                </div>

                                <div className="boxs">
                                <div className="b12">
                                        <p>
                                            <label htmlFor='state'>State*</label>
                                        </p>

                                        <p className="enrollment-data">{userDetails.state}</p>

                                    </div>
                                    <div className="b13">
                                        <p className="usStateinputs">
                                            <label>Select County*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.county}</p>
                                    </div>

                                    <div className="b9">
                                        <p>
                                            <label htmlFor='marital'>Marital Status*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.maritalstatus}</p>
                                    </div>
                                </div>
                                <div className="twoboxs">
                                    <div className="b8">
                                        <p>
                                            <label htmlFor='income'>Projected Income*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.income}</p>
                                    </div>
                                    <div className="b12">
                                        <p>
                                            <label htmlFor='facility'>Facility Code*</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.facilty_code}</p>

                                    </div>
                                     
                                   
                                </div>
                                {/* <div className="notes">
                                    <p>
                                        *Note: Projected income must include household income. You must notify HealthPlan Freedom if your actual income will be greater than projected as it will impact your subsidy.  Failure to provide notification will impact your tax return.</p>
                                </div> */}
                                <h3 className='sec-header-txt'>Ongoing Medical Conditions :</h3>



                                <div>

                                    <div className="med-condition-section">
                                        <div>
                                        <p className='med-condition-heading'>Do you have any of the following medical conditions?  (Check all that apply) </p>
                                            <div className="ongoing-med">
                                                <div className="condition-item">

                                                    {specialDiseases.map((disease) => (
                                                        <div className="condition-items" key={disease}>

                                                            <p data-label={disease}>
                                                                {userDetails.special_disease && userDetails.special_disease.includes(disease) ? (
                                                                    <i style={{ color: "#0075ff" }} className="fa-solid fa-square-check"></i>
                                                                ) : (
                                                                        <i style={{ color: "#000" }} className="fa-regular fa-square"></i>
                                                                       
                                                                    )}
                                                            </p>
                                                            <p className="enrollment-data-disease">{disease}</p>
                                                        </div>
                                                    ))}
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='sec-header-txt'>Takes Medications: {userDetails.takesMedication}</h3>
                                        
                                    <div className="med-table med-table-pdf" >
                                        
                                        <table className='response-tab'>

                                            <thead>
                                                <tr>
                                                    <th className='table-border1'>Sr. No.</th>
                                                    <th>Name</th>
                                                    <th>Dosage (ml/mg)</th>
                                                    {/* <th className='table-border2'>Remove</th> */}
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
                                                            <td data-label="Medication Name">No medication</td>
                                                            <td data-label="Dosage">No dosage</td>
                                                        </tr>
                                                    )}
                                           </tbody>
                                        </table>
                                    </div>


                                </div>

                                <div className="b14 additional-notes">
                                    <p className ="additonal-notes-head">
                                        <label htmlFor='notes'>Additional Information:</label>
                                    </p>

                                    <p className="enrollment-data data-notes">{userDetails.notes}</p>
                                </div>
                                <div className="box1">
                                    <div className="attestation" >
                                        <h3 className='sec-header-txt'> Attestation / Signature	</h3>
                                    </div>
                                    <p className="read1">By signing and submitting this form I agree to the following:</p>
                                    <div className="read">

                                        <div className="attes-checkbox">
                                        <i style={{ color: "#0075ff" }} className="fa-solid fa-square-check"></i>
                                        </div>
                                        <label htmlFor="checkbox">I authorize HealthPlan Freedom to enroll me in a health insurance plan if, and only if, I qualify for a $0 premium plan through the ACA.
                                                </label> </div>
                                    <div className="read">
                                        <div className="attes-checkbox">
                                        <i style={{ color: "#0075ff" }} className="fa-solid fa-square-check"></i>
                                        </div>

                                        <label htmlFor="checkbox2">I attest that all information provided in this form is accurate.</label> </div>
                                    <div className="read">
                                        <div className="attes-checkbox">
                                        <i style={{ color: "#0075ff" }} className="fa-solid fa-square-check"></i>
                                        </div>
                                        <label htmlFor="checkbox3">I grant HealthPlan Freedom authorization to maintain the agent of record until I withdraw my authorization in writing.  I also rescind and or revoke the agent of record for any other agent, including but not limited  to: <span className="limited_txt">{userDetails.txt_label_3 ? userDetails.txt_label_3 : '___________________'}</span></label> </div>
                                    <div className="read">
                                        <div className="attes-checkbox">
                                        <i style={{ color: "#0075ff" }} className="fa-solid fa-square-check"></i>
                                        </div>
                                        <label htmlFor="checkbox4">I authorize the Correctional Facility and their designated medical service provider to share any necessary information about me required by HealthPlan Freedom to complete my application for health insurance and coordinate any necessary care upon enrollment.I authorize HealthPlan Freedom, Inc  to share any health insurance policy information with the Correctional Facility and their medical service provider.</label> </div>
                                </div>

                                <div className="box-sig box-sig-pdf">
                                    <div className="b15">
                                        <p>
                                            <label htmlFor='signature'>Electronic Signature</label>
                                        </p>
                                        <p className="enrollment-data">{userDetails.e_sign}</p>
                                    </div>

                                    <div className="b15">
                                        <p>
                                            <label htmlFor='sign-date'>Signature Date</label>
                                        </p>

                                        <p className="enrollment-data">{userDetails.submission_date}</p>
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
