import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { de } from '../utils/Helper';
import { ShowContext } from '../App';
import Modal from "react-bootstrap/Modal";
import ExamCardPurchase from '../Components/ExamPurchase/ExamCardPurchase';
import ExamCardPurchaseOuter from '../Components/ExamPurchase/ExamCardPurchaseOuter';

const SearchExam = () => {
    const [searchInput, setSearchInput] = useState('');
    const [records, setRecords] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const [showPopup, setShowPopup] = useState(false);
    const [exam, setExam] = useState();
    const [type,setType] = useState();
    const handleClose = () => setShowPopup(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            searchCategorySubCategoryExam(searchInput, setRecords, setShow, setMsg);
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [searchInput]);

    return (
        <>
            <div className="col-md-12" >
                <div className="input-group rounded-pill p-1">
                    <div className="input-group-prepend border-0">
                        <button id="button-addon4" type="button" className="btn btn-link text-info"><i className="fa fa-search"></i></button>
                    </div>
                    <input type="search" placeholder="Search Exams here..." aria-describedby="button-addon4" className="form-control bg-none border-0" onChange={(e) => {setSearchInput(e.target.value);}} value={searchInput} />
                    {
                        records !== undefined ?
                            <div className='search-result scroll1'>
                                {
                                    records !== undefined && records.length > 0 ?
                                        <ul>
                                            {
                                                records.map((record, index) => {
                                                    return <li key={index} onClick={() => {
                                                        getExamDetails(record, setShowPopup, setExam, setType, setShow, setMsg);
                                                    }}>
                                                        {record.type === 1 || record.type === 2 ? <i className="fa fa-search"></i> : <i className="fa fa-list-alt"></i>} {record.name}
                                                    </li>
                                                })
                                            }
                                        </ul>
                                        : null
                                }

                                {
                                    records !== undefined && records.length === 0 ?
                                        <ul>
                                            {
                                                <li><i className="fa fa-exclamation-circle"></i> No Exam Found</li>
                                            }
                                        </ul>
                                        : null
                                }
                            </div>
                            : null
                    }
                </div>
            </div>

            <Modal show={showPopup} onHide={() => { handleClose() }} backdrop="static" centered size="xl" contentClassName="my-modal-height slider-popup">
                <Modal.Body>
                    <div className="popup-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => {
                            handleClose();
                        }}>x</button>

                        <div className="pop-img"> <img src="assets\images\Landing\logos.png"></img></div>
                        <div className='col-lg-12 row'>
                        {
                            exam !== undefined ?
                                (type === 1 || type === 2) ?
                                    <ExamCardPurchase exams={exam} purchased={[]} subCategory={[]} handleClose1={handleClose} useSubcategory={false} cartUrl={'/outercart'}/>
                                :
                                <ExamCardPurchaseOuter exams={[exam]} purchased={[]} subCategory={[]} handleClose1={handleClose} useSubcategory={false}/>
                            :
                            null
                        }
                        </div>
                    </div><br />
                </Modal.Body>
            </Modal>
        </>
    );
};

async function getExamDetails(record, setShowPopup, setExam, setType, setShow, setMsg) {
    await API.get('/search/byType/id/' + record.type + '/' + record.id)
        .then(function (res) {
            if (res.data.status === 'success') {
                setExam(JSON.parse(de(res.data.data)));
                setShowPopup(true);
                setType(record.type);
            }
        })
        .catch(function (error) {
            setExam(undefined);
            setType(undefined);
            setShowPopup(false);
            setShow(true);
            setMsg(error.response.data.message);
        })
}

async function searchCategorySubCategoryExam(input, setRecords, setShow, setMsg) {
    if (input === '' || input === undefined || input === null) {
        setRecords(undefined);
        return false;
    }

    await API.get('/search/category/subcategory/exam', { params: { "inputString": input } })
        .then(function (res) {
            if (res.data.status === 'success') {
                setRecords(JSON.parse(de(res.data.data)));
                console.log(JSON.parse(de(res.data.data)));
            }
            else {
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
        })
}

export default SearchExam;