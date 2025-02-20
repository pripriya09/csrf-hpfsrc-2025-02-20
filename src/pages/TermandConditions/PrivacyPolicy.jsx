import React from 'react'

import { Link } from 'react-router-dom'
import Header from '../../layouts/Header/Header'
import Footer from '../../layouts/Footer/Footer'
import Benefits from '../../components/Benefits/Benefits';
import { appointmenturl } from '../../constant/enviroment/enviroment'

const PrivacyPolicy = () => {

  //https://outlook.office365.com/owa/calendar/HPFreedom1@messerfinancial.com/bookings/
  return (
    <>
      <div className='navbar section'>
        <div className="navbar-logo">
        <img src="/images/hpf-logo.png" alt="" />
        {/* <Link to="/">
          
            <img src="/images/hpf-logo.png" alt="" />
          </Link>
             */}
        </div>
        {/* <div className="navbar-buttons">
      
           <a href="tel:8662952050" className="nav-button call-btn">Call Us Today <br/> (866) 295-2050</a>
            <Link to={ appointmenturl } target="_blank" className="nav-button schedule-btn">Schedule Your <br/>Appointment</Link>
           
        </div> */}
       
      </div>

      <section className='CHN-section'>
        <div className="section">
          <h2><span className='green-txt'>Privacy Policy</span></h2>
          <div className="line"><p></p><img src="/images/line-logo.png" alt="" /><p></p></div>

          {/* <p className='helping-text'>Benefits of working with HealthPlan Freedom:</p> */}

          <div className="section benefits">
            <div className="policy-txt">
              <p className="policy-txt-para">HealthPlan Freedom, Inc. is committed to protecting your privacy. We recognize that the privacy of your personal information is important and provide this policy to explain how we safeguard and use personal information. This Privacy Policy applies to the application and governs data collection and usage. By accessing the application, you consent to the data practices described in this policy. Your use of the application constitutes your acceptance and agreement to all terms, conditions, and notices contained within this policy. <br /><br />This Privacy Policy does not apply to information collected through other means such as by telephone or in-person.</p>
            </div>
             
            <div className="policy-head">
              <p>Collection of your Personal Information</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">Users of the application collect the personal information you provide directly to them to deliver the services you have requested. Those services may include providing quotes and other information related to healthcare plans, completion and/or submission of healthcare plan applications, and servicing/updating existing healthcare plans. This application may include web pages that give you the opportunity to provide us with personal information about yourself. You do not have to provide us with personal information if you do not want to. Personal information will not be collected from you without your knowledge or consent. Providing this personal information is always voluntary.</p>
            </div>

            <div className="policy-head">
              <p>Sharing of your Personal Information</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">Except for the following, we will not sell or share your personal information with any third party without your prior consent.</p>
            </div>
            <div className="policy-txt">
            <ol>
              <li> The Centers for Medicare and Medicaid Services (“CMS”) to obtain eligibility information on your behalf and/or to enroll you in healthcare plans.</li>
              <li>Insurance companies for the submission of a healthcare plan application. </li>
              <li> Governmental agencies, but only to the extent required by law.</li>
              <li> Correctional facility and their medical service provider</li>
            </ol>
            </div>
            <div className="policy-head">
              <p>Application and Information Security</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">We maintain reasonable administrative, technical, and physical security safeguards designed to protect the information that you provide from unauthorized access, use, or theft. Despite these safeguards, no security system is impenetrable, and we cannot fully guarantee the security of your personal information nor are we liable for the illegal acts of third parties.</p>
            </div>
            <div className="policy-head">
              <p>Use of Electronic Mail</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">Most e-mail systems do not provide a completely secure and confidential means of communication. It is possible that your e-mail communication may be accessed or viewed inappropriately by another Internet user while in transit.</p>
            </div>
            <div className="policy-head">
              <p>Use of Cookies</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">We use cookies only as a means of providing the functionality of the application (ex. enabling account login) and to provide the best possible user experience. We do not use cookies for application tracking or monitoring purposes.</p>
            </div>

            <div className="policy-head">
              <p>Changes to This Privacy Policy</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">We may update or modify this Privacy Policy or our Terms of Service without notice. If we do so, such changes will appear on this page of our application. It is your responsibility to review the Privacy Policy when you use this application. By continuing to use this application you consent to any changes to our Privacy Policy or Terms of Service. This statement is not intended to, and does not, create any contractual or other legal right in or on behalf of any party.</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para"> This site is not connected in any way to Health Insurance Marketplace®.</p>
            </div>
          </div>
        </div>
      </section>
   
      <div className = "footer-parent">
      <div className="footer ">
        <div className='footer-align'> 
        <img src="/images/hpf-logo.png" alt="" />
         <div className="privacy-terms-txt">
        <p>© Copyright 2024 - Proprietary and Confidential Property of  <span className='green-txt'>HealthPlan Freedom, Inc.</span> </p>
         <div> <Link to ="/privacypolicy">Privacy Policy </Link>| <Link to= "/termandconditions"> Terms of Use </Link></div></div>  
 
        </div>
      </div>
      </div>
    </>
  )
}

export default PrivacyPolicy
