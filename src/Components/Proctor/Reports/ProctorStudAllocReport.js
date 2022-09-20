import React, { useState, useEffect, useContext } from 'react';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const ProctorStudAllocReport = () => {
    const [dateSlot, setDateSlot] = useState([]);
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [proctorData, setProctorData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [myDateSlot,setMyDateSlot] = useState();


    let header = '';
    let data = '';

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

    if (proctorData.length > 0) {
        header = getHeader();
        data = getData(proctorData);
    }

    useEffect(() => {
        if (currentUser !== undefined && currentUser !== null) {
            getProctorDateSlot(setDateSlot, currentUser.uid, setShow, setMsg);
        }
    }, [currentUser]);

    return (
        dateSlot !== undefined ?
            <div>
                <div className="container-fluid">
                    <br/>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Proctor Student Allocation Report</li>
                    </ol>
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <i className="fas fa-users mr-1" />
                                <b>Report Filter</b>
                            </div>
                            <div><br />
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Select Date Slot
                                        </div>
                                        <div className="col-lg-8">
                                            <select id="paperId" name="paperId" className="form-control" onChange={async (e) => {
                                                setLoading(true);
                                                setMyDateSlot(e.target.value);
                                                await getAllocatedStudents(currentUser, e.target.value, setShow, setMsg, setProctorData);
                                                setLoading(false);
                                            }}>
                                                <option value="">Select Date Slot</option>
                                                {
                                                    dateSlot.map((dateSlot,index) =>
                                                    {
                                                        return  <option key={index} value={dateSlot.date+':$:'+dateSlot.slot}>
                                                            {'Date:'+dateSlot.date+'-Slot:'+dateSlot.slot}
                                                            </option>
                                                    })
                                                }
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div><br/>
                        {
                            !loading ?
                                proctorData.length > 0 ?
                                    <>
                                        <center><button className="btn btn-success" onClick={() =>{
                                            printPdf(proctorData,currentUser,myDateSlot);
                                        }}>Export to Pdf</button> &nbsp;&nbsp; 
                                        <button className="btn btn-warning" onClick={() =>{
                                            printAttendancePdf(proctorData,currentUser,myDateSlot);
                                        }}>Export Attendance</button></center><br/>
                                        <BootstrapTable keyField='srno' data={data} columns={header} filter={filterFactory()} pagination={paginationFactory(options)} />
                                    </>
                                : null
                            :<div className="custom-loader"></div>
                        }
                    </div>
                </div>
            </div>
        : null
    );
};

function printAttendancePdf(proctorData,currentUser,dateSlot)
{
    let myData = [];
    let i = 1;
    let subject='';
    let attendance = '';
    let date = dateSlot.split(':$:')[0];
    let slot = dateSlot.split(':$:')[1];

    proctorData.map((data, index) => 
    {
        subject = 'Date: '+date+'  Slot:'+slot;
        if(data.exam.examstatus === 'inprogress' || data.exam.examstatus === 'over')
        {
            attendance = 'Present';
        }
        else
        {
            attendance = 'Absent';
        }

        myData.push(
                [i++,data.student.username,data.student.name,attendance]
        )
    });

    const doc = new jsPDF();
    let pageHeight= doc.internal.pageSize.height;
    doc.text("Proctor Student Attendance Report", 60, 7);
    doc.setFontSize(8);
    doc.text(subject, 15, 12);
    doc.setFontSize(9);
    doc.text('Institute: '+proctorData[0].student.college_name, 15, 17);

    doc.autoTable({
        head: [['Sr.No.', 'Enrollment No', 'Student Name','Attendance']],
        body: myData,
        startY : 20,
    });

    let finalY = doc.lastAutoTable.finalY+80;
    if (finalY >= pageHeight)
    {
        doc.addPage();
        finalY = 30;
    }
    doc.setFontSize(12);
    doc.text(10, finalY, 'Date: '+new Date().toLocaleString());
    doc.text(140, finalY, 'Officer Incharge,Examination');
      
    doc.save('Student Attendance Report.pdf');
}

function printPdf(proctorData,currentUser,dateSlot)
{
    let myData = [];
    let i = 1;
    let subject='';
    let date = dateSlot.split(':$:')[0];
    let slot = dateSlot.split(':$:')[1];

    proctorData.map((data, index) => 
    {
        subject = 'Date: '+date+'  Slot:'+slot;
        myData.push(
                [i++,data.student.username,data.student.name,data.student.mobile]
        )
    });

    const doc = new jsPDF();
    let pageHeight= doc.internal.pageSize.height;
    doc.text("Proctor Student Allocation Report", 60, 7);
    doc.setFontSize(8);
    doc.text(subject, 15, 12);
    doc.setFontSize(9);
    doc.text('Institute: '+proctorData[0].student.college_name, 15, 17);

    doc.autoTable({
        head: [['Sr.No.', 'Enrollment No', 'Student Name','Mobile']],
        body: myData,
        startY : 20,
    });

    let finalY = doc.lastAutoTable.finalY+80;
    if (finalY >= pageHeight)
    {
        doc.addPage();
        finalY = 30;
    }
    doc.setFontSize(12);
    doc.text(10, finalY, 'Date: '+new Date().toLocaleString());
    doc.text(140, finalY, 'Officer Incharge,Examination');
      
    doc.save('Student Proctor Allocation Report.pdf');
}

function getHeader() {
    let myHeader = [
        { text: 'Sr No', dataField: 'srno' },
        { text: 'Enrollment Number', dataField: 'enrollno', filter: textFilter() },
        { text: 'Student Name', dataField: 'name', filter: textFilter() },
        { text: 'Mobile', dataField: 'mobile', filter: textFilter() },
    ];
    return myHeader;
}

function getData(proctorData) {
    let myData = [];
    let i = 1;
    proctorData.map((data, index) => {
        myData.push({
            srno: i++,
            enrollno: data.student.username,
            name: data.student.name,
            mobile: data.student.mobile,
        })
    })
    return myData;
}

async function getAllocatedStudents(currentUser, dateSlot, setShow, setMsg, setProctorData) {
    let uid = currentUser.uid;
    await API.get('/proctorAllocation', { params: { "type": "byDateSlot", "dateSlot": dateSlot, "proctorUid": uid, "instId": currentUser.inst_id } })
        .then((res) => {
            if (res.data.status === 'success') {
                setProctorData(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function getProctorDateSlot(setDateSlot, proctorUid, setShow, setMsg) {
    await API.get('/proctor/dateSlots', { params: { "type": "byProctorUid", "proctorUid": proctorUid } })
        .then((res) => {
            if (res.data.status === 'success') {
                setDateSlot(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

export default ProctorStudAllocReport;