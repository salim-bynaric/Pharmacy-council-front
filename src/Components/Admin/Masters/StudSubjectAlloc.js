import React, {useState,useContext} from 'react';
import UploadStudentSubjectAlloc from './UploadStudentSubjectAlloc';
import StudentSubjectList from './StudentSubjectList';
import StudSubjectAllocForm from './StudSubjectAllocForm';

import {UserContext} from '../../../App';

const StudSubjectAlloc = () => {
    const [myList, setMyList]   = useState(true);
    const {currentUser }        = useContext(UserContext);

    return (
        currentUser ?
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Student Subject Allocation</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <div className="col-lg-6">
                        <UploadStudentSubjectAlloc setMyList={setMyList} myList={myList}/>
                    </div>
                    <div className="col-lg-6">
                        <StudSubjectAllocForm setMyList={setMyList} myList={myList}/>
                    </div>
                    <StudentSubjectList setMyList={setMyList} myList={myList}/>
                </div>
            </div>
        </div>
        : null
    );
};

export default StudSubjectAlloc;