import { ContentContext } from './context/ContentContext';
import { useContext } from 'react';

let districtDataNew = [];

function checkAvailability(each) {
    return each.available_capacity > 0
  }

const findByDistrict = async () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let currentDate = dd + '-' + mm + '-' + yyyy;
    
    const uri = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${window.localStorage.getItem('district')}&date=${currentDate}`;
    if (navigator.onLine && window.localStorage.getItem('token')) {
        const res = await fetch(uri, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        });
        const response = await res.json();
        districtDataNew = response.sessions.filter(checkAvailability);
    } 
}


const notification = () => {
    const { availCenters } = useContext(ContentContext);
    
    const checkFor = (center) => {
        availCenters.map(each => {
            if (center.name === each.name || center.address === each.address) {
                return true;
            }
        });
        return false;
    }

    districtDataNew.map(newEntry => {
        let result = checkFor(newEntry);
        if (result && Notification.permission === true) {
            navigator.serviceWorker.getRegistration().then(function (reg) {
                var options = {
                    body: `${newEntry.address}`,
                    vibrate: [100, 50, 100],
                    data: {
                        dateOfArrival: 'Now',
                    }
                };
                reg.showNotification(`New available slot ${newEntry.name.split('-')[0]}`, options);
            });
        }
    })
}

export default notification;