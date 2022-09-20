import React from 'react';
import ResetExamForm from './ResetExamForm';

const ResetExam = () => {
    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Reset Candidate Examination</li>
                </ol>
                <div className="row col-lg-12">
                    <ResetExamForm />
                </div>

            </div>
        </div>
    );
};

export default ResetExam;