import React, {useState,useContext} from 'react';
import StudentMasterForm from '../Masters/StudentMasterForm';
import UploadStudents from '../Masters/UploadStudents';
import StudentList from "../Masters/StudentList";
import {UserContext} from '../../../App';
import EditStudent from './EditStudent';

const StudentMaster = () => {
    const [myList, setMyList]   = useState(true);
    const {currentUser }        = useContext(UserContext);

    const [edit,setEdit]            = useState(false);
    const [editData,setEditData]    = useState();

    return (
        currentUser ?
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Student Master</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <StudentMasterForm setMyList={setMyList} myList={myList}/>
                    <UploadStudents setMyList={setMyList} myList={myList}/>
                    <StudentList setMyList={setMyList} myList={myList} edit={edit} setEdit={setEdit} setEditData={setEditData}/>

                    {edit ?
                    <EditStudent edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData} setMyList={setMyList} myList={myList}/>
                    :null}
                </div>
            </div>
        </div>
        : null
    );
};
export default StudentMaster;