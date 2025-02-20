import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import { appointmenturl } from '../../constant/enviroment/enviroment'
import CustomGoogleTranslate from '../../components/comman/CustomGoogleTranslate'


const Header = () => {
  return (
    <section className="navigation ">
      <div className='navbar section'>
        <div className="navbar-logo">
        <Link to="/">
          
            <img src="/images/hpf-logo.png" alt="" />
          </Link>
            
        </div>
        <div className="navbar-buttons">
      
           <a href="tel:8662952050" className="nav-button call-btn">Call Us Today <br/> (866) 295-2050</a>
            <Link to={ appointmenturl } target="_blank" className="nav-button schedule-btn">Schedule Your <br/>Appointment</Link>
            {/* <CustomGoogleTranslate /> */}
        </div>
       
      </div>
    </section>
  )
}

export default Header
