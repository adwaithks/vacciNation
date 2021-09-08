import React, { useContext, useState } from 'react'
import { ContentContext } from '../context/ContentContext';


function FeeTypeFilter() {

    const { setFeeTypeFilter } = useContext(ContentContext);

    return (
        <div className="fee-type-filter">
            <button onClick={() => {
                setFeeTypeFilter("All");
            }} className="fee-type-option">All</button>
            <button onClick={() => {
                setFeeTypeFilter("Free");
            }} className="fee-type-option">Free</button>
            <button onClick={() => {
                setFeeTypeFilter("Paid");
            }} className="fee-type-option">Paid</button>
        </div>
    )
}

export default FeeTypeFilter
