import React, {useState, useEffect} from 'react';
import { sha256 } from 'js-sha256';
import { withRouter } from 'react-router-dom';
import './Auth.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const generateOTP_URI = '/api/v2/auth/public/generateOTP';
const confirmOTP_URI = '/api/v2/auth/public/confirmOTP';
const baseURI = 'https://cdn-api.co-vin.in';



function Auth(props) {

    const [mobileNumber, setMobileNumber] = useState('')
    const [waitingForOTP, setWaitingForOTP] = useState(false);
    const [otp, setOTP] = useState('');
    const [txnId, setTxnId] = useState('');

    useEffect(() => {
        const main = () => {
            if ('OTPCredential' in window) {
                window.addEventListener('DOMContentLoaded', e => {
                    const ac = new AbortController();
                    navigator.credentials.get({
                        otp: { transport: ['sms'] },
                        signal: ac.signal
                    }).then(otp => {
                        console.log(otp);
                        setOTP(otp);
                    }).catch(err => {
                        console.log(err);
                    });
                })
            } else {
                console.log('WebOTP not supported!.');
            }
        }

        const findByDistrict = async () => {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); 
            let yyyy = today.getFullYear();
            let date = (mm + '-' + dd + '-' + yyyy);
            if (window.localStorage.getItem('district') && window.localStorage.getItem('token')) {
                let district = window.localStorage.getItem('district');
                const uri = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${date}`;
                const res = await fetch(uri, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                    },
                });
                if (res.status === 200) {
                    props.history.push('/dashboard');
                }   
            } else {
                console.log('Logged Out!')
                return;
            }
                    
        }

        const loggedInCheck = () => {
            findByDistrict();
        }

        loggedInCheck();
        main();
    }, []);

    const getOTPHandler = async () => {
        const uri = baseURI + generateOTP_URI;
        console.log('mobilenum: ' + mobileNumber);
        let data = {
            mobile: mobileNumber
        };
        const res = await fetch(uri, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        const response = await res.json();
        setWaitingForOTP(true);
        console.log(response);
        setTxnId(response.txnId); 
    }

    const confirmOTPHandler = async () => {
        const uri = baseURI + confirmOTP_URI;
        console.log(otp)
        console.log(sha256(otp))
        console.log(txnId);
        let data = {
            otp: sha256(otp),
            txnId: txnId
        }
        const res = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const response = await res.json();
        console.log(response);
        setWaitingForOTP(false);
        window.localStorage.setItem('token', response.token);
        props.history.push('/dashboard');
    }

    return (
        <div className="auth">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                />
            {
                waitingForOTP ? (
                    <div className="auth-confirmotp">
                        <input placeholder="Enter OTP" value={otp} onChange={(e) => {
                            setOTP(e.target.value)
                        }} type="text" autoComplete="one-time-code" required />
                        <button onClick={(e) => {
                            e.preventDefault();
                            confirmOTPHandler();
                        }}>Login</button>
                    </div>
                ) : (
                    <div className="auth-getotp">
                        <input autoComplete="on" placeholder="Enter mobile number (1234567890)" value={mobileNumber} onChange={(e) => {
                            setMobileNumber(e.target.value);
                        }} type="text" required />
                        <button onClick={(e) => {
                                e.preventDefault();
                                toast.success('Please check your inbox for OTP !', {
                                    position: "top-center",
                                    autoClose: 4000,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: false,
                                    draggable: true,
                                    progress: undefined,
                                    });
                            getOTPHandler();
                        }}>Get OTP</button>
                    </div>
                )
            }
        </div>
    )
}

export default withRouter(Auth);
