import React, {createContext, useState} from 'react';

export const ContentContext = createContext(null);


const ContentProvider = ({children}) => {

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
    let yyyy = today.getFullYear();
    let currentDate = dd + '-' + mm + '-' + yyyy;
    const [date, setDate] = useState(currentDate);
    const [district, setDistrict] = useState(301);
    const [centers, setCenters] = useState([]);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [availCenters, setAvailCenters] = useState([]);
    
    return (
        <ContentContext.Provider value={{
            date, setDate,
            district, setDistrict,
            centers, setCenters,
            onlyAvailable, setOnlyAvailable,
            availCenters, setAvailCenters,
        }}>{children}</ContentContext.Provider>
    )
}


export default ContentProvider;