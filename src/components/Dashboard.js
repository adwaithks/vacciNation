import React, { useEffect , useContext } from 'react';
import Card from './Card';
import './Dashboard.css';
import { ContentContext } from '../context/ContentContext';

const districts = [
    {district_id:301,district_name:"Alappuzha"},
    {district_id:307,district_name:"Ernakulam"},
    {district_id:306,district_name:"Idukki"},
    {district_id:297,district_name:"Kannur"},
    {district_id:295,district_name:"Kasaragod"},
    {district_id:298,district_name:"Kollam"},
    {district_id:304,district_name:"Kottayam"},
    {district_id:305,district_name:"Kozhikode"},
    {district_id:302,district_name:"Malappuram"},
    {district_id:308,district_name:"Palakkad"},
    {district_id:300,district_name:"Pathanamthitta"},
    {district_id:296,district_name:"Thiruvananthapuram"},
    {district_id:303,district_name:"Thrissur"},
    {district_id:299,district_name:"Wayanad"}
]
    
const districtMap = {
        301:"Alappuzha",
        307:"Ernakulam",
        306:"Idukki",
        297:"Kannur",
        295:"Kasaragod",
        298:"Kollam",
        304:"Kottayam",
        305:"Kozhikode",
        302:"Malappuram",
        308:"Palakkad",
        300:"Pathanamthitta",
        296:"Thiruvananthapuram",
        303:"Thrissur",
        299:"Wayanad"
}

function Dashboard() {

    useEffect(() => {
        findByDistrict();
    }, []);


    const {date, 
        setDate,
        district, setDistrict,
        centers, setCenters} = useContext(ContentContext);

    const findByDistrict = async () => {
        if (date === '') {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); 
            let yyyy = today.getFullYear();
            let currentDate = dd + '-' + mm + '-' + yyyy;
            setDate(currentDate);
        }
        const uri = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${date}`;
        const res = await fetch(uri, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        });
        const response = await res.json();
        setCenters(response.sessions);
    }

    return (
        <div className="dashboard">
            <div className="search-container">
                <input className="date-picker" placeholder={date} type="date" onChange={(e) => {
                    let dateFormatting = e.target.value.split("-");
                    let date = dateFormatting[2] + '-' + dateFormatting[1] + '-' + dateFormatting[0]
                    window.localStorage.setItem('date', date);
                    setDate(date);
                    findByDistrict();
                }} />
                <select className="district-select" onChange={(e) => {
                    setDistrict(e.target.value);
                    window.localStorage.setItem('district', e.target.value);
                    findByDistrict();
                }}>
                    {
                        districts.map(eachDistrict => (
                            <option key={eachDistrict.district_id} value={eachDistrict.district_id}>{ eachDistrict.district_name}</option>
                        ))
                    }
                    
                </select>
            </div>

            
            <div className="contents">
                {
                    centers.length !== 0 ? (
                        centers.map((eachCenter, id) => (
                            <Card key={id} eachCenter={eachCenter} />
                        ))
                    ) : (
                            <h1 className="no-slots">No slots for {districtMap[district]} on {date}</h1>
                    )
                
                }
            </div>
            

        </div>
    )
}

export default Dashboard;
