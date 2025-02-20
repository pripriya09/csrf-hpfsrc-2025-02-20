import React, { useState, useEffect, useRef } from "react";
import "./EnrollForm.css";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
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
import CustomGoogleTranslate from '../../components/comman/CustomGoogleTranslate'
import Swal from "sweetalert2";


const EnrollForm = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [showCanvas, setShowCanvas] = useState(true); // Initially show canvas
  const [savedSignature, setSavedSignature] = useState(null);
  const signatureRef = useRef({});
  const [isSigned, setIsSigned] = useState(false);
  const [error, setError] = useState(null);
  

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setError(""); // Clear error message when signed
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        return;
      }
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
    
    if (!savedSignature) {
     
      Swal.fire({
                 icon: "",
                 title: "",
                 text: `Signature is required before submission.`,
                 position: "top",
             });
      return;
    }

    //  // Automatically save the signature before submission
    // if (signatureRef.current && !signatureRef.current.isEmpty()) {
    //     const signatureData = signatureRef.current.toDataURL(); // Convert signature to base64
    //     setSavedSignature(signatureData);
    // } else {
    //     Swal.fire({
    //         icon: "",
    //         title: "",
    //         text: `Signature is required before submission.`,
    //         position: "top",
    //     });
    //     return; // Prevent form submission if signature is missing
    // }
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
      emailid: 'Please enter your "Email_ID"',
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
    const fieldsToSkip = ["notes", "txt_label_3", "emailid"];

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

    // if (!signatureRef.current || signatureRef.current.isEmpty()) {
    //   Swal.fire({
    //     icon: "",
    //     title: "",
    //     text: `Signature is required before submit.`, // Use backticks for template literals
    //     position: "top",
    //   });
    //   return;
    // }

    try {
      const response = await fetch(baseurl + "/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      //console.log("data-----------------------------",data);
      if (data.success) {
        // Handle success, e.g., show a success message
        Swal.fire({
          icon: "",
          title: "",
          text: `Thanks you! Your Enrollment Authorization Form submission has been successful. We will review and let you know if we have any questions.\nHave a great day!`, // Use backticks for template literals
          position: "top",
        }).then(() => {
          // Reload the page after clicking the OK button
          setTimeout(() => {
            window.scrollTo(0, 0);
            window.location.reload();
          }, 500);


        });

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
  const [showAllStates, setShowAllStates] = useState(false);
  const [filteredStates, setFilteredStates] = useState([]);
  const [errorMessageState, setErrorMessageState] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [income, setIncome] = useState("15650");

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

  const handleInputFocus = () => {
    setShowAllStates(true);
    setFilteredStates(stateAbbreviationsList);
  };

  const handleClickOutside = (event) => {
    const stateInput = document.getElementById("state");
    if (stateInput && !stateInput.contains(event.target)) {
      setShowAllStates(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  const cleanup = () => {
    document.removeEventListener("click", handleClickOutside);
  };

  useEffect(() => {
    return cleanup;
  }, []);


  const handleSelect = async (selectedState) => {
    setSearchTerm(state); // Set the input value to the selected state
    setSearchTerm(selectedState);
    setFilteredStates([]);
    setSelectedState(selectedState);
    await fetchCountiesByState(selectedState);

    // Define special states and their corresponding initial income values
    const specialStates = {
      GA: "18000", 
      NC: "21600",
      OH: "21600",
      AK: "21600",
      AR: "21600",
      AZ: "21600",
      CA: "21600",
      CO: "21600",
      CT: "21600",
      DC: "21600",
      DE: "21600",
      HI: "21600",
      IA: "21600",
      ID: "21600",
      IL: "21600",
      IN: "21600",
      KY: "21600",
      LA: "21600",
      MA: "21600",
      MD: "21600",
      ME: "21600",
      MI: "21600",
      MN: "21600",
      MO: "21600",
      MS: "21600",
      ND: "21600",
      NE: "21600",
      NH: "21600",
      NJ: "21600",
      NM: "21600",
      NV: "21600",
      NY: "21600",
      OK: "21600",
      OR: "21600",
      PA: "21600",
      RI: "21600",
      SD: "21600",
      UT: "21600",
      VA: "21600",
      VT: "21600",
      WA: "21600",
      WV: "21600",
    };

    // Set the initial income value based on the selected state
    const initialIncome = specialStates[selectedState] || "15650";

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
      const validState = state.toUpperCase();

      if (stateAbbreviationsList.includes(validState)) {
        const response = await fetch(baseurl + `/admin/get-counties-by-state`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: validState }),
        });

        const data = await response.json();
        //  console.log("data----------->", data);

        if (!response.ok) {
          setCounties(data.data);
          // console.log("data.data----------->", data.data);
          Swal.fire({
            icon: "",
            title: "",
            text: `No counties found for the specified state,\nPlease enter your County manually.`,
            position: "top",
          });
          setSelectedCounty("");

          return;
        }

        if (data.success) {
          const filteredCounties = data.data.filter((county) => county !== null);
          setCounties(filteredCounties);
          //console.log("data.data----------->", filteredCounties);
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
    if (minValue === 15650) {
      increment = 350; // Special increment value for minValue 15060
      options.push(minValue.toString()); // Push minValue to options
      minValue += increment; // Update minValue for starting at 16000
    } if (minValue === 21600) {
      increment = 400; // Special increment value for minValue 15060
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
  const isMobile = window.innerWidth <= 768;
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
      <section className="enrollment-form section">

        <div className="enroll-header pr">
          <div className="header-mob">
            <img src="/images/big-hpf-logo.png" alt="logo" />
            {/* <Link to="/">

            <img src="/images/big-hpf-logo.png" alt="logo" />
          </Link> */}
            <div className="CustomGoogleTranslate">
              <CustomGoogleTranslate />
            </div>

          </div>


          <p>
            Please provide the following information and we will work to enroll
            you in the best available $0 premium traditional health insurance
            plan. We will only enroll you in a plan if your qualify for a $0
            monthly premium.
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
              {/* <section ref={pdfContainerRef}> */}
              <section>
                <form
                  action="#"
                  id="form"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="registration">
                    <div className="boxs">
                      <div className="b1">
                        <p>
                          <label htmlFor="name">
                            Full Legal Name*
                          </label>
                        </p>
                        <input type="text" name="name" id="name" />
                      </div>

                      <div className="b2">
                        <p>
                          <label htmlFor="number">Phone Number*</label>
                        </p>

                        <input
                          type="text"
                          name="number"
                          id="number"
                          value={phonenumber}
                          onChange={handleInputPhoneChange}
                          placeholder="(888) 888-8888"
                          pattern="\(\d{3}\) \d{3}-\d{4}"
                          maxLength="14"
                        />
                      </div>
                    </div>

                    <div className="boxs">
                      <div className="b3">
                        <p>
                          <label htmlFor="email">Email Address</label>
                        </p>
                        <input type="text" name="email" id="email" />
                      </div>

                      <div className="b4">
                        <p>
                          <label htmlFor="date">Date of Birth*</label>
                        </p>
                        <DatePicker
                          id="date"
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="MM/dd/yyyy"
                          maxDate={minBirthDate}
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={85}
                          yearDropdownRef={yearDropdownRef}
                        />

                        {/* <input type="date" name="DOB" id='date'  /> */}
                      </div>
                    </div>

                    <div className="boxs">
                      <div className="b5">
                        <p>
                          <label htmlFor="SSN">SSN*</label>
                        </p>

                        <input
                          type="text"
                          name="SSN"
                          id="SSN"
                          maxLength="11"
                          value={ssn}
                          pattern="\d{3}-\d{2}-\d{4}"
                          title="Please match the requested format: 123-45-6789"
                          onChange={handleSsnChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errorMessage && (
                          <div style={{ color: "red" }}>{errorMessage}</div>
                        )}

                        {/* <input type="text" name="SSN" id="SSN" maxLength="9" title="Please enter at least 9 characters" /> */}
                      </div>

                      <div className="b6">
                        <p>
                          <label htmlFor="gender">Gender*</label>
                        </p>
                        <select id="gender" name="gender">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="boxs">
                      <div className="b10">
                        <p>
                          <label htmlFor="address">Street Address*</label>
                        </p>
                        <input type="text" name="address" id="address" />
                      </div>

                      <div className="b11">
                        <p>
                          <label htmlFor="city">City*</label>
                        </p>
                        <input type="text" name="city" id="city" />
                      </div>
                    </div>

                    <div className="boxs">
                      <div className="b7">
                        <p>
                          <label htmlFor="zipcode">Zip Code*</label>
                        </p>
                        <input
                          type="text"
                          name="zipcode"
                          id="zipcode"
                          maxLength="5"
                          value={zip}
                          pattern="\d*"
                          onChange={handleInputzipChange}
                          onBlur={handleZipBlur}
                        />
                        {errorMessageZip && (
                          <div style={{ color: "red" }}>{errorMessageZip}</div>
                        )}
                      </div>
                      <div className="b12">
                        <p data-translate="no">
                          <label htmlFor="state">State*</label>
                        </p>
                        <input
                          id="state"
                          type="text"
                          value={searchTerm}
                          onChange={handleStateChange}
                          maxLength="2"
                          placeholder="Enter your state"
                          onFocus={handleInputFocus}
                          onBlur={handleClickOutside}
                        />
                        {filteredStates.length > 0 && (
                          <ul className="state-dropdown">
                            {filteredStates.map((state, index) => (
                              <li key={index} translate="no" onClick={() => handleSelect(state)}>
                                {state}
                              </li>
                            ))}
                          </ul>
                        )}
                        {errorMessageState && (
                          <p className="error-message">{errorMessageState}</p>
                        )}
                      </div>
                    </div>

                    {/* Continue with the rest of your form structure */}

                    <div className="boxs">
                      <div className="b13">
                        <p className="usStateinputs" data-translate="no" >
                          <label>Select County*</label>
                        </p>
                        {counties.length > 0 ? (
                          <select
                            id="counties"
                            value={selectedCounty}
                            onChange={(e) => setSelectedCounty(e.target.value)}
                          >
                            {counties.map((county, index) => (
                              <option key={index} translate="no" value={county}>
                                {county}
                              </option>
                            ))}
                          </select>
                        ) : (
                            <input
                              type="text"
                              id="counties"
                              value={selectedCounty}
                              onChange={(e) => setSelectedCounty(e.target.value)}
                              placeholder="Enter your county"
                            />
                          )}
                      </div>

                      <div className="b9">
                        <p>
                          <label htmlFor="marital">Marital Status*</label>
                        </p>
                        <select
                          name="marital"
                          id="marital"
                          value={maritalStatus}
                          onChange={handleMaritalStatusChange}
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                        </select>
                      </div>
                    </div>

                    <div className="boxs">
                      <div className="b8">
                        <p>
                          <label htmlFor="income">Projected Income*</label>
                        </p>
                        <select
                          name="income"
                          id="income"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                        >
                          {generateOptions().map((value, index) => (
                            <option key={index} value={value}>
                              ${value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="b12">
                        <p>
                          <label htmlFor="facility">Facility Code*</label>
                        </p>

                        <input
                          type="text"
                          name="facility"
                          id="facilityState"
                          minLength="6"
                          maxLength="6"
                          pattern="\d*"
                          value={facilityState || ""}
                          onChange={handleInputNumChange}
                          onBlur={handleFacilityBlur}
                          readOnly
                        />
                        {errorMessage1 && (
                          <div style={{ color: "red" }}>{errorMessage1}</div>
                        )}
                      </div>
                    </div>
                    <div className="notes">
                      <p>
                        *Note: Projected income must include household income.
                        You must notify HealthPlan Freedom if your actual income
                        will be greater than projected as it will impact your
                        subsidy. Failure to provide notification will impact
                        your tax return.You are required to file a federal income tax return each year.
                      </p>
                    </div>
                    {/* <h3 className='sec-header-txt'>Ongoing Medical Conditions :</h3> */}
                    {/* <div>
                                            <div className="med-condition-section"> */}
                    {/* <div>
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
                                                                id="Congestive Heart Failure"
                                                                value="Congestive Heart Failure"
                                                                name="special_disease"
                                                                className='checkbox'
                                                                onChange={handleInputChange}
                                                            />
                                                            <label htmlFor="Congestive Heart Failure">Congestive Heart Failure </label>
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
                                                                id="Coronary Artery Disease"
                                                                value="Coronary Artery Disease"
                                                                name="special_disease"
                                                                className='checkbox'
                                                                onChange={handleInputChange}
                                                            />
                                                            <label htmlFor="Coronary Artery Disease">Coronary Artery Disease</label>
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
                                                </div> */}
                    {/* </div> */}

                    {/* <h3 className='sec-header-txt'>Medications:</h3> */}
                    {/* <div className='medications_sec'>
                                                <div> */}

                    {/* <label className="lbl_name">
                                                        Do you take any medications currently?
                                                        <div className='medication-row'>
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
                                                            /> <label>Yes </label></div>
                                                    </label> */}

                    {/* {takesMedication === 'yes' && (
                                                        <div >
                                                            <div className="med-capture">
                                                                <label className="lbl-med-capture">
                                                                    <span> Medication Name:</span>
                                                                    <input
                                                                        type="text"
                                                                        name="medicationName"
                                                                        value={medicationName}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </label>

                                                                <label className="lbl-med-capture">
                                                                    <span> Dosage(ml/mg):</span>
                                                                    <input className="txtwitdh"
                                                                        type="text"
                                                                        name="medicationDosage"
                                                                        value={medicationDosage}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </label>


                                                            
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

                                                                    <table className='response-tab'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th className='table-border1'>Sr. No.</th>
                                                                                <th>Name</th>
                                                                                <th>Dosage (ml/mg)</th>
                                                                                <th className='table-border2'>Remove</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {medications.map((medication, index) => (
                                                                                <tr key={index}>
                                                                                    <td data-label="Sr. No.">Medication #{index + 1}:</td>
                                                                                    <td data-label="Name">{medication.name}</td>
                                                                                    <td data-label="Dosage (ml/mg)">{medication.dosage} (ml/mg)</td>
                                                                                    <td data-label="Remove">

                                                                                     
                                                                                        <button onClick={() => handleRemoveMedication(index)} className="remove-btn">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                                                                                                <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clipRule="evenodd" fillRule="evenodd"></path>
                                                                                            </svg>
                                                                                         
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )} */}
                    {/* </div>

                                            </div>
                                        </div> */}
                    {/* ////////////////////////////////////////////////////////////// */}

                    {/* make married option for spouce */}

                    {/* <h3 className='sec-header-txt-1'>Marital Status*:</h3> */}
                    {/* <div className='medications_sec'>
                                            
                                                <div>

                                                    <label className="lbl_name">
                                                        Marital Status?
                                                        <div className='medication-row'>
                                                            <input
                                                                type="radio"
                                                                name="isMarried"
                                                                value="no"
                                                                checked={isMarried === 'no'}
                                                                onChange={() => setIsMarried('no')}
                                                            />
                                                            <label>Single</label>
                                                            <input
                                                                type="radio"
                                                                name="isMarried"
                                                                value="yes"
                                                                checked={isMarried === 'yes'}
                                                                onChange={() => setIsMarried('yes')}
                                                            /> <label>Married </label></div>
                                                    </label>

                                                    {isMarried === 'yes' && (
                                                        <div >
                                                            <div className="med-capture">
                                                                <label className="lbl-med-capture">
                                                                    <span> Spouse's Name:</span>
                                                                    <input
                                                                        type="text"
                                                                        name="spouseName"
                                                                        value={spouseName}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </label>

                                                                <label className="lbl-med-capture">
                                                                    <span>Spouse Phone Number:</span>
                                                                    <input className="txtwitdh"
                                                                        type="text"
                                                                        name="spouseNumber"
                                                                        value={spouseNumber}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                </label>


                                                                
                                                                <button onClick={handleAddSpouse} tabIndex="0" className="plusButton">
                                                                    <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                                                        <g mask="url(#mask0_21_345)">
                                                                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                                                                        </g>
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            {spouses.length > 0 && (
                                                                <div className='med-table'>

                                                                    <table className='response-tab'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th className='table-border1'>Sr. No.</th>
                                                                                <th>Spouse Name</th>
                                                                                <th>Spouse Contact Number</th>
                                                                                <th className='table-border2'>Remove</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {spouses.map((spouses, index) => (
                                                                                <tr key={index}>
                                                                                    <td data-label="Sr. No.">Spouse #{index + 1}:</td>
                                                                                    <td data-label="Name">{spouses.spousename}</td>
                                                                                    <td data-label="Dosage (ml/mg)">{spouses.spousenum}</td>
                                                                                    <td data-label="Remove">

                                                                                        
                                                                                        <button onClick={() => handleRemoveSpouse(index)} className="remove-btn">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                                                                                                <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clipRule="evenodd" fillRule="evenodd"></path>
                                                                                            </svg>
                                                                                           
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

                                            </div> */}

                    {/* ////////////////////////////////////////////////////////////// */}
                    <div className="b14">
                      <p>
                        <label htmlFor="notes">
                          Additional Information{" "}
                          {showAdditionalInfo && (
                            <span className="spouse-txt">
                              {" "}
                              - Spouse's Name And Phone Number Are Required*
                            </span>
                          )}
                        </label>
                      </p>

                      <textarea id="notes" cols="30" rows="10"></textarea>
                    </div>

                    <div className="box1">
                      <div className="attestation">
                        <h3 className="sec-header-txt">
                          {" "}
                          Attestation / Signature{" "}
                        </h3>
                      </div>
                      <p className="read1">
                        By signing and submitting this form I agree to the
                        following:
                      </p>
                      <div className="read">
                        <div className="attes-checkbox">
                          <input
                            type="checkbox"
                            id="checkbox"
                            className="checkbox"
                            onChange={(e) => setCheckbox(e.target.checked)}
                          />
                        </div>
                        <label htmlFor="checkbox">
                          I authorize HealthPlan Freedom to enroll me in a
                          health insurance plan if, and only if, I qualify for a
                          $0 premium plan through the ACA.
                        </label>{" "}
                      </div>
                      <div className="read">
                        <div className="attes-checkbox">
                          <input
                            type="checkbox"
                            id="checkbox2"
                            className="checkbox"
                            onChange={(e) => setCheckbox2(e.target.checked)}
                          />
                        </div>
                        <label htmlFor="checkbox2">
                          I attest that all information provided in this form is
                          accurate.
                        </label>{" "}
                      </div>
                      <div className="read">
                        <div className="attes-checkbox">
                          <input
                            type="checkbox"
                            id="checkbox3"
                            className="checkbox"
                            onChange={(e) => setCheckbox3(e.target.checked)}
                          />
                        </div>
                        <label htmlFor="checkbox3">
                          I grant HealthPlan Freedom authorization to maintain
                          the agent of record until I withdraw my authorization
                          in writing. I also rescind and or revoke the agent of
                          record for any other agent, including but not limited
                          to:{" "}
                          <input
                            className="checkboxinput"
                            type="text"
                            name="txt_label_3"
                            id="txt_label_3"
                          />
                        </label>{" "}
                      </div>
                      <div className="read">
                        <div className="attes-checkbox">
                          <input
                            type="checkbox"
                            id="checkbox4"
                            className="checkbox"
                            onChange={(e) => setCheckbox4(e.target.checked)}
                          />
                        </div>
                        <label htmlFor="checkbox4">
                          I authorize the Correctional Facility and their
                          designated medical service provider to share any
                          necessary information about me required by HealthPlan
                          Freedom to complete my application for health
                          insurance and coordinate any necessary care upon
                          enrollment.I authorize HealthPlan Freedom, Inc  to share any health insurance policy information with the Correctional Facility and their medical service provider.
                        </label>{" "}
                      </div>
                    </div>

                    <div className="box-sig">
                      <div className="b15">
                        <p className="e_sign_txt">
                          <label htmlFor="signature">Electronic Signature</label>
                        </p>

                        {showCanvas ? (
                          <div className="flex flex-col items-center signature">
                            <SignatureCanvas
                              ref={signatureRef}
                              canvasProps={{
                                className: "sing",
                                style: { backgroundColor: "white" },
                              }}
                            />

                            <div className="e_sign">
                              <button
                                className="btn2" type="button"
                                onClick={clearSignature}
                              >
                                Clear
                                  </button>

                            </div>
                          </div>
                        ) : (
                            savedSignature && (
                              <div className="flex flex-col items-center cont3">
                                <div className="mt-4 cont4">
                                  <img
                                    src={savedSignature}
                                    alt="Saved Signature"
                                    className="border border-gray-400 w-60 h-20 bg-white cont5"
                                  />
                                </div>
                              </div>
                            )
                          )}
                      </div>


                      <div className="b15">
                        <p>
                          <label htmlFor="sign-date">Signature Date</label>
                        </p>
                        <input
                          type="text"
                          name="sign-date"
                          id="sign-date"
                          value={currentDateTime}
                          readOnly
                        />
                        {/* <input type='text' value={currentDate}></input> */}
                      </div>
                    </div>

                    <input
                      type="text"
                      name="ip_address"
                      id="ip_address"
                      value={ipAddress}
                      readOnly
                      required
                    />

                    <div className="box2">
                      <button className="submit-btn" type="submit" onClick={saveSignature}>
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>

      </section>
      <div className="footer-parent footer-Enroll">
        <div className="footer ">
          <div className='footer-align'>

            <img src="/images/hpf-logo.png" alt="" />

            <div className="privacy-terms-txt">
              <p>© Copyright 2024 - Proprietary and Confidential Property of  <span className='green-txt'>HealthPlan Freedom, Inc.</span> </p>
              <div> <Link to="/privacypolicy">Privacy Policy </Link>| <Link to="/termandconditions"> Terms of Use </Link></div></div>

          </div>
        </div>
      </div>
    </>
  );
};

export default EnrollForm;
