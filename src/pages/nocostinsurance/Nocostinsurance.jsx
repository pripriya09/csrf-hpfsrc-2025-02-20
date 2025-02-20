import React, { useState } from 'react'
import axios from 'axios'
import './Nocostinsurance.css'
import Header from '../../layouts/Header/Header'
import Footer from '../../layouts/Footer/Footer'
import { Link } from 'react-router-dom'
import Modal from 'react-modal';
import ContactUs from '../../components/ContactUs/ContactUs'
import { appointmenturl ,carturl } from '../../constant/enviroment/enviroment'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'


const customStyles = {
  content: {
    // top: '50%',
    // left: '50%',
    // right: 'auto',
    // bottom: 'auto',
    // marginRight: '-50%',
    // transform: 'translate(-50%, -50%)',
  },
};
const rootElement = document.getElementById('root');
Modal.setAppElement(rootElement);

const Nocostinsurance = () => {

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  // function afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }

  function closeModal() {
    setIsOpen(false);
  }
  
  return (
    <>
    <ScrollToTop/>
      <Header />
 <div className="bg-cover">
      <section className='CHN-section section'>
        <h2>Capstone Health Network </h2>
        <div className="line"><p className=""></p><img src="/images/line-logo.png" alt="" /><p className=""></p></div>
        
        <p className='helping-text'>Helping people successfully transition back into society by providing access to high quality, essential healthcare & dental services. $29.95/month</p>
 <div className="btn-dsg">
            <a onClick={openModal} className="CHN-signup-btn">Sign-up Today</a>
            {/* <a href="/" className="CHN-appointment-btn">Included Benefits</a> */}
      </div>

        <p className='making-text'>Making Healthcare affordable for you and your family. The services are available in both English and Spanish. Telehealth and Mental health counseling services are provided for no additional charge. The services outlined below are included: </p>
       
        <div className="CHN-chlid one">
          <img src="/images/CHN-image1.png" alt="" />
          <div className='CHN-chlid-content'>
            <div>
              <span>Short-Term Mental Health Support</span>
              <p>5 Televisits per year get short-term help from Masters’ level counselors for stress, anxiety, depression, relationship issues, job losses, and more from home by phone or video. No counselor fees, deductibles, or co-pays!</p>
            </div>
            <div className='CHN-content'>
              <span>No-Charge Telemedicine Doctor Care from Home</span>
              <p>(Available - 24/7/365) Our U.S. telemedicine physicians are board-certified, licensed, and standing by to treat you and your family from the comfort and safety of your home 24 hours a day every day of the year by phone, devices, or video chat generally in 30-60 minutes. There are no doctor bills, deductibles, or co-pays! Get help for the top 75-80% health concerns such as a cold, fever, the flu, skin rash, pink eye, sore throat, nausea, sinus infection, earache, to ask a doctor a question, to request a prescription, etc.</p>
            </div>
          </div>
        </div>
        <div className="CHN-chlid two">
          <img src="/images/CHN-image2.png" alt="" />
          <div className='CHN-chlid-content'>
            <div>
              <span>Prescription Drug Discounts</span>
              <p>Save up to 85% on all FDA-approved prescriptions. Accepted at 64,000 pharmacies nationwide. Also includes prescriptions sent directly to your home from Canada or the UK via our international pharmacy. This can save you up to 85% on expensive medications!</p>
            </div>
            <div className='CHN-content'>
              <span>Discount Dental Services</span>
              <p>Save an average of 15-50% Per visit on services such as cleanings, x-rays, fillings, root canals, crowns, bridges, orthodontia, etc. at 240,000 dentists nationwide.</p>
            </div>
          </div>
        </div>
        <div className="CHN-chlid three">
          <img src="/images/CHN-image3.png" alt="" />
          <div className='CHN-chlid-content'>
            <div>
              <span>Diabetes Supplies Discounts</span>
              <p>Save 20-85% on name brand/generic diabetes supplies.</p>
            </div>
            <div className='CHN-content'>
              <span>Hearing Discounts</span>
              <p>Save up to 20-50% on brand-name hearing aids and more.</p>
            </div>
          </div>
        </div>
        <div className="CHN-chlid four">
          <img src="/images/CHN-image4.png" alt="" />
          <div className='CHN-chlid-content'>
            <div>
              <span>Vision Care Discounts</span>
              <p>Save up to 10-50% at 12,000 optical locations.</p>
            </div>
            <div className='CHN-content'>
              <span>Chiropractic Discounts</span>
              <p>Save up to 30% at 12,000 chiropractors.</p>
            </div>
            <div className='CHN-btn'>

            <a onClick={openModal} className="CHN-signup-btn">Sign-Up Today</a>

            <Link to={appointmenturl} target="_blank" className="CHN-appointment-btn">Schedule Your Appointment</Link>
             
            </div>
          </div>
        </div>
      </section>
     <ContactUs />
      </div>
      <div>
      
      <Modal
        isOpen={modalIsOpen}
       // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        // style={customStyles}
        // contentLabel="Example Modal"
        className="section modal"
      >
        <h2 className='modal-heading'>Program 1. CapstoneCare Premium (BEST VALUE)</h2>
        <button onClick={closeModal} className='modal-close-btn'><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="currentColor">
                                <path d="M13.4 12l10.3 10.3-1.4 1.4L12 13.4 1.7 23.7.3 22.3 10.6 12 .3 1.7 1.7.3 12 10.6 22.3.3l1.4 1.4L13.4 12z">
                                </path>
                            </svg></button>
        <p>New Member Pricing: $29.95 month one. Month two is FREE! Just $26.95 for month three and beyond</p>
        <p><strong>No-Charge Telemedicine Doctor Care from Home</strong>Our U.S. telemedicine physicians are board-certified, licensed, and standing by to treat you and your family from the comfort and safety of your home 24 hours a day every day of the year by phone, devices, or video chat generally in 30-60 minutes. There are NO doctor bills, deductibles, or co-pays! Get help for the top 75-80% health concerns such as a cold, fever, the flu, skin rash, pink eye, sore throat, nausea, sinus infection, earache, to ask a doctor a question, to request a prescription, etc. Available in English and Spanish</p>
        <p><strong>Short-Term Mental Health Support. </strong>Get short-term help from Masters’ level counselors for stress, anxiety, depression, relationship issues, job losses, and more from home by phone or video. NO counselor fees, deductibles, or co-pays!</p>
        <p><strong>Prescription Drug Discounts.</strong>Save up to 85% on all FDA-approved prescriptions. Accepted at 64,000 pharmacies nationwide. Card members have saved over $1 Billion dollars! Also includes prescriptions sent directly to your home from Canada or the UK via our international pharmacy. This can save you up to 85% on expensive medications!</p>
        <p><strong>Discount Dental Services.</strong>Save an average of 15-50% per visit on cleanings, x-rays, fillings, root canals, crowns, bridges, orthodontia, etc. at 240,000 dentists nationwide</p>
        <p><strong>Vision Care Discounts.</strong>Save up to 10-50% at 12,000 optical locations</p>
        <p><strong>Chiropractic Discounts.</strong>Save up to 30% at 12,000 chiropractors</p>
        <p><strong>Diabetes Supplies Discounts.</strong>Save 20-85% on name brand/generic diabetes supplies</p>
        <p><strong>Hearing Discounts.</strong>Save up to 20-50% on brand-name hearing aids and more</p>
        <p className='modal-note'>*This program provides access to essential healthcare services. This is not traditional health insurance.</p>
        <a className="pay-btn" href={carturl} target="_blank">PAY $29.95 AND GET ONE MONTH FREE</a>
      </Modal>
    </div>
      <Footer/>
    </>
  )
}

export default Nocostinsurance
