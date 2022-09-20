import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ShowContext } from '../../App';
import { UserContext } from '../../App';
import API from '../../api';
import StudWiseProctor from './StudWiseProctor';

const ProctorHome = () => {
    const [dateSlot, setDateSlot] = useState([]);
    const [proctorData, setProctorData] = useState([]);
    let history = useHistory();
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        if (currentUser !== undefined) {
            getProctorDateSlot(setDateSlot, currentUser.uid, setShow, setMsg);
        }
    }, [currentUser]);

    return (
        dateSlot.length > 0 ?
            currentUser ?
                <div>
                    <div className="container-fluid">
                        <br/>
                        <ol className="breadcrumb mb-4">
                            <li className="breadcrumb-item active">{'Welcome ' + currentUser.name + ' (' + currentUser.role + ')'}</li>
                        </ol>
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fas fa-users mr-1" />
                                    <b>Bulk Proctoring</b>
                                </div>
                                <div><br />
                                    <div className="form-group">
                                        <div className="col-lg-12 row">
                                            <div className="col-lg-4">
                                                Select Date Slot
                                            </div>
                                            <div className="col-lg-8">
                                                <select id="paperId" name="paperId" className="form-control"
                                                    onChange={e => handleOnChange(e, currentUser, setShow, setMsg, setProctorData, history)}>
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
                            </div>
                            {
                                dateSlot.length === 0 ?
                                    <div className="alert alert-warning" style={{"marginTop":"20px"}}><b>You are not allocated with any Proctoring Date Slot...</b></div>
                                : null
                            }
                        </div>
                        {/*<div className="col-lg-12" style={{ "marginTop": "20px" }}>
                            <StudWiseProctor subjects={subjects} />
                        </div>*/}
                    </div>
                </div>
            : null
        : <div className="alert alert-warning" style={{"marginTop":"20px"}}><b>You are not allocated with any Proctoring Date Slot...</b></div>
    );
};

async function handleOnChange(e, currentUser, setShow, setMsg, setProctorData, history) {
    let dateSlot = e.target.value;
    let date = dateSlot.split(':$:')[0];
    let slot = dateSlot.split(':$:')[1];

    let uid = currentUser.uid;

    await API.get('/proctorAllocation', { params: { "type": "byDateSlot", "dateSlot": dateSlot, "proctorUid": uid, "instId": currentUser.inst_id } })
        .then((res) => 
        {
            if (res.data.status === 'success') 
            {
                setProctorData(res.data.data);
                if (res.data.data.length !== 0) {
                    if (res.data.data.length <= 30) {
                        history.push("/startProctor", { 'proctorData': res.data.data, 'date': date, 'instId': currentUser.inst_id, 'proctorUid': uid, 'slot': slot });
                    }
                    else {
                        setShow(true);
                        setMsg('You Can not proctor more than 30 Students in Bulk Proctoring...');
                    }
                }
                else {
                    setShow(true);
                    setMsg('You are not allocated with any student for this subject...');
                }
            }
            else 
            {
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

export default ProctorHome;