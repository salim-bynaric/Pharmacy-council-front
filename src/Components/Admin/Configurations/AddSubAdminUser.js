import React, {useState} from 'react';
import SubAdminForm from './SubAdminForm';
import SubAdminList from './SubAdminList';

const AddSubAdminUser = () => {
    const [myList, setMyList]   = useState(true);
    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Add Sub-Admin User</li>
                </ol>
                <div className="row animate__animated animate__fadeInDown animate_slower">
                    <SubAdminForm setMyList={setMyList} myList={myList}/>
                    <SubAdminList role='SUBADMIN' setMyList={setMyList} myList={myList}/>
                </div>
            </div>
        </div>
    );
};

export default AddSubAdminUser;