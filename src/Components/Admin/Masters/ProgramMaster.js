import React, {useState,useContext} from 'react';
import ProgramMasterForm from '../Masters/ProgramMasterForm';
import UploadPrograms from '../Masters/UploadPrograms';
import ProgramList from "../Masters/ProgramList";
import {UserContext} from '../../../App';
import EditProgram from './EditProgram';

const ProgramMaster = () => {
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
                    <li className="breadcrumb-item active">Program Master</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <ProgramMasterForm setMyList={setMyList} myList={myList}/>
                    <UploadPrograms setMyList={setMyList} myList={myList}/>
                    <ProgramList setMyList={setMyList} myList={myList} edit={edit} setEdit={setEdit} setEditData={setEditData}/>
                    {edit ?
                    <EditProgram edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData} setMyList={setMyList} myList={myList}/>
                    :null}
                </div>
            </div>
        </div>
        :null
    );
};

export default ProgramMaster;