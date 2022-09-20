import React,{useState,useContext} from 'react';
import SubjectMasterForm from './SubjectMasterForm';
import UploadSubjects from './UploadSubjects';
import SubjectList from './SubjectList';
import EditSubject from './EditSubject';
import {UserContext} from '../../../App';

const SubjectMaster = () => {
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
                    <li className="breadcrumb-item active">Subject Master</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <SubjectMasterForm setMyList={setMyList} myList={myList}/>
                    <UploadSubjects setMyList={setMyList} myList={myList}/>
                    <SubjectList setMyList={setMyList} myList={myList} edit={edit} setEdit={setEdit} setEditData={setEditData} />

                    {edit ?
                    <EditSubject edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData} setMyList={setMyList} myList={myList}/>
                    :null}
                </div>
            </div>
        </div>
        :null
    );
};

export default SubjectMaster;