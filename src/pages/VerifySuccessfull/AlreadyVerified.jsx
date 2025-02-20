import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './VerifySuccessfull.css'

const Alreadyverify = () => { 


  return (
    <>
      <div className="verify-success">
        
  <div className="unsuccess-box">

  
      <svg   className="save__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <path d="M22,4h-2v6c0,0.552-0.448,1-1,1h-9c-0.552,0-1-0.448-1-1V4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18  c1.105,0,2-0.895,2-2V8L22,4z M22,24H8v-6c0-1.105,0.895-2,2-2h10c1.105,0,2,0.895,2,2V24z"/>
        <rect height="5" width="2" x="16" y="4"/></svg>



    <h1>Verification Status Already Captured!</h1>
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

export default Alreadyverify
