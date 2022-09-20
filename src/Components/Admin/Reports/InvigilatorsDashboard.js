import React, { useState, useContext, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { ShowContext } from '../../../App';
import API from '../../../api';
import { UserContext } from '../../../App';
import InvigilatorDashboardReport from './InvigilatorDashboardReport';

const InvigilatorsDashboard = () => {
    const [myDate, setMyDate] = useState(new Date());
    const [mySlot, setMySlot] = useState('');
    const [myStatus, setMyStatus] = useState('all');
    const [insts, setInsts] = useState([]);
    const [value, setValue] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState();
    const [totalLoggedIn, setTotalLoggedIn] = useState();
    const [totalNotLoggedIn, setTotalNotLoggedIn] = useState();
    const [totalStud, setTotalStud] = useState();
    const [reportData, setReportData] = useState();

    useEffect(() => {
        if(currentUser != null){
            if(currentUser.role === 'EADMIN'){
                setValue(currentUser.uid);
            }else{
                getInsts(setInsts, setShow, setMsg);
            }
        }
    }, []);

    return (
        currentUser ?
            <div>
                <div className="container-fluid">
                    <br/>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Invigilator Dashboard Report</li>
                    </ol>
                    <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-address-card mr-1" />
                                Dashboard Filters
                            </div>
                           
                            <div className="card-body col-lg-12 row">

                                { currentUser.role !== 'EADMIN' ?
                                <div className="col-lg-12 row" style={{ "marginBottom": "20px" }}>
                                    <div className="col-lg-4">
                                        <b>Select Institute</b>
                                    </div>
                                    <div className="col-lg-8">
                                        <select id="inst_id" name="inst_id" className="form-control" onChange={e => { setValue(e.currentTarget.value); }}>
                                            <option value="">Select Institute</option>
                                            {
                                                insts.map(inst =>
                                                (
                                                    <option key={inst.uid} value={inst.uid}>
                                                        {inst.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                : null }
                                <div><hr/></div>
                                
                                <div className="form-group col-lg-4">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            <b>Select Date</b>
                                        </div>
                                        <div className="col-lg-8">
                                            <DateTimePicker id="date" onChange={setMyDate} value={myDate} name="date" format="yyyy-MM-dd HH:mm:ss" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group col-lg-4">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            <b>Select Slot</b>
                                        </div>
                                        <div className="col-lg-8">
                                            <select id="slot" name="slot" className="form-control" onChange={(e) => {
                                                setMySlot(e.target.value);
                                            }} value={mySlot}>
                                                <option value="">Select Slot</option>
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
                                            <b>Login Status</b>
                                        </div>
                                        <div className="col-lg-8">
                                            <select id="status" name="status" className="form-control" onChange={(e) => {
                                                setMyStatus(e.target.value);
                                            }} value={myStatus}>
                                                <option value="all">All</option>
                                                <option value="loggedin">Logged In</option>
                                                <option value="notloggedin">Not Logged In</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <center>
                                    <button className="btn btn-info" onClick={async () => {
                                        setLoading(true);
                                        await getInvigilatorDashboardReport(myDate, mySlot, myStatus, setShow, setMsg, currentUser, value, setTotal, setTotalLoggedIn, setTotalNotLoggedIn, setTotalStud, setReportData);
                                        setLoading(false);
                                    }}>Submit</button>
                                </center>
                            </div>
                        </div>
                    </div>
                    {
                        !loading ?
                            total !== undefined && totalLoggedIn !== undefined && totalNotLoggedIn !== undefined && totalStud !== undefined && reportData !== undefined ?
                                <InvigilatorDashboardReport total={total} totalNotLoggedIn={totalNotLoggedIn} totalLoggedIn={totalLoggedIn} totalStud={totalStud} reportData={reportData} />
                            : null
                        :<div className="custom-loader"></div>
                    }
                </div>
            </div>
            : null
    );
};

async function getInsts(setInsts, setShow, setMsg) {
    await API.get('/user', { params: { "role": "EADMIN" } })
        .then((res) => {
            if (res.data.status === 'success') {
                setInsts(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function getInvigilatorDashboardReport(date, slot, status, setShow, setMsg, currentUser, inst, setTotal, setTotalLoggedIn, setTotalNotLoggedIn, setTotalStud,setReportData) 
{
    if (currentUser.role === 'EADMIN') {
        inst = currentUser.uid;
    }

    if (inst === '' || inst === undefined || inst === null) {
        setShow(true);
        setMsg('Please Select Insitute...');
        return false;
    }

    date = date.toISOString().substr(0, 10);
    await API.get('/proctor/dashboard', { params: { 'fromDate': date, 'slot': slot, 'status': status, 'inst': inst } })
        .then((res) => {
            if (res.data.status === 'success') {
                setTotal(res.data.total);
                setTotalLoggedIn(res.data.totalLoggedIn);
                setTotalNotLoggedIn(res.data.totalNotLoggedIn);
                setTotalStud(res.data.totalStud);
                setReportData(res.data.reportData);
            }
            else {
                setShow(true);
                setMsg(res.data.message);
                setTotal(undefined);
                setTotalLoggedIn(undefined);
                setTotalNotLoggedIn(undefined);
                setTotalStud(undefined);
                setReportData(undefined);
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg('Problem Fetching Data from Server');
            setTotal(undefined);
            setTotalLoggedIn(undefined);
            setTotalNotLoggedIn(undefined);
            setTotalStud(undefined);
            setReportData(undefined);
        });
}

export default InvigilatorsDashboard;