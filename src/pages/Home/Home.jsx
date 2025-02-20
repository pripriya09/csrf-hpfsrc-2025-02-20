import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import Header from '../../layouts/Header/Header'
import Footer from '../../layouts/Footer/Footer'
import Benefits from '../../components/Benefits/Benefits';
import { appointmenturl } from '../../constant/enviroment/enviroment'

const Home = () => {

  //https://outlook.office365.com/owa/calendar/HPFreedom1@messerfinancial.com/bookings/
  return (
    <>
      <Header />
      <div className='home'>
        <section className="hero-section section pr">
          <div className="hero-section-left">
            <h1>You May Qualify For
              <span className='green-txt'> No Cost </span> Health
              Insurance</h1>
            <div className='hero-buttons'>
              <a href="tel:8662952050" className="hero-button signup-btn">Call Us Today <br /> (866) 295-2050</a>
              <Link to={appointmenturl} target="_blank" className="hero-button benefit-btn">Schedule Your <br />Appointment</Link>
            </div>
            <p>Hours of Operation: 8AM - 5PM EST</p>
            <p>(Monday - Friday)</p>
          </div>
          <div className="hero-section-right">

          <img src="./images/hero-image.png" className="health" alt="" />
          </div>
        </section>
      </div>
      <section className='CHN-section'>
        <div className="section">
        <h2><span className='green-txt'>Benefits of working with HealthPlan Freedom</span></h2>
        <div className="line"><p></p><img src="/images/line-logo.png" alt="" /><p></p></div>
        
        {/* <p className='helping-text'>Benefits of working with HealthPlan Freedom:</p> */}

        <div className="section benefits">
        <div className="box">
            <img src="./images/health-ins.png" className="health" alt="" />
            <p className="para">The overwhelming majority of your pre-trial and re-entry citizens will qualify for a no cost insurance plan through the ACA. For the very few that do not qualify for no cost or low cost insurance we offer other unique healthcare services.</p>
        </div>
        <Benefits/>
        <div className="box">
            <img src="./images/health-ins.png" className="health" alt="" />
            <p className="para">Resources offered in multiple languages (Se habla Español)</p>
        </div>
        <div className="box">
            <img src="./images/health-ins.png" className="health" alt="" />
            <p className="para">Offer health plan options for most segments of your inmate population</p>
        </div>
        <div className="benefit-box-parent">
            <div className="benefit-box">
                <div className="benefit-box-1">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Under 65</h5>
                </div>
                <div className="benefit-box-2">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Over 65</h5>
                </div>

            </div>
        </div>
        <div className="box">
            <img src="./images/health-ins.png" className="health" alt="" />
            <p className="para">Industry leading experience with over 500,000+ people currently enrolled in marketplace (ACA) coverage with thousands of them being formerly incarcerated</p>
        </div>
        <div className="box">
            <img src="./images/health-ins.png" className="health" alt="" />
            <p className="para">Licensed, certified and trained experts helping people enroll in all fifty states</p>
        </div>
        <div className="box">
            <img src="./images/health-ins.png" className="health" alt="" />
            <p className="para">Vision and Dental coverage may also be available</p>
        </div>
        
    </div>
 
 <div className="btn-dsg">
             <a href="tel:8662952050" className="CHN-signup-btn">Call Us Today <br /> (866) 295-2050</a>
            <Link to={appointmenturl} target="_blank"className="CHN-appointment-btn">Schedule Your <br /> Appointment</Link>
            
      </div>

      </div>
      </section>
      <div className="btm-footer">
      <div className="btm-txt section"> For those very few who do not qualify for no cost insurance we offer our Capstone Health Network solution as a cost effective alternative to maintain the continuity of care. Click the following button to learn more about our Capstone Health Network. </div>
      <div className="btn-dsg">
            <Link to="/nocostinsurance" className="CHN-appointment-btn">Capstone Health Network</Link>
      </div>
      </div>
   

      <Footer/>
    </>
  )
}

export default Home
