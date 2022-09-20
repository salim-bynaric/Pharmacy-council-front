import React from 'react';
import ExamDataFolderForm from './ExamDataFolderForm';

const SetDataFolder = () => {
    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                Set Data Folder &nbsp;&nbsp;&nbsp;&nbsp;
                    <li className="breadcrumb-item active" style={{"color":"red"}}><b>Instructions:Existing Data folder for Given Institute will not be deleted.</b></li>
                </ol>
                <div className="row col-lg-12 animate__animated animate__fadeInDown animate_slower">
                    <ExamDataFolderForm />
                </div>

            </div>
        </div>
    );
};

export default SetDataFolder;