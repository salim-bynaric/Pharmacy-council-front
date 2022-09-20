import React,{useState,useContext} from 'react';
import {UserContext} from '../../../App';
import SubProgramList from './SubProgramList';
import SubProgramMasterForm from './SubProgramMasterForm';

const SubProgramMaster = () => {
    const [myList, setMyList]       = useState(true);
    const {currentUser }            = useContext(UserContext);

    return (
        currentUser ?
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Sub-Program Master</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <SubProgramMasterForm setMyList={setMyList} myList={myList}/>
                    <SubProgramList setMyList={setMyList} myList={myList}/>
                </div>
            </div>
        </div>
        :null
    );
};

export default SubProgramMaster;