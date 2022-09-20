import React, {useState} from 'react';
import UploadInstProgramAlloc from './UploadInstProgramAlloc';
import InstProgramList from './InstProgramList';

const InstProgramAllocation = () => {
    const [myList, setMyList]   = useState(true);
    return (
        <div>
            <div className="container-fluid">
                <h1 className="mt-4">Institute Programs Allocation</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Institute Programs Allocation</li>
                </ol>
                <div className="row animate__animated animate__pulse animate_slower">
                    <UploadInstProgramAlloc setMyList={setMyList} myList={myList}/>
                    <InstProgramList setMyList={setMyList} myList={myList}/>
                </div>
            </div>
        </div>
    );
};

export default InstProgramAllocation;