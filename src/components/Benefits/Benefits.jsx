import React from 'react'
import './Benefits.css'
const Benefits = () => {
  return (
    <>
    <div className="benefits">
    <div className="box">
            <img src="./images/health-ins.png" className="health" alt="" />
            <p className="para">All ACA plans must cover ten essential health benefits:</p>
        </div>
        <div className="benefit-box-parent">


            <div className="benefit-box">
                <div className="benefit-box-1">
                    <div className="circle">
                        <img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Hospitalizations (Inpatient)</h5>
                </div>
                <div className="benefit-box-2">
                    <div className="circle">
                    <img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Mental Health
                        & Substance Abuse</h5>
                </div>

            </div>
            <div className="benefit-box">
                <div className="benefit-box-1">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Ambulatory Care Services
                        (Outpatient Care)</h5>
                </div>
                <div className="benefit-box-2">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Prescription Drugs</h5>
                </div>

            </div>
            <div className="benefit-box">
                <div className="benefit-box-1">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Emergency & Urgent Care</h5>
                </div>
                <div className="benefit-box-2">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Rehabilitation Services
                        (like physical therapy)</h5>
                </div>

            </div>
            <div className="benefit-box">
                <div className="benefit-box-1">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Primary Care
                        (Preventive Care/Wellness)</h5>
                </div>
                <div className="benefit-box-2">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Pregnancy & Maternity</h5>
                </div>

            </div>
            <div className="benefit-box">
                <div className="benefit-box-1">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Laboratory Services</h5>
                </div>
                <div className="benefit-box-2">
                    <div className="circle"><img src="images/plus.png" alt="" />
                    </div>
                    <h5 className="box-para">Pediatric Services</h5>
                </div>

            </div>
        </div>
        </div>
      
    </>
  )
}

export default Benefits
