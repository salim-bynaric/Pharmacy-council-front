import React, {useState} from 'react';
import GlobalControllerForm from './GlobalControllerForm';
import UploadGlobalController from './UploadGlobalController';
import UserList from '../Lists/UserList';


const GlobalController = () => {
    const [myList, setMyList]   = useState(true);
    return (
        <div>
        <div className="container-fluid">
            <br/>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Add Global Controller Form</li>
            </ol>
            <div className="row animate__animated animate__pulse animate_slower">
                <GlobalControllerForm setMyList={setMyList} myList={myList}/>
                <UploadGlobalController setMyList={setMyList} myList={myList}/>
                <UserList setMyList={setMyList} myList={myList} role={'GADMIN'}/>
            </div>
        </div>
      </div>
    );
};

export default GlobalController;