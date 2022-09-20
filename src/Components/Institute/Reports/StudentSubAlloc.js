import React,{useState, useContext,createRef} from 'react';
import API from '../../../api';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import {UserContext} from '../../../App';
import {ShowContext} from '../../../App';


const StudentSubAlloc = (props) => 
{
    let data                                    =   props.data;
    let paperId                                 =   props.paperId;
    let [loading,setLoading]                    =   useState(false);
    const {currentUser, setCurrentUser}         =   useContext(UserContext);
    const {setShow,setMsg}                      =   useContext(ShowContext);
    let [selected,setSelected]                  =   useState([]);
    let [paperDetails,setPaperDetails]          =   useState();
    let header                                  =   getHeader();
    const handleClose                           =   ()    => setShow1(false);
    const handleShow                            =   ()    => setShow1(true);
    let myData                                  =   getData(data,handleShow,setPaperDetails);
    const tableRef                              =    createRef();

    const [show, setShow1]                      =   useState(false);
    const [sendsms, setSendsms]                 =   useState(false);

    function handleOnSelectAll(isSelect,rows)
    {
        const ids = rows.map(r => r.enrollno);
        if (isSelect) 
        {
            setSelected(ids);
        } 
        else 
        {
            setSelected([]);
        } 
    }

    function handleOnSelect(row, isSelect)
    {
        if (isSelect) 
        {
            setSelected([...selected,row.enrollno]);
        } 
        else 
        {
            setSelected(selected.filter(x => x !== row.enrollno));
        }
    }

    const options = 
    {
        sizePerPageList: [
            {
                text: '5', value: 5
            }, 
            {
                text: '10', value: 10
            }, 
            {
                text: '50', value: 50
            },
            {
                text: '500', value: 500
            }, 
            {
                text: '1000', value: 1000
            }, 
            {
                text: '10000', value: 10000
            }
        ]
    };

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        style: { backgroundColor: '#c8e6c9' },
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll,
      };


    return (
        data.length > 0 ?
        <>
            <div>
                {myData && myData.length > 0 ?
                    <BootstrapTable keyField='enrollno' data={ myData } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) } selectRow={ selectRow } ref={tableRef} />
                :null}
            </div>

            <div style={{"margin":"10px"}}>
                <center>
                    <button type="button" className="btn btn-primary" onClick={() =>{
                        clearSession(selected,currentUser,setShow,setMsg);
                        }}>Clear Session
                    </button> &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-primary" onClick={() =>{
                        resetExam(selected,paperId,currentUser,setShow,setMsg,tableRef);
                        }}>Reset Examination
                    </button> &nbsp;&nbsp;&nbsp;
                    <button type="button" className="btn btn-primary" onClick={() =>{
                            setSendsms(true);
                        }}>Send Exam Link on Mobile
                    </button>
                </center>
                {
                    loading ?
                    <div className="custom-loader"></div>
                    :null
                }
            </div>
            <Modal show={sendsms} onHide={handleClose} size="lg" backdrop="static">
                <Modal.Header style={{backgroundColor:"OliveDrab",color:"white"}}>
                    <Modal.Title><center>Send Login Link to Student Confirmation</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>Do you really want to send Login Link to Students using SMS?</b>
                </Modal.Body>
                <Modal.Footer>
                        <Button variant="success" onClick={async () => {
                        await sendSMSLink(selected,paperId,currentUser,setShow,setMsg,tableRef,setLoading);
                        setSendsms(false);
                      }}>Yes</Button>
                        <Button variant="danger" onClick={() => {
                        setSendsms(false);
                      }}>No</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
                <Modal.Header style={{backgroundColor:"OliveDrab",color:"white"}}>
                    <Modal.Title><center>Allocated Examination Details</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {paperDetails !== undefined ?
                        paperDetails.map((subject, index) => (
                            <div className="card" style={{"margin":"5px"}} key={index}>
                                <div className="card-header"><h6><b>({subject.paper_code}) {subject.paper_name}</b></h6></div>
                                <div className="card-body">
                                    <h6 className="card-title">Exam Details</h6>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Exam Start Date:
                                        </div>
                                        <div className="col-lg-8">
                                            <Moment format="MMMM Do YYYY, H:mm:ss A">{subject.from_date}</Moment>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Exam End Date:
                                        </div>
                                        <div className="col-lg-8">
                                            <Moment format="MMMM Do YYYY, H:mm:ss A">{subject.to_date}</Moment>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Total Exam Marks:
                                        </div>
                                        <div className="col-lg-8">
                                            {subject.marks}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Total Exam Questions:
                                        </div>
                                        <div className="col-lg-8">
                                            {subject.questions}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Total Exam Duration:
                                        </div>
                                        <div className="col-lg-8">
                                            {subject.durations} Mins
                                        </div>
                                    </div>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Review Question Enabled:
                                        </div>
                                        <div className="col-lg-8">
                                            {subject.review_question ? 'Yes' : 'No'}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Proctoring Enabled:
                                        </div>
                                        <div className="col-lg-8">
                                            {subject.proctoring ? 'Yes' : 'No'}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            PH Candidate Extra Time:
                                        </div>
                                        <div className="col-lg-8">
                                            {subject.ph_time} Mins
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    :null}
                </Modal.Body>
                <Modal.Footer>
                        <Button variant="danger" onClick={() => {
                        setShow1(false);setPaperDetails(undefined);
                      }}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
        :
        <div className="alert alert-warning">
            No Student Data found for this Subject...
        </div>
    );
};

