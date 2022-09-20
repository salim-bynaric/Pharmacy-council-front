import React, { useState } from 'react';
import API from '../../api';

function ClearSessionUserInfo(props) 
{
    const [sessionCleared ,setSessionCleared] = useState(false);
    const [message ,setMessage] = useState('');

        return (
            <div className="animate__animated animate__pulse animate_slower">
                <div className="col-lg-12" style={{overflow:"auto"}}>
                    <table className="table table-bordered">
                        <thead>
                            <tr style={{backgroundColor: "aqua"}}>
                                <th colSpan={5}>
                                    <center>User Information</center>
                                </th>
                            </tr>
                            <tr style={{backgroundColor: "aqua"}}>
                                <th>UID</th>
                                <th>User Name</th>
                                <th>User Role</th>
                                <th>Name</th>
                                <th>Mobile</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {props.userData.uid}
                                </td>
                                <td>
                                    {props.userData.username}
                                </td>
                                <td>
                                    {props.userData.role}
                                </td>
                                <td>
                                    {props.userData.name}
                                </td>
                                <td>
                                    {props.userData.mobile}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-lg-12" style={{overflow:"auto"}}>
                    {props.userData.role === 'STUDENT' ?
                        <table className="table table-bordered">
                            <thead>
                                <tr style={{backgroundColor: "aqua"}}>
                                    <th colSpan={4}>
                                        <center>Institute Information</center>
                                    </th>
                                </tr>
                                <tr style={{backgroundColor: "aqua"}}>
                                    <th>Inst Id</th>
                                    <th>Inst Name</th>
                                    <th>Inst Mobile</th>
                                    <th>Inst Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {props.userData.instid.inst_id}
                                    </td>
                                    <td>
                                        {props.userData.instid.name}
                                    </td>
                                    <td>
                                        {props.userData.instid.mobile}
                                    </td>
                                    <td>
                                        {props.userData.instid.email}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    : null}
                </div>
                <div className="col-lg-12">
                    <center><button onClick={() => {clearSession(props.userData.uid,setSessionCleared,props.setUserData,setMessage)}} className="btn btn-info">Clear Session</button></center>
                </div>
                <div className="col-lg-12">
                    {sessionCleared ? 
                        <div className="alert alert-dark" role="alert" style={{marginTop:"5px"}}>
                            {message}
                        </div>
                    : null}
                </div>
            </div>
        );
}

async function clearSession(uid,setSessionCleared,setUserData,setMessage)
{
    await API.put('/sessions',{"uid" : uid, "type" : "clearsession"})
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setSessionCleared(true);
            setMessage(res.data.message);
            setTimeout(() => {
                setUserData(undefined);
            }, 25000);
        }
        else 
        {
            setSessionCleared(true);
            setMessage(res.data.message);
            setTimeout(() => {
                setUserData(undefined);
            }, 25000);
        }
    })
    .catch(function (error) 
    {
        setSessionCleared(false);
        setMessage('Problem Clearing Session of this User.');
    })
}

export default ClearSessionUserInfo;