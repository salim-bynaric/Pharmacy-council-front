import React, { useState, useEffect, useContext } from 'react';
import API from '../../../api';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ShowContext, UserContext } from '../../../App';
import { Formik } from 'formik';
import DateTimePicker from 'react-datetime-picker';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function StudentProctoringCountReport() {
    const [examDate, onExamDateChange] = useState(new Date());
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [allData, setAllData] = useState();
    const [myFinalData, setMyFinalData] = useState();
    const myInitialValues = { examDate: examDate, slot: '' ,type:'1'};
    const [loading, setLoading] = useState(false);


    let header = getHeader();

    useEffect(() => {
        if (allData !== undefined) {
            setMyFinalData(getData(allData));
        }
    }, [allData]);


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
                text: '10000', value: 10000
            }
        ]
    };

    return (
        <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                setLoading(true);
                await getProctoringReport(values, examDate, setShow, setMsg, currentUser, setAllData);
                setLoading(false);
            }}
        >
            {
                props => {
                    const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    } = props;

                    return (
                        currentUser ?
                            <div>
                                <div className="container-fluid" style={{ "marginTop": "10px" }}>
                                    <ol className="breadcrumb mb-4">
                                        <li className="breadcrumb-item">Student Proctoring Count Report</li>
                                    </ol>
                                    <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower" style={{ overflow: "auto" }}>
                                        <div className="card mb-4">
                                            <div className="card-header">
                                                <i className="fas fa-address-card mr-1" />
                                                Filter
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="card-body row">
                                                    <div className="form-group col-lg-4">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Date
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <DateTimePicker onChange={onExamDateChange} value={examDate} id="examDate" name="examDate" className="form-control" format="yyyy-MM-dd" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Slot
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <select id="slot" name="slot" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.slot}>
                                                                    <option value="all">Select Slot</option>
                                                                    <option value="1">Slot 1</option>
                                                                    <option value="2">Slot 2</option>
                                                                    <option value="3">Slot 3</option>
                                                                    <option value="4">Slot 4</option>
                                                                    <option value="5">Slot 5</option>
                                                                    <option value="6">Slot 6</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Report Type
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <select id="type" name="type" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.type}>
                                                                    <option value="1">Student Warning Report</option>
                                                                    <option value="2">Student Booked Report</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <center>
                                                        <button className="btn btn-sm btn-primary" type="submit" id="submit" disabled={isSubmitting}>Submit</button>
                                                    </center>
                                                </div>
                                            </form>
                                        </div>
                                        {!loading ?
                                            <div className="col-lg-12 scroll1" style={{ "overflow": "auto" }}>
                                            {

                                                allData !== undefined && myFinalData !== undefined ?
                                                    <>
                                                        <div style={{"marginBottom":"20px"}}>
                                                            <center>
                                                                <button className="btn btn-success" onClick={() =>{
                                                                printPdf(myFinalData,currentUser,examDate,values);
                                                                }}>
                                                                    Export to Pdf
                                                                </button>
                                                            </center>
                                                        </div>
                                                        <BootstrapTable keyField='id' data={myFinalData} columns={header} filter={filterFactory()} pagination={paginationFactory(options)} />
                                                    </>
                                                 : null
                                            }
                                            </div>
                                        :<div className="custom-loader"></div>}
                                    </div>
                                </div>
                            </div>
                            : null
                    );
                }
            }
        </Formik>
    );
}

