import React, { useEffect, useState,useContext } from 'react';
import Card from './Card';
import './Dashboard.css';
import SearchIcon from '@material-ui/icons/Search';
import { ContentContext } from '../context/ContentContext';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";


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
        if (Notification.permission === false) {
            requestNotifPerm();
        }
        if (!window.localStorage.getItem('district')) {
            window.localStorage.setItem('district', '301');
        }
        window.localStorage.setItem('wwstatus', 'uninit')
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); 
        let yyyy = today.getFullYear();
        let currentDate = dd + '-' + mm + '-' + yyyy;
        window.localStorage.setItem('date', currentDate);
        setLoaderVisibility(true);
        findByDistrict();
        const perm = async () => {
            let permission = await Notification.requestPermission();
            console.log(permission);
        }
        if (Notification.permssion === false) { perm(); }
    }, []);


    const {date, 
        setDate,
        district, setDistrict,
        centers, setCenters,
        onlyAvailable, setOnlyAvailable, availCenters, setAvailCenters} = useContext(ContentContext);
    const [loaderVisibility, setLoaderVisibility] = useState(false);

    /*const spawnWebWorker = () => {
        if (!window.Worker || window.localStorage.getItem('wwstatus') === 'finished' || window.localStorage.getItem('availCenters') === []) {
            console.log('returned')
            return;
        }
        const worker1 = new Worker(`${process.env.PUBLIC_URL}/web-worker.js`);
        console.log('worker setup done')
        worker1.onmessage = function (e) {
            switch (e.data) {
                case 'finished':
                    window.localStorage.setItem('wwstatus', 'finished');
                    worker1.terminate();
                    console.log('worker terminated')
            }
    
        }
        worker1.postMessage({
            centers: availCenters,
            token: window.localStorage.getItem('token'),
            district: window.localStorage.getItem('district')
        });
    }*/

    const requestNotifPerm = () => {
        Notification.requestPermission(function (status) {
            console.log('notif perm: ' + status);
        });
    }

    const findByDistrict = async () => {
        console.log('date: ' + date);
        console.log('district: ' + district);
        if (date === '') {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); 
            let yyyy = today.getFullYear();
            let currentDate = dd + '-' + mm + '-' + yyyy;
            setDate(currentDate);
        }
        const uri = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${window.localStorage.getItem('district')}&date=${window.localStorage.getItem('date')}`;
        const res = await fetch(uri, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        });
        const response = await res.json();
        function checkAvailability(each) {
            return each.available_capacity > 0;
          }
          
        setLoaderVisibility(false);
        console.log(response.sessions);
        setCenters(response.sessions);
        console.log(response.sessions.filter(checkAvailability));
        setAvailCenters(response.sessions.filter(checkAvailability));
        if (response.sessions.filter(checkAvailability).length > 0) {
            window.localStorage.setItem('wwstatus', 'running');
            //spawnWebWorker();
         }
        window.localStorage.setItem('availCenters', JSON.stringify(response.sessions.filter(checkAvailability)));
    }

    return (
        <div className="dashboard">
            <div className="search-container">
                <div className="search-fields">
                    <input className="date-picker" placeholder='dd/MM/yyyy' type="date" onChange={(e) => {
                    let dateFormatting = e.target.value.split("-");
                    let date = dateFormatting[2] + '-' + dateFormatting[1] + '-' + dateFormatting[0]
                    window.localStorage.setItem('date', date);
                    setDate(date);
                    setLoaderVisibility(true);
                    findByDistrict();
                }} />
                <select className="district-select" onChange={(e) => {
                    setDistrict(e.target.value);
                        window.localStorage.setItem('district', e.target.value);
                        setLoaderVisibility(true);
                    findByDistrict();
                }}>
                    {
                        districts.map(eachDistrict => (
                            <option key={eachDistrict.district_id} value={eachDistrict.district_id}>{ eachDistrict.district_name}</option>
                        ))
                    }
                    
                    </select>
                </div>
                <div className="available-checkbox-container"  onChange={() => {
                        setOnlyAvailable(!onlyAvailable);
                    }} >
                    <input checked={onlyAvailable} onChange={(e) => {
                        setOnlyAvailable(e.target.checked);
                    }}type="checkbox"/>
                    <h5>Show only available slots ?</h5>
                    </div>
                <div className="find-btn-container">
                    <button  className="find-btn" onClick={() => {
                    setLoaderVisibility(true);
                    findByDistrict();
                    }}><SearchIcon className="search-icon" />Find Slots</button>
                    </div>
            </div>

            <Loader
            className="loader"
            type="Bars"
            color="rgba(226, 226, 226, 0.589)"
            height={80}
            width={80}
            visible={loaderVisibility}
            />
            <div className="contents">
                {
                    (centers.length !== 0 && onlyAvailable === false) ? (
                        centers.map((eachCenter, id) => (
                            <Card key={id} eachCenter={eachCenter} />
                        ))
                    ) : (centers.length !== 0 && onlyAvailable === true) ? (
                        availCenters.length !== 0 ? (
                            availCenters.map((eachCenter, id) => (
                                    <Card key={id} eachCenter={eachCenter} />
                            ))) : <h1 className="no-slots">No slots for {districtMap[district]} on {date}</h1>
                    ) : (
                            <h1 className="no-slots">No slots for {districtMap[district]} on {date}</h1>
                    )
                }
            </div>
            

        </div>
    )
}

export default Dashboard;
