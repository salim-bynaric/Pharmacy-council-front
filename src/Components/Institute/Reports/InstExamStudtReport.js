import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import API from '../../../api';
import Moment from 'react-moment';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import StudentExamLog from './StudentExamLog';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import jsPDF from 'jspdf'
import 'jspdf-autotable'

function InstExamStudtReport(props) {
    const location = useLocation();
    let instId = location.state.instId;
    let [loading, setLoading] =    useState(true);
    let [allExams, paper_id, type,instName] = useData(instId,setLoading);
    const [log, setLog] = useState();
    const [popupShow, setPopupShow] = useState(false);
    const handleClose = () => setPopupShow(false);
    const { setShow, setMsg } = useContext(ShowContext);
    let result = searchResult(allExams, paper_id, type);
    const header = getHeader();
    const { currentUser } = useContext(UserContext);

    
    const data = getData(result, setLog, setShow, setMsg, setPopupShow);
    let history = useHistory();

    

    const options = {
        sizePerPageList: [
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
                text: 'All', value: data.length
            }
        ]
    };
    return (
        location.state && allExams && currentUser && !loading ?
            <div>
                <div className="container-fluid">
                    <h1 className="mt-4">Student Count Report</h1>
                    <div className="breadcrumb col-lg-12" style={{ color: "maroon" }}>
                        <div className="col-lg-4">
                            <b>Exam Status:</b> {type.toUpperCase()}
                        </div>
                        <div className="col-lg-2">
                            <b>Paper Code:</b> {location.state.paper_code}
                        </div>
                        {currentUser.role === 'ADMIN' && currentUser.username === 'admin' ?
                        <div className="col-lg-2">
                            <button className="btn btn-success btn-sm" style={{ float: "right"}} onClick={() => { printResult(allExams,paper_id,type,instName) }}>Export Result</button>
                        </div>
                        : null}
                        <div className="col-lg-2">
                            <button className="btn btn-warning btn-sm" style={{ float: "right"}} onClick={() => { printPdf(allExams,paper_id,type,instName) }}>Export Attendance</button>
                        </div>
                        <div className="col-lg-2">
                            <button className="btn btn-primary btn-sm" style={{ float: "right" }} onClick={() => { history.goBack() }}>Go Back</button>
                        </div>
                    </div>
                    <div className="row col-lg-12 animate__animated animate__fadeInDown animate_slower" style={{ overflow: "auto" }}>
                        <BootstrapTable keyField='srno' data={data} columns={header} filter={filterFactory()} pagination={paginationFactory(options)} />
                    </div>

                </div>
                <Modal show={popupShow} onHide={handleClose} backdrop="static" size="xl" dialogClassName="modal-90w">
                    <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white" }}>
                        <Modal.Title>Student Exam Log Report</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="col-lg-12">
                            {
                                log ?
                                    <StudentExamLog log={log} />
                                : <div className="custom-loader"></div>
                            }
                        </div>
                        <hr />
                        <div className="col-lg-12">
                            <Button variant="danger" onClick={handleClose} style={{ float: "right" }}>Close</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            : 
                loading ?
                <div className="custom-loader"></div>
                :null
    );
}

async function printResult(allExams,paper_id,type,instName)
{
    let myData = [];
    let i = 1;
    let subject = '';
    allExams.map((data, index) => 
    {
        let attendance = 'Absent';
        let startedon = '';
        let endon = '';
        subject = 'Subject: ('+data.paper.paper_code+'-'+data.paper.paper_name+')';
        myData.push(
                [i++,data.stdid.username,data.stdid.name.toUpperCase(),data.paper.program.program_name,data.paper.paper_code+'-'+data.paper.paper_name,data.marksobt]
        )
    });

    const doc = new jsPDF();
    let pageHeight= doc.internal.pageSize.height;
    doc.text("Result Report", 80, 7);
    doc.setFontSize(8);
    doc.text(subject, 15, 12);
    doc.setFontSize(9);
    doc.text('Institute: '+instName, 15, 17);
    doc.autoTable({
        head: [['Sr.No.', 'Enrollment No', 'Student Name','Program','Subject','Obtained Marks']],
        body: myData,
        startY : 20,
    });

    let finalY = doc.lastAutoTable.finalY+50;
    if (finalY >= pageHeight)
    {
        doc.addPage();
        finalY = 30;
    }
    doc.setFontSize(12);
    doc.text(10, finalY, 'Date: '+new Date().toLocaleString());
    doc.text(150, finalY, 'Signature of Authority');
      
    doc.save('Result Report.pdf');
}

async function printPdf(allExams,paper_id,type,instName)
{
    let myData = [];
    let i = 1;
    let subject = '';
    allExams.map((data, index) => 
    {
        let attendance = 'Absent';
        let startedon = '';
        let endon = '';
        subject = 'Subject: ('+data.paper.paper_code+'-'+data.paper.paper_name+')';

        (data.examstatus ==='inprogress' || data.examstatus === 'over') ? attendance = 'Present' : attendance = 'Absent';

        startedon = (data.startedon !== '' && data.startedon !== undefined && data.startedon !== null) ? new Date(data.startedon).toLocaleDateString()+' '+new Date(data.startedon).toLocaleTimeString() : '';
        
        endon = (data.endon !== '' && data.endon !== undefined && data.endon !== null) ? new Date(data.endon).toLocaleDateString()+' '+new Date(data.endon).toLocaleTimeString() : ''

        myData.push(
                [i++,data.stdid.username,data.stdid.name,attendance,startedon,endon]
        )
    });

    const doc = new jsPDF();
    let pageHeight= doc.internal.pageSize.height;
    doc.text("Exam Attendance Report", 80, 7);
    doc.setFontSize(8);
    doc.text(subject, 15, 12);
    doc.setFontSize(9);
    doc.text('Institute: '+instName, 15, 17);
    doc.autoTable({
        head: [['Sr.No.', 'Enrollment No', 'Student Name','Attendance','Exam Start Time','Exam End Time']],
        body: myData,
        startY : 20,
    });

    let finalY = doc.lastAutoTable.finalY+50;
    if (finalY >= pageHeight)
    {
        doc.addPage();
        finalY = 30;
    }
    doc.setFontSize(12);
    doc.text(10, finalY, 'Date: '+new Date().toLocaleString());
    doc.text(150, finalY, 'Signature of Authority');
      
    doc.save('Exam Attendance Report.pdf');
}

