import React from 'react';
import ResetExamTimeForm from './ResetExamTimeForm';

const ResetExamTime = () => {
    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Reset Examination Time</li>
                </ol>
                <div className="row col-lg-12">
                    <ResetExamTimeForm />
                </div>

            </div>
        </div>
    );
};

export default ResetExamTime;