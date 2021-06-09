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

let districtDataPrev = [];
let districtDataNew = [];

const findByDistrict = async () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
    let yyyy = today.getFullYear();
    let currentDate = dd + '-' + mm + '-' + yyyy;
    
    districts.forEach(eachDistrict => {
        const uri = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${eachDistrict.district_id}&date=${currentDate}`;
        if (navigator.onLine && window.localStorage.getItem('token')) {
            const res = await fetch(uri, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
            });
            const response = await res.json();
            districtDataNew.push({
                district: eachDistrict.district_name,
                data: response
            }); 
        }
        if (districtDataPrev.length === 0) {
            
        }
    }
        
        
    )
    
}

const notification = () => {
    

}