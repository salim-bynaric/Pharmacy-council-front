import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import {de} from '../../utils/Helper';

const PurchasePopUp = ({ url, show, handleClose }) => {
    const [newUrl, setNewUrl] = useState();
    const [status, setStatus] = useState();
    const [message,setMessage] = useState();
    const [txnId, setTxnId] = useState();

    let arr = [];

    useEffect(() => {
        if (url !== undefined && url !== null && url !== '') {
            setNewUrl(url.split("?")[1]);
        }
    }, [url]);

    useEffect(() => {
        if (newUrl !== undefined && newUrl !== null && newUrl !== '') {
            arr = newUrl.split('&');
            if (arr.length === 3) {
                let mystatus = arr[0];
                let mytxnid = arr[1];
                let msg = arr[2];

                setStatus(mystatus.split('=')[1]);
                setTxnId(mytxnid.split('=')[1]);
                setMessage(de(msg.split('=')[1]));
            }
        }
    }, [newUrl]);


    useEffect(() => {
        if(status === 'successful') {
            localStorage.setItem('myExamCart',undefined);
        }
    },[status]);

    return (
        <>
            <Modal show={show} onHide={() => { handleClose(); }} backdrop="static" keyboard={false}>
                <Modal.Body>
                    <div className="popup-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => {
                            handleClose();
                        }}>x</button>
                    </div>

                    <div className="pop-img"> <img src="assets\images\Landing\logos.png"></img>
                    </div><br/>

                    <div className="col-lg-12">
                    <div className="alert alert-success"><h6>{message}</h6></div>
                    </div><br/><br/>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PurchasePopUp;