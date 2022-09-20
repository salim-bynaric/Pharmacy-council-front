import React, {useState} from 'react';
import AddQuestionCheckerForm from './AddQuestionCheckerForm';
import QuestionCheckerList from './QuestionCheckerList';
import UploadQuestionChecker from './UploadQuestionChecker';
import EditQuestionChcker from './EditQuestionChecker';

const AddQuestChecker = () => {
    const [myList, setMyList]       = useState(true);
    const [edit,setEdit]            = useState(false);
    const [editData,setEditData]    = useState();

    return (
        <div>
          <div className="container-fluid">
              <br/>
              <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item active">Add Question Checker</li>
              </ol>
              <div className="col-lg-12 row">
                <div className="col-lg-6">
                  <AddQuestionCheckerForm setMyList={setMyList} myList={myList}/>
                </div>
                <div className="col-lg-6">
                  <UploadQuestionChecker setMyList={setMyList} myList={myList} />
                </div>
              </div>
              <div className="col-lg-12">
                {edit ?
                    <EditQuestionChcker edit={edit} setEdit={setEdit} setEditData={setEditData} editData={editData} setMyList={setMyList} myList={myList}/>
                :null}
              </div>
              <div className="col-lg-12">
                <QuestionCheckerList setMyList={setMyList} myList={myList} setEdit={setEdit} setEditData={setEditData}/>
              </div>
          </div>
        </div>
    );
};

export default AddQuestChecker;