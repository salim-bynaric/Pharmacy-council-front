import React, {useState} from 'react';
import AddPaperSetterForm from './AddPaperSetterForm';
import PaperSetterList from './PaperSetterList';
import UploadPaperSetter from './UploadPaperSetter';
import EditPaperSetter from './EditPaperSetter';

const AddPaperSetter = () => {
    const [myList, setMyList]       = useState(true);
    const [edit,setEdit]            = useState(false);
    const [editData,setEditData]    = useState();

    return (
        <div>
          <div className="container-fluid">
              <br/>
              <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item active">Add Paper Setter</li>
              </ol>
              <div className="col-lg-12 row">
                <div className="col-lg-6">
                  <AddPaperSetterForm setMyList={setMyList} myList={myList}/>
                </div>
                <div className="col-lg-6">
                  <UploadPaperSetter setMyList={setMyList} myList={myList}/>
                </div>
              </div>
              <div className="col-lg-12">
                <PaperSetterList  myList={myList} setMyList={setMyList} edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData} />
              </div>
              <div className="col-lg-12">
                {
                    edit ?
                    <EditPaperSetter edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData} setMyList={setMyList} myList={myList} />
                    :
                    null
                }
              </div>
          </div>
        </div>
    );
};

export default AddPaperSetter;