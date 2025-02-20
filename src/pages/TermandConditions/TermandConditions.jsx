import React from 'react'
import Header from '../../layouts/Header/Header'
import Footer from '../../layouts/Footer/Footer'
import { Link } from 'react-router-dom'


const PrivacyPolicy = () => {

  //https://outlook.office365.com/owa/calendar/HPFreedom1@messerfinancial.com/bookings/
  return (
    <>
        <div className='navbar section'>
        <div className="navbar-logo">
        <img src="/images/hpf-logo.png" alt="" />
        {/* <Link to="/">
          
            <img src="/images/hpf-logo.png" alt="" />
          </Link> */}
            
        </div>
        {/* <div className="navbar-buttons">
      
           <a href="tel:8662952050" className="nav-button call-btn">Call Us Today <br/> (866) 295-2050</a>
            <Link to={ appointmenturl } target="_blank" className="nav-button schedule-btn">Schedule Your <br/>Appointment</Link>
           
        </div> */}
       
      </div>

      <section className='CHN-section'>
        <div className="section">
          <h2><span className='green-txt'>Terms of Service</span></h2>
          <div className="line"><p></p><img src="/images/line-logo.png" alt="" /><p></p></div>

          {/* <p className='helping-text'>Benefits of working with HealthPlan Freedom:</p> */}

          <div className="section benefits">
            <div className="policy-txt">
              <p className="policy-txt-para">Please read this User Terms of Service ("Agreement") carefully before entering any information in this Electronic Enrollment Authorization Form ("Webpage"). <br />By clicking the "Submit" button, you are acknowledging that you have reviewed this Agreement and agree to be bound by the terms and conditions of this Agreement and to conduct all activities related to the use of this Webpage with the utmost ethical integrity. In addition, you agree to adhere to all applicable laws, rules, regulations, guidelines, policies and procedures of governmental authorities; including, but not limited to, CMS and the Department of Insurance, and to be bound by the rules, regulations, guidelines, policies, and procedures of all applicable carriers. You are solely responsible and solely liable for any failure to comply with such laws, rules, regulations, guidelines, policies, or procedures.</p>
            </div>
          

         
            <div className="policy-head">
              <p>Webpage Use</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">You have been granted non-exclusive, non-transferable, revocable use of the Webpage solely for your individual use in strict accordance with the terms of this Agreement to assist;</p>
            </div>
            <div className="policy-txt">
            <ol>
              <li>Consumers, Applicants, Qualified Individuals and Enrollees in applying for Advance Payments of the Premium Tax Credit (“APTC”) and cost-sharing Reductions (“CSRs”) for Qualified Health Plans (“QHPs”), and/or in completing enrollment in QHPs; and</li>
            </ol>
            <div className="policy-txt">
              <p className="policy-txt-para">Any data collected or transmitted through this Electronic Enrollment Authorization Form, including, but not limited to, Personally Identifiable Information (PII) and Protected Health Information (PHI), was obtained with the applicant’s consent and permission.</p>
            </div>
            <div className="policy-txt">
              <p className="policy-txt-para">You acknowledge and understand that there is <strong>no guarantee</strong> that you will qualify for a subsidy of any kind or be enrolled in any health insurance plan upon submission of this Electronic Enrollment Authorization Form. You are providing Healthplan Freedom, Inc with authorization to enroll you in a Health Insurance Marketplace® plan if it is determined that you qualify to be enrolled.</p>
            </div>
            <div className="policy-txt">
              <p className="policy-txt-para">You may withdraw your authorization at any time by notifying HealthPlan Freedom, Inc in writing at the following address: <br />
              <br />
              HealthPlan Freedom, Inc<br />
2401 Sardis Rd <br />
Suite101<br />
Charlotte, NC 28227
</p> 

            </div>
            
            </div>
            
            <div className="policy-head">
              <p>Indemnification</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">You agree to indemnify, defend and hold us, our directors, officers, and employees, harmless from and against any and all claims, loss, damage, injury, liability, costs or expenses whatsoever (including reasonable attorney’s fees) arising out of, resulting from, or in any way connected with (i) any act, omission, misrepresentation, or conduct of yours whatsoever, (ii) your breach of any of the terms of this Agreement, or (iii) your violation of any law. This indemnification shall survive the termination of this Agreement.</p>
            </div>
            <div className="policy-head">
              <p>Governing Law</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">You consent and submit to the sole and exclusive jurisdiction and venue of the state and federal courts located in Mecklenburg County, North Carolina in connection with any lawsuit or other proceedings arising out of, related to, or in any way connected with this Agreement, without regard to conflict of law principles.</p>
            </div>

            <div className="policy-head">
              <p>Term of Agreement</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">We reserve the right to modify, suspend or discontinue, temporarily or permanently, access to the Webpage, in our sole discretion, with or without notice to you and without liability to you.</p>
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