function printPdf(proctorData,currentUser,examDate,values)
{
    let myData = [];
    let i = 1;
    let instName='';
    let subject ='';
    let date = examDate ? examDate.toISOString().slice(0, 10) : '';
    let slot = values.slot;

    if(proctorData.length > 0)
    {
        instName = proctorData[0].instName;
    }
    proctorData.map((data, index) => 
    {
        subject = data.paperId;
        let starttime = data.starttime ? data.starttime : '';
        let endtime = data.endtime ? data.endtime : '';
        if(currentUser.role === 'ADMIN' && currentUser.username !== 'admin')
        {
            myData.push(
                [i++,data.enrollno,data.studName,data.proctor,subject,starttime,endtime,data.malpracticeBooked,data.warning1a,data.warning1b,data.warning1c,data.warning1d,data.warning2a,data.warning2b,data.warning3a,data.warning4a]
            )
        }
        else
        {
            myData.push(
                    [i++,data.enrollno,data.studName,data.proctor,subject,starttime,endtime,data.malpracticeBooked,data.warning1a,data.noted1a,data.warning1b,data.noted1b,data.warning1c,data.noted1c,data.warning1d,data.noted1d,data.warning2a,data.noted2a,data.warning2b,data.noted2b,data.warning3a,data.noted3a,data.warning4a,data.noted4a,data.examStatus,data.phStatus]
            )
        }
    });

    let doc = null;
    if(currentUser.role === 'ADMIN' && currentUser.username !== 'admin')
    {
        doc = new jsPDF('landscape','mm','a4');
    }
    else
    {
        doc = new jsPDF('landscape','mm','a3');
    }
    
    let pageHeight= doc.internal.pageSize.height;
    if(values.type != '2')
    {
        if(currentUser.role === 'ADMIN' && currentUser.username !== 'admin')
        {
            doc.text("Proctor Student Warnings Count Report", 90, 13);
        }
        else
        {
            doc.text("Proctor Student Warnings Count Report", 160, 13);
        }
    }
    else
    {
        if(currentUser.role === 'ADMIN' && currentUser.username !== 'admin')
        {
            doc.text("Students Booked for Malpractice Report", 90, 13);
        }
        else
        {
            doc.text("Students Booked for Malpractice Report", 160, 13);
        }
    }

    doc.setFontSize(10);
    doc.text('Date: '+date, 15, 15);
    doc.text('Slot: '+slot, 15, 20);
    doc.text('Institute: '+instName, 15, 25);

    if(currentUser.role === 'ADMIN' && currentUser.username !== 'admin')
    {
        doc.autoTable({
            head: [['Sr.No', 'Enroll', 'Student','Proctor','Subject','Exam Start','Exam End','Mapractice Booked','W 1A','W 1B','W 1C','W 1D','W 2A','W 2B','W 3A','W 4A']],
            body: myData,
            startY : 30,
        });
    }
    else
    {
        doc.autoTable({
            head: [['Sr.No', 'Enroll', 'Student','Proctor','Subject','Exam Start','Exam End','Mapractice Booked','W 1A','N 1A','W 1B','N 1B','W 1C','N 1C','W 1D','N 1D','W 2A','N 2A','W 2B','N 2B','W 3A','N 3A','W 4A','N 4A','Exam Status','PH']],
            body: myData,
            startY : 27,
        });
    }

    let finalY = doc.lastAutoTable.finalY+80;
    if (finalY >= pageHeight)
    {
        doc.addPage();
        finalY = 30;
    }
    doc.setFontSize(12);
    doc.text(10, finalY, 'Date: '+new Date().toLocaleString());
    if(currentUser.role === 'ADMIN' && currentUser.username !== 'admin')
    {
        doc.text(210, finalY, ' Officer Incharge,Examination');
    }
    else
    {
        doc.text(310, finalY, ' Officer Incharge,Examination');
    }
      
    if(values.type != '2')
    {
        doc.save('Proctor Student Warnings Count Report.pdf');
    }
    else
    {
        doc.save('Students Booked for Malpractice Report.pdf');
    }
}

function getHeader() {
    let myHeader = [
        { text: 'Sr No', dataField: 'srno' },
        { text: 'Enroll No', dataField: 'enrollno', filter: textFilter() },
        { text: 'Student Name', dataField: 'studName' },
        { text: 'Paper Code', dataField: 'paperId', filter: textFilter()  },
        { text: 'Schedule Start', dataField: 'starttime' },
        { text: 'Schedule End', dataField: 'endtime' },
        { text: 'Malpractice Booked', dataField: 'malpracticeBooked' },
        { text: 'Warning 1A', dataField: 'warning1a' },
        { text: 'Noted 1A', dataField: 'noted1a' },
        { text: 'Warning 1B', dataField: 'warning1b' },
        { text: 'Noted 1B', dataField: 'noted1b' },
        { text: 'Warning 1C', dataField: 'warning1c' },
        { text: 'Noted 1C', dataField: 'noted1c' },
        { text: 'Warning 1D', dataField: 'warning1d' },
        { text: 'Noted 1D', dataField: 'noted1d' },
        { text: 'Warning 2A', dataField: 'warning2a' },
        { text: 'Noted 2A', dataField: 'noted2a' },
        { text: 'Warning 2B', dataField: 'warning2b' },
        { text: 'Noted 2B', dataField: 'noted2b' },
        { text: 'Warning 3A', dataField: 'warning3a' },
        { text: 'Noted 3A', dataField: 'noted3a' },
        { text: 'Warning 4A', dataField: 'warning4a' },
        { text: 'Noted 4A', dataField: 'noted4a' },
        { text: 'Exam Status', dataField: 'examStatus' },
        { text: 'PH Status', dataField: 'phStatus' },
    ];
    return myHeader;
}

