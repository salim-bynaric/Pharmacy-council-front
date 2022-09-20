import React, {useState} from 'react';
import AddInstForm from './AddInstForm';
import UploadInst from './UploadInst';
import UserList from '../Admin/Lists/UserList';

const AddInst = () => {
    const [myList, setMyList]   = useState(true);
    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Add/Upload Institutes</li>
                </ol>
                <div className="row animate__animated animate__fadeInDown animate_slower">
                    <AddInstForm setMyList={setMyList} myList={myList}/>
                    <UploadInst setMyList={setMyList} myList={myList}/>
                    <UserList setMyList={setMyList} myList={myList} role={'EADMIN'}/>
                </div>
            </div>
        </div>
    );
};

export default AddInst;