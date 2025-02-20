import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
const Footer = () => {
  return (
    <>
      <div className = "footer-parent">
      <div className="footer ">
        <div className='footer-align'> 
      <Link to="/">
          
          <img src="/images/hpf-logo.png" alt="" />
        </Link>
        
      
        <div className="privacy-terms-txt">
        <p>© Copyright 2024 - Proprietary and Confidential Property of  <Link to ="/" className='green-txt'>HealthPlan Freedom, Inc.</Link> </p>
         <div> <Link to ="/privacypolicy">Privacy Policy </Link>| <Link to= "/termandconditions"> Terms of Use </Link></div></div>
 
        </div>
      </div>
      </div>

    </>
  )
}
export default Footer
