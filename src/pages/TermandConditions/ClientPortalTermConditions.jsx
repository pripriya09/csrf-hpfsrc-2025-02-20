import React from 'react'
import Header from '../../layouts/Header/Header'
import Footer from '../../layouts/Footer/Footer'
import { Link } from 'react-router-dom'


const ClientPortalTermConditions = () => {

  
  return (
    <>
      <Header />

      <section className='CHN-section'>
        <div className="section">
          <h2><span className='green-txt'>Terms of Service</span></h2>
          <h3 className="client-head-text">Client Portal User Agreement </h3>
          
          <div className="line"><p></p><img src="/images/line-logo.png" alt="" /><p></p></div>

          {/* <p className='helping-text'>Benefits of working with HealthPlan Freedom:</p> */}

          <div className="section benefits">
            <div className="policy-txt">
              <p className="policy-txt-para">Please read this User Agreement ("Agreement") carefully before accessing and using the Agent Portal ("Application"). <br /><br />By logging into the is Application, you are acknowledging you have reviewed this Agreement and agree to be bound by the terms and conditions of this Agreement and to conduct all activities related to the use of this Application with the utmost ethical integrity. In addition, you agree to adhere to all applicable laws, rules, regulations, guidelines, policies and procedures of all local, state and federal governmental authorities.  You are solely responsible and solely liable for any failure to comply with such laws, rules, regulations, guidelines, policies, or procedures.</p>
            </div>
          

         
            <div className="policy-head">
              <p>Application Use</p>
            </div>

            <div className="policy-txt">
              <p className="policy-txt-para">You have been granted non-exclusive, non-transferable, revocable use of the Application solely for your individual use in strict accordance with the terms of this Agreement to assist;</p>
            </div>
            <div className="policy-txt">
            <ol>
              <li>an Individual in submitting an Enrollment Authorization Form to HealthPlan Freedom for the purposes of determining if the individual qualifies for apply for Advance Payments of the Premium Tax Credit (“APTC”) and cost-sharing Reductions (“CSRs”) for Qualified Health Plans (“QHPs”), on the Health Insurance Marketplace®.</li>
            </ol>
            <div className="policy-txt">
              <p className="policy-txt-para">You are not permitted to disclose your Username/Password to the Application to others, or in any way, allow others to use the Application with your Username/Password under any circumstances. If at any time your Username/Password and/or device are compromised or you suspect that your Username/Password and/or device may have been compromised, you agree to notify us immediately.</p>
            </div>
            <div className="policy-txt">
              <p className="policy-txt-para">Further, you acknowledge that the Application is not a consumer-facing application. You are prohibited from allowing anyone to view or access the Application in any way, including, but not limited to, via screen share or other comparable technical functionality.</p>
            </div>
            <div className="policy-txt">
              <p className="policy-txt-para">You shall ensure that any individual data collected or transmitted through the Application, including, but not limited to, Personally Identifiable Information (PII) and Protected Health Information (PHI), was obtained with the client’s consent and permission. You are responsible for taking all appropriate actions to secure PHI, PII, and all confidential client information collected, transmitted and stored via the Application, including, but not limited to, securing the device(s) on which you access the Application. You are fully liable for any breach or disclosure of PHI, PII, or confidential client information resulting from your failure to take such appropriate actions.</p>
            </div>
            <div className="policy-txt">
              <p className="policy-txt-para">We assume no responsibility or liability for any aspect of the use of the data displayed on the Application.</p>
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
              <p className="policy-txt-para">We reserve the right to modify, suspend or discontinue, temporarily or permanently, access to the Application, in our sole discretion, with or without notice to you and without liability to you.</p>
            </div>
 
          </div>
        </div>
      </section>
   
      <div className = "footer-parent">
      <div className="footer ">
        <div className='footer-align'> 
        <img src="/images/hpf-logo.png" alt="" />
          <div className="privacy-terms-txt">
        <p>© Copyright 2024 - Proprietary and Confidential Property of  <Link to ="/" className='green-txt'>HealthPlan Freedom, Inc.</Link> </p>
         <div> <Link to ="/privacypolicy">Privacy Policy </Link>| <Link to= "/termandconditions"> Terms of Use </Link></div></div>  
 
        </div>
      </div>
      </div>
    </>
  )
}

export default ClientPortalTermConditions
