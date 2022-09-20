import React, {useState} from 'react';
import AdminForm from './AdminForm';
import AdminList from './AdminList';

const AddAdminUser = () => {
    const [myList, setMyList]   = useState(true);
    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Add Admin User</li>
                </ol>
                <div className="row animate__animated animate__fadeInDown animate_slower">
                    <AdminForm setMyList={setMyList} myList={myList}/>
                    <AdminList role='ADMIN' setMyList={setMyList} myList={myList}/>
                </div>
            </div>
        </div>
    );
};

export default AddAdminUser;