function getHeader() {
    let myHeader = [
        { text: 'Sr No', dataField: 'srno' },
        { text: 'Enrollment Number', dataField: 'enrollno', filter: textFilter() },
        { text: 'Student Name', dataField: 'name', filter: textFilter() },
        { text: 'Exam Status', dataField: 'examstatus', filter: textFilter() },
        { text: 'Mobile', dataField: 'mobile', filter: textFilter() },
        { text: 'Exam Start Time', dataField: 'startedon'},
        { text: 'Exam End Time', dataField: 'endon'},
        { text: 'View Log', dataField: 'log' },
    ];
    return myHeader;
}


function getData(result, setLog, setShow, setMsg, setPopupShow) {
    let myData = [];
    let i = 1;
    if (result) {
        result.filter(function (data) {
            if (data.stdid) {
                return true;
            }
            else {
                return false;
            }
        }).map((data, index) => {
            myData.push({
                srno: i++,
                enrollno: data.stdid.username,
                name: data.stdid.name,
                examstatus: data.examstatus,
                mobile: data.stdid.mobile,
                startedon: (data.startedon !== '' && data.startedon !== undefined && data.startedon !== null) ? <Moment format="MMMM Do YYYY, H:mm:ss A">{data.startedon}</Moment> : '',
                endon: (data.endon !== '' && data.endon !== undefined && data.endon !== null) ? <Moment format="MMMM Do YYYY, H:mm:ss A">{data.endon}</Moment> : '',
                log: <button className="btn btn-sm btn-warning" onClick={async () => {
                    await getStudentExamLog(data.stdid.username, data.paper.id, data.stdid.inst_id, setLog, setShow, setMsg, setPopupShow);
                }}>Log</button>
            })
        })
    }
    return myData;
}


function searchResult(allExams, paper_id, type) {
    if (allExams && allExams.length > 0) {
        let newArr = [];
        if (type === 'over') {
            for (let i = 0; i < allExams.length; i++) {
                if (allExams[i].paper && parseInt(paper_id) === parseInt(allExams[i].paper.id) && allExams[i].examstatus === 'over') {
                    newArr.push(allExams[i])
                }
            }
            return newArr;
        }
        else if (type === 'inprogress') {
            for (let i = 0; i < allExams.length; i++) {
                if (allExams[i].paper && parseInt(paper_id) === parseInt(allExams[i].paper.id) && allExams[i].examstatus === 'inprogress') {
                    newArr.push(allExams[i])
                }
            }
            return newArr;
        }
        else if (type === 'notattend') {
            for (let i = 0; i < allExams.length; i++) {
                if (allExams[i].paper && parseInt(paper_id) === parseInt(allExams[i].paper.id) && allExams[i].examstatus === null) {
                    newArr.push(allExams[i])
                }
            }
            return newArr;
        }
        else if (type === 'all') {
            for (let i = 0; i < allExams.length; i++) {
                newArr.push(allExams[i])
            }
            return newArr;
        }
    }
}

async function getStudentExamLog(enrollno, paperId, instId, setLog, setShow, setMsg, setPopupShow) 
{
    await API.get('/exam/log/' + enrollno + '/' + paperId, { params: { "instId": instId } })
        .then((res) => {
            if (res.data.status === 'success') {
                if(res.data.data !==null && res.data.data !==undefined && res.data.data.length === 0)
                {
                    setShow(true);
                    setMsg('No Log for this student found. Probably Exam Allocation is Dynamic and exam yet not conducted.');
                    return false;
                }
                setLog(res.data.data);
                setPopupShow(true);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

function useData(instId,setLoading) {
    let [allExams, setAllExams] = useState();
    let [paper_id, setPaperId] = useState('');
    let [type, setType] = useState('');
    let [instName,setInstName] = useState();
    
    let history = useHistory();
    const location = useLocation();

    useEffect(async() => {

        if (location.state) {
            setLoading(true);
            await getExamData(location.state.paper_id, location.state.type, setAllExams, setPaperId, setType,instId,setInstName);
            setLoading(false);
        }
        else {
            history.replace('/insthome');
        }
    }, [location.state, history]);

    return [
        allExams, paper_id, type, instName
    ];
}

async function getExamData(paper_id, type, setAllExams, setPaperId, setType,instId,setInstName) {
    await API.get('exam/bypaperid/type', { params: { "paper_id": paper_id, "type": type, "instId":instId } })
        .then(function (res) {
            if (res.data.status === 'success') {
                setPaperId(paper_id);
                setType(type);
                setAllExams(res.data.data);
                setInstName(res.data.instName);
            }

        })
        .catch(function (error) {

        });
}

export default InstExamStudtReport;