import React, {useState} from 'react';
import SetterSubjectAllocForm from './SetterSubjectAllocForm';
import UploadSetterSubjectAlloc from './UploadSetterSubjectAlloc';
import SetterSubjectAllocList from './SetterSubjectAllocList';
import { Link } from 'react-router-dom';

const SetterSubjectAlloc = (props) => {
    const [myList, setMyList]       = useState(true);

    return (
        props.location.state ?
        <div>
          <div className="container-fluid">
              <br/>
              <div className="breadcrumb col-lg-12">
                    <div className="breadcrumb-item col-lg-10">
                      Paper Setter Subject Allocation
                    </div>
                    <span style={{"float":"right"}} className="col-lg-2">
                        <Link to="addPaperSetter" className="btn btn-danger btn-sm">Go Back</Link>
                    </span>
              </div>
              <div className="col-lg-12 row">
                <div className="col-lg-6">
                  <SetterSubjectAllocForm setMyList={setMyList} myList={myList} data={props.location.state.data}/>
                </div>
                <div className="col-lg-6">
                    <UploadSetterSubjectAlloc setMyList={setMyList} myList={myList} data={props.location.state.data}/>
                </div>
              </div>
              <div className="col-lg-12">
                <SetterSubjectAllocList myList={myList} setMyList={setMyList}/>
              </div>
              
          </div>
        </div>
        :null
    );
};

export default SetterSubjectAlloc;