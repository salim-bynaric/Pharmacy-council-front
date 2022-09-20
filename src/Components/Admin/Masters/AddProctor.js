import React, {useState} from 'react';
import AddProctorForm from './AddProctorForm';
import ProctorList from './ProctorList';
import UploadProctor from './UploadProctor';
import EditProctor from './EditProctor';

const AddProctor = () => {
    const [myList, setMyList]       = useState(true);
    const [edit,setEdit]            = useState(false);
    const [editData,setEditData]    = useState();

    return (
        <div>
          <div className="container-fluid">
              <br/>
              <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item active">Add Proctor</li>
              </ol>
              <div className="col-lg-12 row">
                <div className="col-lg-6">
                  <AddProctorForm setMyList={setMyList} myList={myList}/>
                </div>
                <div className="col-lg-6">
                  <UploadProctor setMyList={setMyList} myList={myList}/>
                </div>
              </div>
              <div className="col-lg-12">
                <ProctorList myList={myList} setMyList={setMyList} edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData}/>
              </div>
              <div className="col-lg-12">
                {
                    edit ?
                        <EditProctor edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData} setMyList={setMyList} myList={myList} />
                    :
                    null
                }
              </div>
          </div>
        </div>
    );
};

export default AddProctor;