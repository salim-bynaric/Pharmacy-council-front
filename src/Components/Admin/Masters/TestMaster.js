import React, {useState,useContext} from 'react';
import TestMasterForm from './TestMasterForm';
import UploadTests from './UploadTests';
import TestList from './TestList';
import {UserContext} from '../../../App';
import EditTest from './EditTest';

const TestMaster = () => {
    const [myList, setMyList]       = useState(true);
    const {currentUser }            = useContext(UserContext);

    const [edit,setEdit]            = useState(false);
    const [editData,setEditData]    = useState();

    return (
        currentUser ?
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Test Master</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <TestMasterForm myList={myList} setMyList={setMyList} />
                    <UploadTests myList={myList} setMyList={setMyList} />
                    <TestList myList={myList} setMyList={setMyList}  edit={edit} setEdit={setEdit} setEditData={setEditData}/>

                    {edit ?
                    <EditTest edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData} setMyList={setMyList} myList={myList}/>
                    :null}
                </div>
            </div>
        </div>
        : null
    );
};

export default TestMaster;