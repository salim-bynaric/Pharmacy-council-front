import React, {useState} from 'react';
import CheckerSubjectAllocForm from './CheckerSubjectAllocForm';
import UploadCheckerSubject from './UploadCheckerSubject';
import { Link } from 'react-router-dom';
import CheckerSubjectAllocList from './CheckerSubjectAllocList';

const SetterSubjectAlloc = (props) => {
    const [myList, setMyList]       = useState(true);
    return (
        props.location.state ?
        <div>
          <div className="container-fluid">
              <h1 className="mt-4">Paper Checker Subject Allocation</h1>
              <div className="breadcrumb col-lg-12">
                    <div className="breadcrumb-item col-lg-10">
                      Paper Checker Subject Allocation
                    </div>
                    <span style={{"float":"right"}} className="col-lg-2">
                        <Link to="addQuestChecker" className="btn btn-danger btn-sm">Go Back</Link>
                    </span>
              </div>
              <div className="col-lg-12 row">
                <div className="col-lg-6">
                  <CheckerSubjectAllocForm data={props.location.state.data} setMyList={setMyList} myList={myList} />
                </div>
                <div className="col-lg-6">
                    <UploadCheckerSubject setMyList={setMyList} myList={myList} data={props.location.state.data}/>
                </div>
              </div>
              <div className="col-lg-12">
                <CheckerSubjectAllocList myList={myList} setMyList={setMyList}/>
              </div>
              
          </div>
        </div>
        :null
    );
};

export default SetterSubjectAlloc;