import React from 'react'
import './HealthBenefits.css'
import Header from '../../layouts/Header/Header'
import Footer from '../../layouts/Footer/Footer'
import Benefits from '../../components/Benefits/Benefits';
import ContactUs from '../../components/ContactUs/ContactUs';
const HealthBenefits = () => {


  return (
    <>
      <Header />
      <section className='hb-hero '>
        <div className='section pr'>
          <h1>REHIP</h1>
          <h3>( RE-ENTRY HEALTH INSURANCE PROGRAM )</h3>
          <div className="line"><p></p><img src="/images/line-logo.png" alt="" /><p></p></div>
          <p className='hb-des'>HealthPlan Freedom’s REHIP specializes in helping re-entry citizens enroll in the best available health insurance plan considering their personal circumstances and healthcare needs.</p>
        </div>
      </section>
      <section className='hb-section'>
        <h2>Benefits of working with <span className='green-txt'>HealthPlan Freedom</span></h2>
        <div className='hb-section-chlid section'>
          <div className="hb-content">
            <div className="hb-left-content">
              <p>Offer health plans for all segments of your
                re-entry population</p>
              <div className="hb-left-content-chlid">
                <img src="./images/health-ins.png" className="health" alt="" />
                <p className="para">Under 65 – Affordable Care Act</p>
              </div>
              <div className="hb-left-content-chlid">
                <img src="./images/health-ins.png" className="health" alt="" />
                <p className="para">Over 65 – Medicare Supplement or Medicare Advantage</p>
              </div>
            </div>
            <div className="hb-right-content">
              <img src="images/hb-content1.png" alt="" />
            </div>
          </div>
          <div className="hb-content">
            <div className="hb-left-content">
              <p>The overwhelming majority of re-entry citizens will qualify for a no cost insurance plan through the ACA. For the very few that do not qualify for no cost or low cost insurance we offer other unique healthcare services.</p>
            </div>
            <div className="hb-right-content order">
              <img src="images/hb-content2.png" alt="" />
            </div>
          </div>
          <Benefits/>
          <div className="hb-left-content-chlid">
                <img src="./images/health-ins.png" className="health" alt="" />
                <p className="para">Over 65 – Medicare Supplement or Medicare Advantage</p>
              </div>
          <div className="hb-content">
          <div className="hb-left-content">
              <p>Multiple proven methodologies to engage re-entry population with over 5,000 former inmates enrolled (Dedicated Website/Dedicated Phone Number)</p>
            </div>
            <div className="hb-right-content ">
              <img src="images/hb-content3.png" alt="" />
            </div>
          </div>
          <div className="hb-content">
          <div className="hb-left-content">
              <p>Industry leading experience with over 750,000+ people currently enrolled in market place coverage with thousands of them being formerly incarcerated.</p>
            </div>
            <div className="hb-right-content order">
              <img src="images/hb-content4.png" alt="" />
            </div>
          </div>
          <div className="hb-content">
          <div className="hb-left-content">
              <p>Licensed, certified and trained experts in helping people enroll in all fifty states</p>
            </div>
            <div className="hb-right-content ">
              <img src="images/hb-content5.png" alt="" />
            </div>
          </div>
          <h3>We provide the resources and training for re-entry coordinators and program directors to seamlessly support their re-entry citizens obtain health insurance coverage. Call us at <a href="">866-295-2050</a> to learn more about REHIP.</h3>

        </div>

      </section>
      <ContactUs />
      <Footer />
    </>
  )
}

export default HealthBenefits
