import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './VerifySuccessfull.css'

const VerifySuccessfull = () => { 


  return (
    <>
      <div className="verify-success">
  <div className="success-box">
    <svg
      className="ft-green-tick"
      xmlns="http://www.w3.org/2000/svg"
      height={100}
      width={100}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <circle className="circle" fill="#5bb543" cx={24} cy={24} r={22} />
      <path
        className="tick"
        fill="none"
        stroke="#FFF"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M14 27l5.917 4.917L34 17"
      />
    </svg>
    <h1>Verification Successful!</h1>
   
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

export default VerifySuccessfull