function getData(data) {
    let i = 1;
    let myData = [];
    if (data !== undefined) {
        data.map((data1, index) => {
            myData.push({
                srno: i++,
                enrollno: data1.enrollNo,
                studName: data1.studName,
                paperId: data1.paperCode,
                starttime: data1.examStart,
                endtime: data1.examEnd,
                malpracticeBooked: data1.malpracticeString,
                warning1a: data1.count1a,
                noted1a: data1.count1aNoted,
                warning1b: data1.count1b,
                noted1b: data1.count1bNoted,
                warning1c: data1.count1c,
                noted1c: data1.count1cNoted,
                warning1d: data1.count1d,
                noted1d: data1.count1dNoted,
                warning2a: data1.count2a,
                noted2a: data1.count2aNoted,
                warning2b: data1.count2b,
                noted2b: data1.count2bNoted,
                warning3a: data1.count3a,
                noted3a: data1.count3aNoted,
                warning4a: data1.count4a,
                noted4a: data1.count4aNoted,
                examStatus: data1.examStatus,
                phStatus: data1.phStatus,
                paperName:data1.paperName,
                instName:data1.instName,
                proctor:data1.proctor,
            });
        });
    }
    return myData;
}


async function getProctoringReport(values, examDate, setShow, setMsg, currentUser, setAllData) 
{
    let examDate1 = (examDate !== '' && examDate) ? examDate.toISOString().slice(0, 10) : 'all';
    let slot = values.slot !== '' ? values.slot : 'all';
    let instId = null;

    if (currentUser.role === 'EADMIN') {
        instId = currentUser.inst_id;
    }
    else if(currentUser.role === 'ADMIN' && currentUser.username !== 'admin')
    {
        instId = currentUser.inst_id;
    }

    if (examDate1 === 'all') {
        slot = 'all';
    }
    await API.get('/proctorCount/countReport/' + examDate1 + '/' + slot, { params: { 'instId': instId } })
        .then(function (res) {
            if (res.data.status === 'success') {
                if (res.data.data.length > 0) 
                {
                    alert(values.type);
                    if(values.type == '1')
                    {
                        let enrolls = getDistinctEnrollments(res.data.data);
                        setAllData(getDataInFormat(res.data.data, enrolls));
                    }
                    else
                    {
                        let enrolls = getDistinctEnrollments(res.data.data);
                        setAllData(getBookedEnrollments(enrolls,res.data.data));
                    }
                }
                else {
                    setAllData(undefined);
                    setShow(true);
                    setMsg('Data not found...');
                }
            }
        })
        .catch(function (error) {
            setAllData(undefined);
            setShow(true);
            //setMsg(error.response.data.message);
        });
}

function getDataInFormat(data, enrolls) {
    let finalData = [];
    if (enrolls.length > 0) {
        for (let i = 0; i < enrolls.length; i++) {
            let dat = getMyData(data, enrolls[i]);
            finalData.push(dat);
        }
    }
    return finalData;
}

function getBookedEnrollments(enrolls,data)
{
    let finalData = [];
    if (enrolls.length > 0) 
    {
        for (let i = 0; i < enrolls.length; i++) 
        {
            let dat = getMyBookedData(data, enrolls[i]);
            if(dat !== undefined)
            {
                finalData.push(dat);
            }
        }
    }
    return finalData;
}

function getDistinctEnrollments(data) {
    var items = data;
    var result = [];

    for (var item, i = 0; item = items[i++];) 
    {
        var name = item.student.username;
        var subject = item.subject.paper_code;
        result.push(name+':$:'+subject);
    }
    result = [...new Set(result)];
    return result;
}

