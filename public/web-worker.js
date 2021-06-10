onmessage = function (e) {
    let districtDataNew = [];
    var count = 0;

    function checkAvailability(each) {
        return each.available_capacity > 0
      }
    
    const findByDistrict = async () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        let currentDate = dd + '-' + mm + '-' + yyyy;
        
        const uri = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${e.data.district}&date=${currentDate}`;
        if (navigator.onLine && e.data.token) {
            const res = await fetch(uri, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + e.data.token
                }
            });
            const response = await res.json();
            districtDataNew = response.sessions.filter(checkAvailability);
            console.log('new data of ' + e.data.district + ': ' + JSON.stringify(districtDataNew));
        }
    }
    
    
    const notification = async () => {
        count += 1;
        const availCenters = e.data.centers;
        console.log('[+] finding by district');
        findByDistrict();

        const checkFor = (center) => {
            console.log('[+] Checking for new center: ' + center + 'in available center');
            availCenters.map(each => {
                console.log(center.name + ' capacity: ' + center.available_capacity + ' ' + each.name + 'capacity: ' + each.available_capacity);
                if (center.name === each.name || center.address === each.address) {
                    if (center.available_capacity > each.available_capacity) {
                        console.log('Returning true for :::::: ' + center.name + ' capacity: ' + center.available_capacity + ' ' + each.name + 'capacity: ' + each.available_capacity);
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            console.log('Returning true for :::::: ' + center.name + ' capacity: ' + center.available_capacity);
            return true;
        }
        if (Notification.permission === 'denied') {
            let permission = await Notification.requestPermission();
            console.log(permission)
        }
    
        districtDataNew.map(newEntry => {
            let result = checkFor(newEntry);
            //console.log('[+] result: ' + result + ':: '  + JSON.stringify(newEntry));
            
            if (result === true && Notification.permission === 'granted') {
                console.log('[++++++] NEW CENTER: ' + newEntry.name)
                newNot = new Notification('New slot: ' + newEntry.name.split('-')[0], {
                    body: `
                           Address: ${newEntry.address}
                           Available dose1: ${newEntry.available_capacity_dose1}
                           Available dose2: ${newEntry.available_capacity_dose2}  
                        `
                });
            }
        })
        if (count === 3) {
            postMessage('finished');
        }
    }
    
    setInterval(notification, 1000);   

}