import React, {useState} from 'react';
import ClusterControllerForm from './ClusterControllerForm';
import UploadClusterController from './UploadClusterController';
import UserList from '../Lists/UserList';

const ClusterController = () => {
    const [myList, setMyList]   = useState(true);
    return (
        <div>
            <div className="container-fluid">
               <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Add Cluster Controller Form</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <ClusterControllerForm setMyList={setMyList} myList={myList}/>
                    <UploadClusterController setMyList={setMyList} myList={myList}/>
                    <UserList setMyList={setMyList} myList={myList} role={'CADMIN'}/>
                </div>
            </div>
        </div>
    );
};

export default ClusterController;