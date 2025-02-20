import React, { useState, useEffect, useRef } from "react";
import "./EnrollForm.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseurl } from "../../constant/enviroment/enviroment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { format, addHours } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import states from "states-us";
import jsPDF from "jspdf";
import Footer from "../../layouts/Footer/Footer";
import html2canvas from "html2canvas";
import { publicIpv4 } from "public-ip";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";

const EnrollForm = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [showCanvas, setShowCanvas] = useState(true); // Initially show canvas
  const [savedSignature, setSavedSignature] = useState(null);
  const signatureRef = useRef({});
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
    
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear(); // Clear the canvas
    }
  };

  const saveSignature = () => {
    if (signatureRef.current.isEmpty()) {
      // Show SweetAlert2 dialog
      Swal.fire({
        text: "Please sign before agreeing.",
        position:"top"
      });
    } else {
      const saved = signatureRef.current.toDataURL();
      setSavedSignature(saved);
      setShowCanvas(false);
    }
  };



  useEffect(() => {
    const fetchPublicIp = async () => {
      try {
        const ip = await publicIpv4(); // Ensure you use await to wait for the promise to resolve
        setIpAddress(ip);
      } catch (error) {
        console.error("Error fetching public IPv4 address:", error);
      }
    };

    fetchPublicIp();
  }, []);

  // console.log("what is my IP----------->",ipAddress);

  const navigate = useNavigate();
  const [takesMedication, setTakesMedication] = useState("no");
  // const [isMarried, setIsMarried] = useState('no');
  const [medications, setMedications] = useState([]);
  const [medicationName, setMedicationName] = useState("");
  const [medicationDosage, setMedicationDosage] = useState("");
  // const [spouses, setSpouse] = useState([]);
  // const [spouseName, setSpouseName] = useState('');
  // const [spouseNumber, setSpouseNumber] = useState('');
  const [checkboxValues, setCheckboxValues] = useState({
    special_disease: [],
    // ... other checkbox fields
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const yearDropdownRef = useRef(null);

  const handleDateChange = (date) => {
    // Handle the selected date
    setSelectedDate(date);
  };

  // const handleSubmitWithModal = async (event) => {
  //     await handleSubmit(event);
  //     openModal();
  // };

  //   const [isOpen, setIsOpen] = useState(false);
  //   const [alertMessage, setAlertMessage] = useState("");

  //   const openModal = () => {
  //     setIsOpen(true);
  //   };

  //   const closeModal = () => {
  //     setIsOpen(false);
  //   };

  const minBirthDate = new Date();
  minBirthDate.setFullYear(minBirthDate.getFullYear() - 18);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setCheckboxValues((prevValues) => {
        if (checked) {
          // If checked, add the value to the array
          return { ...prevValues, [name]: [...prevValues[name], value] };
        } else {
          // If unchecked, remove the value from the array
          return {
            ...prevValues,
            [name]: prevValues[name].filter((item) => item !== value),
          };
        }
      });
    } else {
      // Handle other input types

      if (name === "medicationName") {
        setMedicationName(value);
      } else if (name === "medicationDosage") {
        setMedicationDosage(value);
      }
      // else if (name === 'spouseName') {
      //     setSpouseName(value);
      // } else if (name === 'spouseNumber') {
      //     setSpouseNumber(value);
      // }
      else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          // spouses: [...spouses, { name: spouseName, number: spouseNumber }]
        }));
      }
    }
  };

  const handleAddMedication = (event) => {
    event.preventDefault();
    if (medicationName && medicationDosage) {
      setMedications([
        ...medications,
        { name: medicationName, dosage: medicationDosage },
      ]);
      setMedicationName("");
      setMedicationDosage("");
    }
  };

  const handleRemoveMedication = (index) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  // const handleAddSpouse = (event) => {
  //     event.preventDefault();
  //     if (spouseName && spouseNumber) {
  //         setSpouse([...spouses, { spousename: spouseName, spousenum: spouseNumber }]);
  //         setSpouseName('');
  //         setSpouseNumber('');
  //     }
  // };

  // const handleRemoveSpouse = (index) => {
  //     const updatedSpouses = [...spouses];
  //     updatedSpouses.splice(index, 1);
  //     setSpouse(updatedSpouses);
  // };

  const resetForm = () => {
    setTakesMedication("no");
    // setIsMarried('no');
    setMedications([]);
    // setSpouse([]);
    setMedicationName("");
    setMedicationDosage("");
    setCheckboxValues({
      special_disease: [],
      // ... other checkbox fields
    });

    // Additional clearing logic for other form fields if needed
  };

  const [checkbox, setCheckbox] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [checkbox4, setCheckbox4] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the current date and time
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");

    // Combine date and time for submission
    const signatureDateTime = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

    // Update the state with combined date and time
    setCurrentDateTime(`${month}/${day}/${year}`); // Update only date in the state
    setSignatureDateTime(signatureDateTime); // Update signatureDateTime state

    const getElementValue = (id) => {
      const element = document.getElementById(id);
      return element ? element.value : "";
    };

    // Collect values for all form fields
    const formData = {
      takesMedication,
      // isMarried,
      // spouses,
      medications,
      fullname: document.getElementById("name").value,
      phonenumber: document.getElementById("number").value,
      emailid: document.getElementById("email").value,
      dob: document.getElementById("date").value,
      ssn: document.getElementById("SSN").value,
      gender: document.getElementById("gender").value,
      zipcode: document.getElementById("zipcode").value,
      facilty_code: document.getElementById("facilityState").value,
      income: document.getElementById("income").value,
      maritalstatus: document.getElementById("marital").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      county: document.getElementById("counties").value,
      notes: document.getElementById("notes").value,
      // e_sign: document.getElementById("signature").value,
      // e_sign: getElementValue("signature"),
      e_sign: savedSignature, 
      submission_date: signatureDateTime,
      //submission_date: document.getElementById('sign-date').value,
      txt_label_3: document.getElementById("txt_label_3").value,

      ip_address: document.getElementById("ip_address").value,
      // ip_address: ipAddress,
      // Include only checked checkboxes in the payload
      ...checkboxValues,
      medication: medications, // Add the medications array directly to formData
      // spouse: spouses,
    };

    // Console log the form data for verification
    //console.log('Form Data:', formData);

    // Example API request using fetch

    // Define an object to map field labels to their corresponding IDs
    const fieldLabels = {
      fullname: 'Please enter your "Full Legal Name"',
      phonenumber: 'Please enter your "Phone Number"',
      dob: 'Please enter your "Date of Birth"',
      ssn: 'Please enter your "Social Security Number (SSN)"',
      zipcode: 'Please enter your "Zip Code"',
      address: 'Please enter your "Street Address"',
      city: 'Please enter your "City"',
      state: 'Please enter your "State"',
      e_sign: 'Please enter your "electronic signature"',
      county: 'Please enter your "County"',
      // Add other field labels here
    };

    // Define the fields to skip from empty field checking
    const fieldsToSkip = ["notes", "txt_label_3"];

    // Check for empty fields, excluding the fields to skip
    const emptyFields = Object.entries(formData)
      .filter(([key, value]) => value === "" && !fieldsToSkip.includes(key))
      .map(([key]) => fieldLabels[key]);

    //console.log("emptyFields", emptyFields);
    if (emptyFields.length > 0) {
      const nonEmptyFields = emptyFields.filter(
        (field) => field && field.trim().length > 0
      );
      // If any fields are empty, set the error message
      Swal.fire({
        icon: "",
        title: "Please fill the following required fields:",
        text: `${nonEmptyFields.join("\n")}`, // Use backticks for template literals
        position: "top",
      });
      //const message = `Please fill the following required fields:\n\n${nonEmptyFields.join('\n')}`;
      //setAlertMessage(message); // Update alert message state

      return;
    } else {
      // If all fields are filled, clear the error message
      setErrorMessage("");
    }

    // Check if all checkboxes are checked
    if (!checkbox || !checkbox2 || !checkbox3 || !checkbox4) {
      // Show message if any checkbox is not checked
      Swal.fire({
        icon: "",
        title: "",
        text: `Please read and check all the boxes that\nyou agree to the attestations to submit your form.`, // Use backticks for template literals
        position: "top",
      });
      //  setAlertMessage(`Please read and check all the boxes that you agree to the attestations to submit your form.`);
      return;
    }

    try {
      // if (!csrfTokenState) {
      //   console.error("CSRF token is missingKKKK.");
      //   return;
      // }
      const response = await fetch(baseurl + "/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // //'xsrf-token': csrfTokenState,
        },
        // //credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      //console.log("data-----------------------------",data);
      if (data.success) {
        // Handle success, e.g., show a success message
        Swal.fire({
          icon: "",
          title: "",
          text: `Thanks you! Your Enrollment Authorization Form submission has been successful.\nWe will review and let  you know If we have any questions.\nHave a great day!`, // Use backticks for template literals
          position: "top",
        });
        // setAlertMessage('Thanks you! Your Enrollment Authorization Form submission has been successful. We will review and let  you know If we have any questions.  Have a great day!');
        navigate("/");
        resetForm();
        // createPDF();

        // Additional clearing logic for other form fields if needed
      } else {
        // Handle error, e.g., show an error message
        Swal.fire({
          icon: "",
          title: "",
          text: data.message, // Use backticks for template literals
          position: "top",
        });

        //setAlertMessage(data.message)
      }
    } catch (error) {
      console.error("An error occurred during form submission", error);
      // Handle other error scenarios if needed
      Swal.fire({
        icon: "",
        title: "",
        text: `Oops! It seems like there was an error during form submission. We apologize for any inconvenience this may have caused. Please try submitting the form again. If the issue persists, feel free to contact our support team for assistance. Thank you for your understanding.`, // Use backticks for template literals
        position: "top",
      });
      //setAlertMessage('Oops! It seems like there was an error during form submission. We apologize for any inconvenience this may have caused. Please try submitting the form again. If the issue persists, feel free to contact our support team for assistance. Thank you for your understanding.');
    }
  };

  // Automatic Date //
  // Automatic Date //
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDate());
  const [signatureDateTime, setSignatureDateTime] = useState("");
  const [currentTimeZone, setCurrentTimeZone] = useState("");

  useEffect(() => {
    const today = new Date(); // Get the current date and time
    const easternTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimeZone(easternTimeZone);

    const zonedDate = utcToZonedTime(today, easternTimeZone);

    const formattedDateTime = format(zonedDate, "MM/dd/yyyy", {
      timeZone: easternTimeZone,
    });

    setCurrentDateTime(formattedDateTime);
  }, []);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const day = dateTime.getDate().toString().padStart(2, "0");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    const seconds = dateTime.getSeconds().toString().padStart(2, "0");

    return `${month}/${day}/${year}`;
    //return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };
  // Automatic Date //

  // County abbriviation drop down

  const [options, setOptions] = useState([]);
  const [result, setResult] = useState("");

  useEffect(() => {
    // Use the 'states' array from the 'states-us' library
    setOptions(states);
  }, []);

  const handleChange = (event) => {
    const enteredValue = event.target.value;

    // Find the state with the matching abbreviation in the 'states' array
    const selectedState = states.find(
      (state) => state.abbreviation === enteredValue
    );

    setResult(selectedState ? selectedState.name : enteredValue);
  };

  // end County abbriviation drop down

  // State abbriviation drop down
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState(""); // Add this line
  const stateAbbreviationsList = [
    "NC",
    "SC",
    "TN",
    "AL",
    "FL",
    "GA",
    "MS",
    "OH",
    "TX",
    "LA",
    "OK",
    "IN",
    "AZ",
    "UT",
    "WI",
    "WY",
    "NH",
    "AK",
    "HI",
    "KY",
    "AR",
    "MO",
    "IA",
    "KS",
    "NE",
    "CA",
    "IL",
    "HA",
    "OR",
    "WA",
    "MT",
    "CO",
    "MA",
    "ME",
    "NY",
    "NJ",
    "PA",
    "DE",
    "RI",
    "VT",
    "CT",
    "MD",
    "VA",
    "WV",
    "MN",
    "SD",
    "ND",
    "NV",
    "ID",
    "NM",
    "MI",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [errorMessageState, setErrorMessageState] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [income, setIncome] = useState("15060");

  const handleStateChange = (event) => {
    const value = event.target.value.toUpperCase();
    setSearchTerm(value);

    if (!/^[A-Z]*$/.test(value) || value.length > 2) {
      // Check if the entered value contains only uppercase letters
      // and has a length less than or equal to 2
      setFilteredStates([]);
      setErrorMessageState(
        "Invalid State Code! Please enter only uppercase letters with 2 characters."
      );
      setSearchTerm(newValue);
    } else {
      const filteredSuggestions = stateAbbreviationsList.filter((state) =>
        state.startsWith(value)
      );

      setFilteredStates(filteredSuggestions);
      setErrorMessageState("");
    }
  };

  const handleSelect = async (selectedState) => {
    setSearchTerm(selectedState);
    setFilteredStates([]);
    setSelectedState(selectedState);
    await fetchCountiesByState(selectedState);

    // Define special states and their corresponding initial income values
    const specialStates = {
      NC: "21000",
      OH: "21000",
      AK: "21000",
      AR: "21000",
      AZ: "21000",
      CA: "21000",
      CO: "21000",
      CT: "21000",
      DC: "21000",
      DE: "21000",
      HI: "21000",
      IA: "21000",
      ID: "21000",
      IL: "21000",
      IN: "21000",
      KY: "21000",
      LA: "21000",
      MA: "21000",
      MD: "21000",
      ME: "21000",
      MI: "21000",
      MN: "21000",
      MO: "21000",
      MS: "21000",
      ND: "21000",
      NE: "21000",
      NH: "21000",
      NJ: "21000",
      NM: "21000",
      NV: "21000",
      NY: "21000",
      OK: "21000",
      OR: "21000",
      PA: "21000",
      RI: "21000",
      SD: "21000",
      UT: "21000",
      VA: "21000",
      VT: "21000",
      WA: "21000",
      WV: "21000",
    };

    // Set the initial income value based on the selected state
    const initialIncome = specialStates[selectedState] || "15060";

    // Update the state
    setSelectedState(selectedState);
    setIncome(initialIncome);
  };

  const handleStateBlur = () => {
    // Reset the error message when the user clicks outside the input
    setErrorMessageState("");
  };

  //Fetch cunties trough API
  const fetchCountiesByState = async (state) => {
    try {
      // if (!csrfTokenState) {
      //   console.error("CSRF token is missingKKKK.");
      //   return;
      // }
      const validState = state.toUpperCase();

      if (stateAbbreviationsList.includes(validState)) {
        const response = await fetch(baseurl + `/admin/get-counties-by-state`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
           // //'xsrf-token': csrfTokenState,
          }, 
        //  //credentials: 'include',
          body: JSON.stringify({ state: validState }),
        });

        const data = await response.json();
        if (!response.ok) {
          setCounties(data.data);
          //console.error('Errordd:', response.status, response.statusText);
          Swal.fire({
            icon: "",
            title: "",
            text: `No counties found for the specified state,\nPlease enter your County manually.`, // Use backticks for template literals
            position: "top",
          });
          //   setAlertMessage("No counties found for the specified state , Please enter your County manually ");
          setSelectedCounty("");

          return;
        }

        // console.log('API Response:', data);

        if (data.success) {
          setCounties(data.data);
        } else {
          console.error("API Error:", data.message);
        }
      } else {
        console.error("Invalid state abbreviation:", validState);
      }
    } catch (error) {
      console.error("Error fetching counties:", error);
    }
  };

  const generateOptions = () => {
    // Generate options based on the income state
    let minValue = parseInt(income);
    const maxValue = 100000;
    const options = [];
    let increment; // Declaring the variable without assigning a value
    //console.log("minValue-------------->", minValue)
    if (minValue === 15060) {
      increment = 940; // Special increment value for minValue 15060
      options.push(minValue.toString()); // Push minValue to options
      minValue += increment; // Update minValue for starting at 16000
    } else {
      increment = 1000; // Default increment value
    }

    //console.log("increment-------------->", increment)
    for (let value = minValue; value <= maxValue; value += increment) {
      options.push(value.toString());
      increment = 1000; // After the first value, always increment by 1000
    }

    return options;
  };

  // end State abbriviation drop down

  //Set and format phone Number
  const [phonenumber, setPhonenumber] = useState("");
  const handleInputPhoneChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedValue = formatPhoneNumber(inputValue); // Format phone number

    if (inputValue.length <= 10) {
      setPhonenumber(formattedValue);
    }
  };
  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber;
  };
  //End Set and format phone Number

  //start Zip Code Restriction
  const [zip, setZip] = useState("");
  const [errorMessageZip, seterrorMessageZip] = useState("");
  const handleInputzipChange = (event) => {
    // Validate input to allow only numeric values
    const newZipValue = event.target.value;
    setZip(newZipValue);

    if (!/^\d*$/.test(newZipValue)) {
      seterrorMessageZip("Incorrect Zip Number !");
    } else if (newZipValue.length < 5) {
      seterrorMessageZip("Please enter valid zip code numbers.");
    } else {
      seterrorMessageZip("");
    }
  };

  const handleZipBlur = () => {
    // Reset the error message when the user clicks outside the input
  };

  //end Zip Code Restriction

  //start facility code
  // const { facility } = useParams();
  const [facilityState, setFacilityState] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const facility = searchParams.get("facility-code");

  // Use the facility parameter in your component...
  useEffect(() => {
    // You can set the facility in the component state if needed
    setFacilityState(facility);
  }, [facility]);

  const [errorMessage1, setErrorMessage1] = useState("");
  const handleInputNumChange = (event) => {
    // Validate input to allow only numeric values
    const newFacilityValue = event.target.value;
    setFacilityState(newFacilityValue);

    if (!/^\d*$/.test(newFacilityValue)) {
      setErrorMessage1("Incorrect facility number !");
    } else if (newFacilityValue.length < 6) {
      setErrorMessage1("Please enter valid Facility numbers.");
    } else {
      setErrorMessage1("");
    }
  };

  const handleFacilityBlur = () => {
    // Reset the error message when the user clicks outside the input
    setErrorMessage1("");
  };

  //end facility code

  //create SSN number restriction
  const [ssn, setSSN] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSsnChange = (event) => {
    const newValue = event.target.value;
    let formattedSSN = formatSSN(newValue);

    setSSN(formattedSSN);

    if (!/^\d*$/.test(newValue)) {
      setErrorMessage("Incorrect SSN number!");
    } else if (newValue.length < 9) {
      setErrorMessage("Please enter 9 digit SSN numbers.");
    } else {
      setErrorMessage("");
    }
  };

  const handleBlur = () => {
    // Reset the error message when the user clicks outside the input
    setErrorMessage("");
  };

  const formatSSN = (ssn) => {
    // Remove non-numeric characters
    const numericSSN = ssn.replace(/\D/g, "");

    // Format the SSN as "999-999-999"
    const formattedSSN = numericSSN.replace(
      /(\d{3})(\d{2})(\d{4})/,
      "$1-$2-$3"
    );

    return formattedSSN;
  };

  //End create SSN number restriction

  //text box for sposes in case of married
  const [maritalStatus, setMaritalStatus] = useState("");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleMaritalStatusChange = (e) => {
    const selectedValue = e.target.value;
    setMaritalStatus(selectedValue);
    if (selectedValue === "Married") {
      setShowAdditionalInfo(true);
    } else {
      setShowAdditionalInfo(false);
    }
  };

  //end text box for sposes in case of married

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function signatureHandleSubmit() {
    const today = new Date();
    const time = today.toLocaleTimeString();
    const date = currentDateTime;

    // Combine date and time for submission
    const signatureDateTime = `${date} ${time}`;

    // Here you can send the signatureDateTime to your backend or wherever needed
    //console.log("Signature Date and Time:", signatureDateTime);
  }

  return (
    <>
    <section className="section">
    <div className="enroll-header">
          <Link to="/">
            <img src="/images/big-hpf-logo.png" alt="logo" />
          </Link>
          <p>
            Please provide the following information and we will work to enroll
            you in the best available $0 premium traditional health insurance
            plan. We will only enroll you in a plan if your qualify for a $0
            monthly premium.
          </p>
        </div>
    </section>
    </>
  );
};

export default EnrollForm;
