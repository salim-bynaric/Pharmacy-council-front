import React from 'react';

const ExamDashboard = (props) => {
    let log                 = props.log;

    let totalStudents       = 0;
    let totalInProgress     = 0;
    let totalEndExam        = 0;
    let totalNotStarted     = 0;
    let paperCode           = '';
    let paperName           = '';

    if(log!== undefined && log.length > 0)
    {
        log.map(exam => {
            if(exam.examstatus === '' || exam.examstatus === null || exam.examstatus === undefined)
            {
                totalNotStarted     = totalNotStarted + 1;
            }
            else if(exam.examstatus === 'inprogress')
            {
                totalInProgress     = totalInProgress + 1;
            }
            else if(exam.examstatus === 'over')
            {
                totalEndExam        = totalEndExam + 1;
            }
            totalStudents           = totalStudents + 1;
            paperCode               = exam.paper.paper_code;
            paperName               = exam.paper.paper_name;
        });
    }

    return (
        (log !== undefined && log.length > 0) ?
        <div className="col-lg-8">
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-address-card mr-1"/>
                        Exam Dashboard
                </div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr style={{"backgroundColor":"#e9ecef"}}>
                                <th width="5%">Sr No</th>
                                <th width="10%">Subject</th>
                                <th width="5%">Total Students</th>
                                <th width="5%">Total In Progress</th>
                                <th width="5%">Total End Exam</th>
                                <th width="5%">Total Not Started</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td width="5%">1</td>
                                <td width="10%">({paperCode})-{paperName}</td>
                                <td width="5%">{totalStudents}</td>
                                <td width="5%" style={{"backgroundColor":"yellow"}}>{totalInProgress}</td>
                                <td width="5%" style={{"backgroundColor":"gray"}}>{totalEndExam}</td>
                                <td width="5%" style={{"backgroundColor":"red"}}>{totalNotStarted}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
        :
        <div className="alert alert-danger col-lg-12">
            Exam Data not Found.
        </div>     
    );
};

export default ExamDashboard;