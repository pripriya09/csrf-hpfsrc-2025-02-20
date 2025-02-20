import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/Home';
import EnrollForm from '../pages/Enroll-Form/EnrollForm';
import HealthBenefits from '../pages/Healthbenefits/HealthBenefits';
import Nocostinsurance from '../pages/nocostinsurance/Nocostinsurance';
import User from '../pages/User/User'
import Cart from '../pages/AddToCart/Cart';
import Admin from '../pages/Admin/Admin';
import EAFTracker from '../pages/EAF-Tracker/EAFTracker';
import Login from '../pages/Login/Login';
import VerifySuccessfull from '../pages/VerifySuccessfull/VerifySuccessfull';
import VerifyUnSuccessfull from '../pages/VerifySuccessfull/VerifyUnSuccessfull';
import AlreadyVerified from '../pages/VerifySuccessfull/AlreadyVerified';
import TermandConditions from '../pages/TermandConditions/TermandConditions'
import PrivacyPolicy from '../pages/TermandConditions/PrivacyPolicy'
import FacilityUserManagement from '../pages/FacilityUserManagement/FacilityUserManagement'
import ResetPassword from '../pages/Login/ResetPassword'
import ClientPortal from '../pages/ClientPortal/ClientPortal';
import SpecialClientPortal from '../pages/ClientPortal/SpecialClientPortal';
import ClientPortalTermConditions from '../pages/TermandConditions/ClientPortalTermConditions';
import HPFagentportal from '../pages/EAF-Tracker/HPFagentportal'


//import UserDetails from '../components/PrintPdf/UserDetails ';
import UserDetailsAOR from '../components/PrintPdf/UserDetailsAOR';


import VerifyMail from '../pages/VerifyMail/VerifyMail';
import FacilityCode from '../pages/Facility-code/Facility-code';
import UserDetails from '../components/PrintPdf/UserDetails';
import FileUpload from '../pages/GDriveUpload/FileUpload';
import AllUserFiles from '../pages/GDriveUpload/UserFileDetails';
import DataFileUpload from '../pages/GDriveUpload/CSVFileUpload';
import Cookies from 'js-cookie';
// import Logout from '../components/Logout/Logout';




const RoutesPage = () => {
  const [isAdminLoggedIn, setAdminLoggedIn] = useState(!!Cookies.get("session"));

  const isAdminAuthenticated = () => {
    // Check if the admin is logged in or if the authentication token is present
    return Cookies.get("session");
  };

  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        Cookies.remove("session"); // Remove token from cookies
        setAdminLoggedIn(false);
        window.location.href = "/login";
      }, 15*60*1000);
    };

    const handleActivity = () => {
      resetInactivityTimer();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetInactivityTimer();
      }
    };

    if (isAdminAuthenticated()) {
      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("keydown", handleActivity);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      resetInactivityTimer();
      return () => {
        clearTimeout(inactivityTimer);
        window.removeEventListener("mousemove", handleActivity);
        window.removeEventListener("keydown", handleActivity);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [isAdminAuthenticated]);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      {/* <Route path='/logout' element={<Logout />} /> */}
      {/* <Route path='/enrollment-form' element={<EnrollForm />} /> */}
      <Route path='/enrollment-form' element={<EnrollForm />} />
      <Route path='/health-benefits' element={<HealthBenefits />} />
      <Route path='/nocostinsurance' element={<Nocostinsurance />} />
      <Route path='/cart' element={<Cart />} />

      {/* Conditional rendering for the /admin route */}
      <Route
        path='/admin'
        element={isAdminAuthenticated() ? <FacilityCode /> : <Navigate to='/login' />}
      />

      <Route
        path='/facilitycode'
        element={isAdminAuthenticated() ? <FacilityCode /> : <Navigate to='/login' />}
      />
      {/* Conditional rendering for the /EAFTracker route */}

      <Route
        path='/EAF-tracker'
        element={isAdminAuthenticated() ? <EAFTracker /> : <Navigate to='/login' />}
      />

    <Route
        path='/HPF-agentportal'
        element={isAdminAuthenticated() ? <HPFagentportal /> : <Navigate to='/login' />}
      />

      <Route
        path='/user'
        element={isAdminAuthenticated() ? <User /> : <Navigate to='/login' />}
      />
      <Route
        path='/facilityusermanagement'
        element={isAdminAuthenticated() ? <FacilityUserManagement /> : <Navigate to='/login' />}
      />

      <Route path='/login' element={<Login setAdminLoggedIn={setAdminLoggedIn} />} />
      <Route path='/verify-mail' element={<VerifyMail />} />
      <Route path='/verify-successfull' element={<VerifySuccessfull />} />
      <Route path='/verify-unsuccessfull' element={<VerifyUnSuccessfull />} />
      <Route path='/alreadycaptured' element={<AlreadyVerified />} />
      <Route path="/user-details/:userId" element={<UserDetails/>} />
      <Route path="/user-AOR/:userId" element={<UserDetailsAOR />} />
      <Route path="/termandconditions" element={<TermandConditions />} />
      <Route path="/clienttermandconditions" element={<ClientPortalTermConditions />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="/data-file-upload" element={<DataFileUpload />} />
      <Route
        path='/client-portal'
        element={isAdminAuthenticated() ? <ClientPortal /> : <Navigate to='/login' />}
     />
  <Route
  path='/special-client-portal'
  element={isAdminAuthenticated() ? <SpecialClientPortal /> : <Navigate to='/login' />}
  
/>

<Route 
 path='/admin-share-drive'
 element={isAdminAuthenticated() ? <AllUserFiles /> : <Navigate to='/login' />} />
    </Routes>
  );
};

export default RoutesPage;
