import React, { useState, useEffect } from 'react'
import './EnrollForm.css'
import { Link, useNavigate } from 'react-router-dom'
import { baseurl } from '../../constant/enviroment/enviroment'
 
 


const EnrollForm = () => {
    const navigate = useNavigate();
    const [takesMedication, setTakesMedication] = useState('no');
    const [medications, setMedications] = useState([]);
    const [medicationName, setMedicationName] = useState('');
    const [medicationDosage, setMedicationDosage] = useState('');
    const [checkboxValues, setCheckboxValues] = useState({
        special_disease: [],
        // ... other checkbox fields
    });

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            setCheckboxValues((prevValues) => {
                if (checked) {
                    // If checked, add the value to the array
                    return { ...prevValues, [name]: [...prevValues[name], value] };
                } else {
                    // If unchecked, remove the value from the array
                    return { ...prevValues, [name]: prevValues[name].filter(item => item !== value) };
                }
            });
        } else {
            // Handle other input types
            if (name === 'medicationName') {
                setMedicationName(value);
            } else if (name === 'medicationDosage') {
                setMedicationDosage(value);
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        }
    };

    const handleAddMedication = (event) => {
        event.preventDefault();
        if (medicationName && medicationDosage) {
            setMedications([...medications, { name: medicationName, dosage: medicationDosage }]);
            setMedicationName('');
            setMedicationDosage('');
        }
    };

    const handleRemoveMedication = (index) => {
        const updatedMedications = [...medications];
        updatedMedications.splice(index, 1);
        setMedications(updatedMedications);
    };

    const resetForm = () => {
        setTakesMedication('no');
        setMedications([]);
        setMedicationName('');
        setMedicationDosage('');
        setCheckboxValues({
            special_disease: [],
            // ... other checkbox fields
        });

        // Additional clearing logic for other form fields if needed
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Collect values for all form fields
        const formData = {
            takesMedication,
            medications,
            fullname: document.getElementById('name').value,
            phonenumber: document.getElementById('number').value,
            emailid: document.getElementById('email').value,
            dob: document.getElementById('date').value,
            ssn: document.getElementById('SSN').value,
            gender: document.getElementById('gender').value,
            zipcode: document.getElementById('zipcode').value,
            facilty_code: document.getElementById('facility').value,
            income: document.getElementById('income').value,
            maritalstatus: document.getElementById('marital').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            county: document.getElementById('county').value,
            notes: document.getElementById('notes').value,
            e_sign: document.getElementById('signature').value,
            submission_date: document.getElementById('sign-date').value,
            // Include only checked checkboxes in the payload
            ...checkboxValues,
            medication: medications, // Add the medications array directly to formData
        };

        // Console log the form data for verification
        //console.log('Form Data:', formData);

        // Example API request using fetch
        // Example API request using fetch
        try {
            const response = await fetch(baseurl + '/api/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Handle success, e.g., show a success message
                alert('Enrollment Authorization Form submitted successfully.  If we have any questions we will reach out to you.  Have a great day!');
                navigate('/');
                resetForm();

                // Additional clearing logic for other form fields if needed
            } else {
                // Handle error, e.g., show an error message
                alert('Form submission failed. Please fill in all the required fields.');
            }
        } catch (error) {
            console.error('An error occurred during form submission', error);
            // Handle other error scenarios if needed
            alert('An error occurred during form submission');
        }

    };

    // Automatic Date //
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);
    }, []);

    // Automatic Date //

    return (
        <>
      

            <section className=' enrollment-form section'>
          
    
                <div className="enroll-header pr">
                    <Link to="/">
                        <img src="/images/big-hpf-logo.png" alt="logo" />
                    </Link>
                    <p>Please provide the following information and we will work to enroll you in the best available $0 premium traditional health insurance plan.  We will only enroll you in a plan if your qualify for a $0 monthly premium.
                    </p>
                </div>
                <div className="form-section">
                    <div className="main">
                        <section className="box">
                            <div>
                                <h2>Authorization To Enroll Form</h2>
                            </div>
                        </section>

                        <div>

                            <section>
                                <form action="#" id="form" onSubmit={handleSubmit}>

                                    <div className="registration">
                                                <div className="boxs">
                                                    <div className="b1">
                                                        <p>
                                                            <label htmlFor='name'>Applicant Full Legal Name*</label>
                                                        </p>
                                                        <input type="text" name="name" id='name' />
                                                    </div>

                                                    <div className="b2">
                                                        <p>
                                                            <label htmlFor='number'>Phone Number*</label>
                                                        </p>
                                                        <input type="number" name="number" id='number' />
                                                    </div>
                                                </div>

                                                <div className="boxs">
                                                    <div className="b3">
                                                        <p>
                                                            <label htmlFor='email'>Email Address</label>
                                                        </p>
                                                        <input type="text" name="email" id='email' />
                                                    </div>

                                                    <div className="b4">
                                                        <p>
                                                            <label htmlFor='date'>Date of Birth*</label>
                                                        </p>
                                                        <input type="date" name="DOB" id='date' />
                                                    </div>
                                                </div>

                                                <div className="boxs">
                                                    <div className="b5">
                                                        <p>
                                                            <label htmlFor='SSN'>SSN*</label>
                                                        </p>
                                                        <input type="text" name="SSN" id='SSN' />
                                                    </div>

                                                    <div className="b6">
                                                        <p>
                                                            <label htmlFor='gender'>Gender*</label>
                                                        </p>
                                                        <select id="gender" name="gender">
                                                            <option value=""></option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                        </select>
                                                    </div>

                                                </div>

                                                <div className="boxs">
                                                    <div className="b10">
                                                        <p>
                                                            <label htmlFor='address'>Street Address*</label>
                                                        </p>
                                                        <input type="text" name="address" id="address" />
                                                    </div>

                                                    <div className="b11">
                                                        <p>
                                                            <label htmlFor='city'>City*</label>
                                                        </p>
                                                        <input type="text" name="city" id="city" />
                                                    </div>



                                                </div>

                                                <div className="boxs">
                                                    <div className="b7">
                                                        <p>
                                                            <label htmlFor='zipcode'>Zip Code*</label>
                                                        </p>
                                                        <input type="number" name="zipcode" id='zipcode' />
                                                    </div>
                                                    <div className="b12">
                                                        <p>
                                                            <label htmlFor='state'>State*</label>
                                                        </p>
                                                        <input type="text" name="state" id="state" />

                                                    </div>



                                                </div>

                                                {/* Continue with the rest of your form structure */}

                                                <div className="boxs">
                                                    <div className="b13">
                                                        <p>
                                                            <label htmlFor="county">County*</label>
                                                        </p>
                                                        <input type="number" name="county" id="county" />
                                                    </div>
                                                    <div className="b9">
                                                        <p>
                                                            <label htmlFor='marital'>Marital Status*</label>
                                                        </p>
                                                        <select name="marital" id="marital">
                                                            <option value=""></option>
                                                            <option value="Married">Married</option>
                                                            <option value="Unmarried">Unmarried</option>
                                                        </select>
                                                    </div>


                                                </div>


                                                <div className="boxs">
                                                    <div className="b8">



                                                        <p>
                                                            <label htmlFor='income'>Projected Income*</label>
                                                        </p>
                                                        <select name="income" id="income">
                                                            <option value="15000">$15000</option>
                                                            <option value="16000">$16000</option>
                                                            <option value="17000">$17000</option>
                                                            <option value="18000">$18000</option>
                                                            <option value="19000">$19000</option>
                                                            <option value="20000">$20000</option>
                                                            <option value="21000">$21000</option>
                                                            <option value="22000">$22000</option>
                                                            <option value="23000">$23000</option>
                                                            <option value="24000">$24000</option>
                                                            <option value="25000">$25000</option>
                                                            <option value="26000">$26000</option>
                                                            <option value="27000">$27000</option>
                                                            <option value="28000">$28000</option>
                                                            <option value="29000">$29000</option>
                                                            <option value="30000">$30000</option>
                                                            <option value="31000">$31000</option>
                                                            <option value="32000">$32000</option>
                                                            <option value="33000">$33000</option>
                                                            <option value="34000">$34000</option>
                                                            <option value="35000">$35000</option>
                                                            <option value="36000">$36000</option>
                                                            <option value="37000">$37000</option>
                                                            <option value="38000">$38000</option>
                                                            <option value="39000">$39000</option>
                                                            <option value="40000">$40000</option>
                                                            <option value="41000">$41000</option>
                                                            <option value="42000">$42000</option>
                                                            <option value="43000">$43000</option>
                                                            <option value="44000">$44000</option>
                                                            <option value="45000">$45000</option>
                                                            <option value="46000">$46000</option>
                                                            <option value="47000">$47000</option>
                                                            <option value="48000">$48000</option>
                                                            <option value="49000">$49000</option>
                                                            <option value="50000">$50000</option>
                                                            <option value="51000">$51000</option>
                                                            <option value="52000">$52000</option>
                                                            <option value="53000">$53000</option>
                                                            <option value="54000">$54000</option>
                                                            <option value="55000">$55000</option>
                                                            <option value="56000">$56000</option>
                                                            <option value="57000">$57000</option>
                                                            <option value="58000">$58000</option>
                                                            <option value="59000">$59000</option>
                                                            <option value="60000">$60000</option>
                                                            <option value="61000">$61000</option>
                                                            <option value="62000">$62000</option>
                                                            <option value="63000">$63000</option>
                                                            <option value="64000">$64000</option>
                                                            <option value="65000">$65000</option>
                                                            <option value="66000">$66000</option>
                                                            <option value="67000">$67000</option>
                                                            <option value="68000">$68000</option>
                                                            <option value="69000">$69000</option>
                                                            <option value="70000">$70000</option>
                                                            <option value="71000">$71000</option>
                                                            <option value="72000">$72000</option>
                                                            <option value="73000">$73000</option>
                                                            <option value="74000">$74000</option>
                                                            <option value="75000">$75000</option>
                                                            <option value="76000">$76000</option>
                                                            <option value="77000">$77000</option>
                                                            <option value="78000">$78000</option>
                                                            <option value="79000">$79000</option>
                                                            <option value="80000">$80000</option>
                                                            <option value="81000">$81000</option>
                                                            <option value="82000">$82000</option>
                                                            <option value="83000">$83000</option>
                                                            <option value="84000">$84000</option>
                                                            <option value="85000">$85000</option>
                                                            <option value="86000">$86000</option>
                                                            <option value="87000">$87000</option>
                                                            <option value="88000">$88000</option>
                                                            <option value="89000">$89000</option>
                                                            <option value="90000">$90000</option>
                                                            <option value="91000">$92000</option>
                                                            <option value="92000">$92000</option>
                                                            <option value="93000">$93000</option>
                                                            <option value="94000">$94000</option>
                                                            <option value="95000">$95000</option>
                                                            <option value="96000">$96000</option>
                                                            <option value="97000">$97000</option>
                                                            <option value="98000">$98000</option>
                                                            <option value="99000">$99000</option>
                                                            <option value="100000">$1L+</option>
                                                        </select>
                                                    </div>
                                                    <div className="b12">
                                                        <p>
                                                            <label htmlFor='facility'>Facility Code*</label>
                                                        </p>
                                                        <input type="number" name="state" id="facility" />

                                                    </div>

                                                </div>
                                                <div className="notes">
                                                    <p>
                                                        *Note: Projected income must include household income. You must notify HealthPlan Freedom if your actual income will be greater than projected as it will impact your subsidy.  Failure to provide notification will impact your tax return.</p>
                                                </div>
                                                <h3 className='sec-header-txt'>Ongoing Medical Conditions :</h3>
                                                <div>

                                                    <div className="med-condition-section">

                                                        <div>
                                                            <p className='med-condition-heading'>Do you have any of the following medical conditions?  (Check all that apply) </p>
                                                            <div className="med-condition-checkbox">
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="HIV"
                                                                        name="special_disease"
                                                                        value="HIV"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="HIV">HIV </label>
                                                                </p>
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="Diabetes"
                                                                        value="Diabetes"
                                                                        name="special_disease"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="Diabetes"> Diabetes </label>
                                                                </p>
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="Heart"
                                                                        value="Heart"
                                                                        name="special_disease"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="Heart">Congestive Heart Failure </label>
                                                                </p>
                                                            </div>
                                                            <div className="med-condition-checkbox">
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="Hypertension"
                                                                        value="Hypertension"
                                                                        name="special_disease"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="Hypertension">Hypertension </label>
                                                                </p>
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="Artery"
                                                                        value="Artery"
                                                                        name="special_disease"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="Artery">Coronary Artery Disease</label>
                                                                </p>
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="Cancer"
                                                                        value="Cancer"
                                                                        name="special_disease"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="Cancer">Cancer </label>
                                                                </p>
                                                            </div>
                                                            <div className="med-condition-checkbox">
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="Arthritis"
                                                                        value="Arthritis"
                                                                        name="special_disease"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="Arthritis">Arthritis</label>
                                                                </p>
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="Asthma"
                                                                        value="Asthma"
                                                                        name="special_disease"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="Asthma">Asthma</label>
                                                                </p>
                                                                <p className="read">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="COPD"
                                                                        value="COPD"
                                                                        name="special_disease"
                                                                        className='checkbox'
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="COPD">COPD </label>
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>



                                                    <h3 className='sec-header-txt'>Medications:</h3>
                                                    <div className='medications_sec'>
                                                        <div>

                                                            <label className="lbl_name">
                                                                Do you take any medications currently?
                                                        <input
                                                                    type="radio"
                                                                    name="takesMedication"
                                                                    value="no"
                                                                    checked={takesMedication === 'no'}
                                                                    onChange={() => setTakesMedication('no')}
                                                                />
                                                                <label>No</label>
                                                                <input
                                                                    type="radio"
                                                                    name="takesMedication"
                                                                    value="yes"
                                                                    checked={takesMedication === 'yes'}
                                                                    onChange={() => setTakesMedication('yes')}
                                                                /> <label>Yes </label>
                                                            </label>

                                                            {takesMedication === 'yes' && (
                                                                <div >
                                                                    <div className="med-capture">
                                                                        <label>
                                                                            <span> Medication Name:</span>
                                                                            <input
                                                                                type="text"
                                                                                name="medicationName"
                                                                                value={medicationName}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        </label>

                                                                        <label>
                                                                            <span> Dosage:</span>
                                                                            <input
                                                                                type="text"
                                                                                name="medicationDosage"
                                                                                value={medicationDosage}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                        </label>

                                                                        {/* <button >Add</button> */}
                                                                        <button onClick={handleAddMedication} tabIndex="0" className="plusButton">
                                                                            <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                                                                <g mask="url(#mask0_21_345)">
                                                                                    <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                                                                                </g>
                                                                            </svg>
                                                                        </button>
                                                                    </div>

                                                                    {medications.length > 0 && (
                                                                        <div className='med-table'>

                                                                            <table>
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th className='table-border1'>Sr. No.</th>
                                                                                        <th>Name</th>
                                                                                        <th>Dosage</th>
                                                                                        <th className='table-border2'>Remove</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {medications.map((medication, index) => (
                                                                                        <tr key={index}>
                                                                                            <td>Medication #{index + 1}:</td>
                                                                                            <td>{medication.name}</td>
                                                                                            <td>{medication.dosage}</td>
                                                                                            <td>
                                                                                                {/* <button >Remove</button> */}
                                                                                                <button onClick={() => handleRemoveMedication(index)} className="remove-btn">
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                                                                                                        <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clipRule="evenodd" fillRule="evenodd"></path>
                                                                                                    </svg>
                                                                                                    {/* <span className="tooltiptext">remove</span> */}
                                                                                                </button>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="b14">
                                                    <p>
                                                        <label htmlFor='notes'>Additional Information:</label>
                                                    </p>
                                                    <textarea id="notes" cols="30" rows="10"></textarea>
                                                </div>
                                                <div className="box1">
                                                    <div className="attestation" >
                                                        <h3 className='sec-header-txt'> Attestation / Signature	</h3>
                                                    </div>
                                                    <div className="read">
                                                        <div className="attes-checkbox">
                                                            <input type="checkbox" id="checkbox" className='checkbox' />
                                                        </div>
                                                        <label htmlFor="checkbox">By signing and submitting this form I authorize HealthPlan Freedom to enroll me in a health insurance plan if, and only if, I qualify for a $0 premium plan through the ACA.
                                                </label> </div>
                                                    <div className="read">
                                                        <div className="attes-checkbox">
                                                            <input type="checkbox" id="checkbox2" className='checkbox' />
                                                        </div>

                                                        <label htmlFor="checkbox2">I attest that all information provided in this form is accurate.</label> </div>
                                                    <div className="read">
                                                        <div className="attes-checkbox">
                                                            <input type="checkbox" id="checkbox3" className='checkbox' />
                                                        </div>
                                                        <label htmlFor="checkbox3">I also grant HealthPlan Freedom authorization to maintain the agent of record until  I withdraw my authorization in writing.</label> </div>
                                                    <div className="read">
                                                        <div className="attes-checkbox">
                                                            <input type="checkbox" id="checkbox4" className='checkbox' />
                                                        </div>
                                                        <label htmlFor="checkbox4">I authorize the Correctional Facility and their designated medical service provider to share any necessary information about me required
                                                    by HealthPlan Freedom to complete my application for health insurance and coordinate any necessary care upon enrollment.I authorize HealthPlan Freedom, Inc  to share any health insurance policy information with the Correctional Facility and their medical service provider.</label> </div>
                                                </div>

                                                <div className="box-sig">
                                                    <div className="b15">
                                                        <p>
                                                            <label htmlFor='signature'>Electronic Signature</label>
                                                        </p>
                                                        <input type="text" name="signature" id='signature' />
                                                    </div>

                                                    <div className="b15">
                                                        <p>
                                                            <label htmlFor='sign-date'>Signature Date</label>
                                                        </p>
                                                        <input
                                                            type="date"
                                                            name="sign-date"
                                                            id="sign-date"
                                                            value={currentDate}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                                
                                   

                                            <div className="box2">
                                                <button className='submit-btn' type="submit">Submit</button>
                                            </div>

                                        </div>

                                </form>
                                
                            </section>
                            </div>

                        </div>
                    </div>
                    
                    
           



            </section>
            


        </>
    )
}

export default EnrollForm
