import React, { useState } from 'react'
import './Card.css';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function twelveHourConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}




function Card({ eachCenter }) {
    const [hidden, setHidden] = useState(true);

    return (
        <div className={eachCenter.available_capacity > 0 ? 'card-available' : 'card-unavailable'}>
            <div className="card-name">
                <h2>{eachCenter.name.split('-')[0]}</h2>
                <ExitToAppIcon className="goto-cowin" onClick={() => {
                    window.open('https://selfregistration.cowin.gov.in/appointment', '_blank')
                }}></ExitToAppIcon>
            </div>
            <div className="card-preview">
                <div className="card-agelimit">
                    <h5>Min Age:  {eachCenter.min_age_limit}+</h5>
                </div>
                <div className="card-availibility">
                    {
                        eachCenter.available_capacity > 0 ? (
                            <h5 className="card-available-label">Available</h5>
                        ) : (
                            <h5 className="card-unavailable-label">Not Available</h5>
                        )
                    }
                </div>
                <div className="card-feetype">
                    {
                        eachCenter.fee_type === 'Free' ? <h5 className="card-feetypefree-label">Free</h5> : <h5 className="card-feetypepaid-label">Paid</h5>
                    }
                </div>
            </div>
            {
                hidden ? (
                    <div className="card-expand" onClick={() => {
                        setHidden(!hidden)
                    }}
                    ><h4>Expand</h4></div>
                ) : (
                    <>
                        <div className="card-address"><h4><span>Address: </span> {eachCenter?.address}</h4></div>
                        <div className="card-blockname"><h4><span>Block: </span>{eachCenter?.block_name}</h4></div>
                        <div className="card-date"><h4><span>Date: </span>{eachCenter?.date}</h4></div>
                        <div className="card-time"><h4><span>Timing: </span>{twelveHourConvert(eachCenter?.from)} - {twelveHourConvert(eachCenter?.to)}</h4></div>
                        {/*<div className="card-feetype"><h4><span>Fee Type:</span> {eachCenter.fee_type}</h4></div>*/}
                        <div className="card-vaccine"><h4><span>Vaccine:</span> {eachCenter?.vaccine.toUpperCase()}</h4></div>
                        <div className="card-doseamount">
                            <span className="dose1">Dose 1 available: {eachCenter?.available_capacity_dose1}</span>
                            <span className="dose2">Dose 2 available: {eachCenter?.available_capacity_dose2}</span>
                        </div>
                        <div className="card-slots">
                            <span>Available Slots</span>

                            <div className="card-slot-container">
                                {
                                    eachCenter.slots.map((slot, idx) => (
                                        <h6 className="slot" key={idx}>{slot.time}</h6>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="card-collapse" onClick={() => {
                            setHidden(!hidden)
                        }}
                        ><h4>Collapse</h4></div>
                    </>
                    
                )
            }
        </div>
    )
}

export default Card;