async function sendSMSLink(selected,paperId,currentUser,setShow,setMsg,tableRef,setLoading)
{
    setLoading(true);
    await API.post('loginLink/'+selected,{"type":"gen&send","paperId":paperId,"instId":currentUser.username,"instUid":currentUser.uid})
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setShow(true);
            setMsg('Link Sent to Students for Examination Login...');
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Sending SMS Link to Students...');
    });
    setLoading(false);
}

async function resetExam(selected,paperId,currentUser,setShow,setMsg,tableRef)
{
    await API.put('exam/',{"status":"reset","stdid":selected,"paperId":paperId,"instId":currentUser.username,"instUid":currentUser.uid})
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setShow(true);
            setMsg('Exam Reset Successful...');
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Resetting Examination...');
    });
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Enroll No', dataField: 'enrollno',filter: textFilter()},
        { text: 'Student Name', dataField: 'studName',filter: textFilter()},
        { text: 'Program', dataField: 'program'},
        { text: 'Subjects', dataField: 'subjectname'},
        { text: 'Password', dataField: 'password'},
        { text: 'View Details', dataField: 'details'},
    ];
    return myHeader;
}

function getData(data,handleShow,setPaperDetails)
{
        let i                   = 1;
        let myData              = [];
        if(data !== undefined)
        {
            data.map((data1, index) => 
            {
                myData.push({
                    srno                    : i++,
                    enrollno                : data1.stdid.username,
                    studName                : data1.stdid.name,
                    program                 : data1.program.program_code,
                    subjectname             : data1.paper,
                    password                : data1.stdid.password,
                    details                 : <Link onClick={()=> {handleShow(); setPaperDetails(data1.paperDetails)}}>View Details</Link>,
                })   
            });
        }

        return myData;
}

async function clearSession(selected,currentUser,setShow,setMsg)
{
    if(selected.length > 0)
    {
        await API.put('sessions/',{"type":"clearsessionMultiple","users":selected,"instUid":currentUser.username})
        .then(function (res) 
        {
            if(res.data.status === 'success')
            {
                setShow(true);
                setMsg(res.data.message);
            }
            else
            {
                setShow(true);
                setMsg(res.data.message);
            }
        })
        .catch(function (error) 
        {
            setShow(true);
            setMsg('Problem Clearing Session of this User...');
        });
    }
    else
    {
        setShow(true);
        setMsg('Please Select Student for Clearing Session...');
    }
}


export default StudentSubAlloc;