function getMyBookedData(data, enroll)
{
    let i = 1;
    let enrollNo = '';
    let studName = '';
    let paperCode = '';
    let paperName='';
    let proctor = '';
    let examStart = '';
    let examEnd = '';
    let examStatus = '';
    let phStatus = '';
    let slot = '';
    let instName='';

    let malpractice1 = 0;
    let malpractice2 = 0;
    let malpractice3 = 0;
    let malpractice4 = 0;

    let count1a = 0; let count1b = 0; let count1c = 0; let count1d = 0; let count2a = 0; let count2b = 0; let count3a = 0; let count4a = 0;

    let count1aNoted = 0; let count1bNoted = 0; let count1cNoted = 0; let count1dNoted = 0; let count2aNoted = 0; let count2bNoted = 0; let count3aNoted = 0; let count4aNoted = 0;

    if (data.length > 0) 
    {
        for (let i = 0; i < data.length; i++) 
        {
            if ((enroll.split(':$:')[0] === data[i].student.username) && (enroll.split(':$:')[1] === data[i].subject.paper_code)) 
            {
                enrollNo = enroll.split(':$:')[0];
                studName = data[i].student.name;
                paperCode = data[i].subject.paper_code;
                paperName = data[i].subject.paper_name;
                instName = data[i].inst.college_name;
                examStart = new Date(data[i].exam.startedon).toLocaleDateString()+' '+new Date(data[i].exam.startedon).toLocaleTimeString();
                examEnd = new Date(data[i].exam.endon).toLocaleDateString()+' '+new Date(data[i].exam.endon).toLocaleTimeString();
                examStatus = data[i].exam.examstatus;
                phStatus = data[i].student.ph;
                slot = data[i].subject.slot;
                proctor = data[i].proctor.username;

                if (data[i].warningNo === 1) {
                    count1a++;
                    if (data[i].noted === 1) {
                        count1aNoted++;
                    }
                }
                else if (data[i].warningNo === 2) {
                    count1b++;
                    if (data[i].noted === 1) {
                        count1bNoted++;
                    }
                }
                else if (data[i].warningNo === 3) {
                    count1c++;
                    if (data[i].noted === 1) {
                        count1cNoted++;
                    }
                }
                else if (data[i].warningNo === 4) {
                    count1d++;
                    if (data[i].noted === 1) {
                        count1dNoted++;
                    }
                }
                else if (data[i].warningNo === 5) {
                    count2a++;
                    if (data[i].noted === 1) {
                        count2aNoted++;
                    }
                }
                else if (data[i].warningNo === 6) {
                    count2b++;
                    if (data[i].noted === 1) {
                        count2bNoted++;
                    }
                }
                else if (data[i].warningNo === 7) {
                    count3a++;
                    if (data[i].noted === 1) {
                        count3aNoted++;
                    }
                }
                else if (data[i].warningNo === 8) {
                    count4a++;
                    if (data[i].noted === 1) {
                        count4aNoted++;
                    }
                }
            }
        }

        malpractice1 = count1a+count1b+count1c+count1d;
        malpractice2 = count2a+count2b;
        malpractice3 = count3a;
        malpractice4 = count4a;

        let malpracticeArr = [];
        if(malpractice1 > 3)
        {
            malpracticeArr.push(1);
        }
        if(malpractice2 > 2)
        {
            malpracticeArr.push(2);
        }
        if(malpractice3 > 2)
        {
            malpracticeArr.push(3);
        }
        if(malpractice4 > 1)
        {
            malpracticeArr.push(4);
        }

        let MalPracticeString = malpracticeArr.join();

        if(malpractice1 > 3 || malpractice2 > 2 || malpractice3 > 2 || malpractice4 > 1)
        {
            return { 'id':i++,'enrollNo': enrollNo, 'studName': studName, 'paperCode': paperCode, 'examStart': examStart, 'examEnd': examEnd, 'examStatus': examStatus, 'phStatus': phStatus, 'slot': slot, 'count1a': count1a, 'count1b': count1b, 'count1c': count1c, 'count1d': count1d, 'count2a': count2a, 'count2b': count2b, 'count3a': count3a, 'count4a': count4a, 'count1aNoted': count1aNoted, 'count1bNoted': count1bNoted, 'count1cNoted': count1cNoted, 'count1dNoted': count1dNoted, 'count2aNoted': count2aNoted, 'count2bNoted': count2bNoted, 'count3aNoted': count3aNoted, 'count4aNoted': count4aNoted,'paperName':paperName,'instName':instName,'proctor':proctor,'malpracticeString':MalPracticeString };
        }
    }
}

