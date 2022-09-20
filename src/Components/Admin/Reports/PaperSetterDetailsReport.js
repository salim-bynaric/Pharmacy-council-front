import React from 'react';
import SetterDetailsReport from './SetterDetailsReport';

const PaperSetterDetailsReport = () => {
    return (
        <div>
            <div className="container-fluid">
                <h1 className="mt-4">Paper Setter Details Report</h1>
                <ol className="breadcrumb mb-4">
                    <font color="red" size="3"><b>Instruction:</b> Select Program to get Report</font>
                </ol>
                <div className="row col-lg-12">
                    <SetterDetailsReport />
                </div>
            </div>
        </div>
    );
};

export default PaperSetterDetailsReport;