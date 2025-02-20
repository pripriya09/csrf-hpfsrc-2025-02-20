import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './VerifySuccessfull.css'

const VerifyUnSuccessfull = () => { 


  return (
    <>
      <div className="verify-success">
        
  <div className="unsuccess-box">

  <svg className="cross__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
  				<circle className="cross__circle" cx="26" cy="26" r="25" fill="none"/>
				  <path className="cross__path cross__path--right" fill="none" d="M16,16 l20,20" />
  <path className="cross__path cross__path--right" fill="none" d="M16,36 l20,-20" />
			</svg>
    <h1>Verification Declined!</h1>
    <strong>Please contact HPF if you want to change the verification status.</strong>
    <p>
      <strong>If we have any questions we will reach out to you.  Have a great day!</strong>
      
    </p>
    <div className="successbutton">
      <Link to="/">
          <button className="dropbtn"><i className="fa-solid fa-home"></i> &nbsp; Back to Home</button>
          </Link>
          </div>
  </div>
</div>

    </>
  )
}

export default VerifyUnSuccessfull
