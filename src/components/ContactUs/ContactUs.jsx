import React, { useState } from 'react'
import axios from 'axios';
import './ContactUs.css'
import { contacturl } from '../../constant/enviroment/enviroment'
 
const ContactUs = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    info: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
 
 const handleSubmit = async (e) => {
    e.preventDefault();
//console.log(formData)
    try {
      const response = await axios.post(contacturl, formData);
      //console.log('API Response:', response.data);

      // Reset the form after successful submission
      setFormData({
        name: '',
        email: '',
        number: '',
        info: ''
      });
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };



  return (
    <>
      <section className='contact-us '>
        <div className="contact-us-section section pr">
          <div className="contact-us-left">
            <h3>HealthPlan Freedom Care Premium Covers
              The <span className='green-txt'>Member</span> And Their Family
              at <span className='green-txt'>no extra Cost</span></h3>
            <p>A Family is the Member plus their Spouse/Significant Other and their Dependent Children up to 26 years old. Note: the HealthPlan FreedomCare Premium Plan is not available in Alaska, Montana, Rhode Island, Utah, Vermont, and the state of Washington.</p>
          </div>
          <div className="contact-us-right">
            <h4>Contact <span className='green-txt'>Us</span></h4>
            <p>Fill out this form and we will contact you within 24 business hours to see what services you quality for with us.</p>
            <form onSubmit={handleSubmit}>
      <div className='form-input'>
        <div className='form-input-child'>
          <label htmlFor="name">Name</label>
          <input
            id='name'
            type="text"
            name="name"
            placeholder='Enter Your Name'
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className='form-input-child'>
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder='Enter Your Email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className='form-input-child'>
          <label htmlFor="number">Phone Number</label>
          <input
            type="number"
            name="number"
            id="number"
            placeholder='Enter Your Number'
            value={formData.number}
            onChange={handleChange}
          />
        </div>
        <div className='form-input-child'>
          <label htmlFor="info">Additional Info.</label>
          <input
            id='info'
            type="text"
            name="info"
            placeholder='Enter Info.'
            value={formData.info}
            onChange={handleChange}
          />
        </div>
      </div>
      <input type="submit" value="Submit" />
    </form>
          </div>

        </div>

      </section>
 
    </>
  )
}

export default ContactUs