function getMyData(data, enroll) 
{
    let i =1;
    let enrollNo = '';
    let studName = '';
    let paperCode = '';
    let paperName='';
    let proctor = '';
    let examStart = '';
    let examEnd = '';
    let examStatus = '';
    let phStatus = '';
    let slot = '';
    let instName='';

    let malpractice1 = 0;
    let malpractice2 = 0;
    let malpractice3 = 0;
    let malpractice4 = 0;

    let count1a = 0; let count1b = 0; let count1c = 0; let count1d = 0; let count2a = 0; let count2b = 0; let count3a = 0; let count4a = 0;

    let count1aNoted = 0; let count1bNoted = 0; let count1cNoted = 0; let count1dNoted = 0; let count2aNoted = 0; let count2bNoted = 0; let count3aNoted = 0; let count4aNoted = 0;

    if (data.length > 0) 
    {
        for (let i = 0; i < data.length; i++) 
        {
            if ((enroll.split(':$:')[0] === data[i].student.username) && (enroll.split(':$:')[1] === data[i].subject.paper_code)) 
            {
                enrollNo = enroll.split(':$:')[0];
                studName = data[i].student.name;
                paperCode = data[i].subject.paper_code;
                paperName = data[i].subject.paper_name;
                instName = data[i].inst.college_name;
                examStart = new Date(data[i].exam.startedon).toLocaleDateString()+' '+new Date(data[i].exam.startedon).toLocaleTimeString();
                examEnd = new Date(data[i].exam.endon).toLocaleDateString()+' '+new Date(data[i].exam.endon).toLocaleTimeString();
                examStatus = data[i].exam.examstatus;
                phStatus = data[i].student.ph;
                slot = data[i].subject.slot;
                proctor = data[i].proctor.username;

                if (data[i].warningNo === 1) {
                    count1a++;
                    if (data[i].noted === 1) {
                        count1aNoted++;
                    }
                }
                else if (data[i].warningNo === 2) {
                    count1b++;
                    if (data[i].noted === 1) {
                        count1bNoted++;
                    }
                }
                else if (data[i].warningNo === 3) {
                    count1c++;
                    if (data[i].noted === 1) {
                        count1cNoted++;
                    }
                }
                else if (data[i].warningNo === 4) {
                    count1d++;
                    if (data[i].noted === 1) {
                        count1dNoted++;
                    }
                }
                else if (data[i].warningNo === 5) {
                    count2a++;
                    if (data[i].noted === 1) {
                        count2aNoted++;
                    }
                }
                else if (data[i].warningNo === 6) {
                    count2b++;
                    if (data[i].noted === 1) {
                        count2bNoted++;
                    }
                }
                else if (data[i].warningNo === 7) {
                    count3a++;
                    if (data[i].noted === 1) {
                        count3aNoted++;
                    }
                }
                else if (data[i].warningNo === 8) {
                    count4a++;
                    if (data[i].noted === 1) {
                        count4aNoted++;
                    }
                }
            }
        }

        malpractice1 = count1a+count1b+count1c+count1d;
        malpractice2 = count2a+count2b;
        malpractice3 = count3a;
        malpractice4 = count4a;

        let malpracticeArr = [];
        if(malpractice1 > 3)
        {
            malpracticeArr.push(1);
        }
        if(malpractice2 > 2)
        {
            malpracticeArr.push(2);
        }
        if(malpractice3 > 2)
        {
            malpracticeArr.push(3);
        }
        if(malpractice4 > 1)
        {
            malpracticeArr.push(4);
        }

        let MalPracticeString = malpracticeArr.join();


        return { 'id':i++,'enrollNo': enrollNo, 'studName': studName, 'paperCode': paperCode, 'examStart': examStart, 'examEnd': examEnd, 'examStatus': examStatus, 'phStatus': phStatus, 'slot': slot, 'count1a': count1a, 'count1b': count1b, 'count1c': count1c, 'count1d': count1d, 'count2a': count2a, 'count2b': count2b, 'count3a': count3a, 'count4a': count4a, 'count1aNoted': count1aNoted, 'count1bNoted': count1bNoted, 'count1cNoted': count1cNoted, 'count1dNoted': count1dNoted, 'count2aNoted': count2aNoted, 'count2bNoted': count2bNoted, 'count3aNoted': count3aNoted, 'count4aNoted': count4aNoted,'paperName':paperName,'instName':instName,'proctor':proctor,'malpracticeString':MalPracticeString };
    }

}

export default StudentProctoringCountReport;
