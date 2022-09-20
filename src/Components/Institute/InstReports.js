import React from 'react';
import { Link } from 'react-router-dom';

function InstReports(props) {
    return (
        <div>
            <div className="container-fluid">
                <br />
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Institute Reports</li>
                </ol>
                <div className="row col-lg-12 animate__animated animate__fadeInDown animate_slower">
                    <table className="table table-bordered">
                        <thead>
                            <tr style={{ backgroundColor: "aqua" }}>
                                <th colSpan={3}><center>Examination Reports</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/instexamreport" }}>
                                        Institute Examination Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/studentExamLogReport" }}>
                                        Student Exam Log Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/examDashboardReport" }}>
                                        Examination Dashboard
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/studentProctoringsReport" }}>
                                        Student Image Proctoring Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/proctoringSummaryReport" }}>
                                        Proctoring Summary Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/studProctoringCountReport" }}>
                                        Student Proctoring Count Report
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/studentSubAllocReport" }}>
                                        Student Subject Allocation Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/checkerCountReport" }}>
                                        Paper Checker Count Report
                                    </Link>
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table><br/>

                    <table className="table table-bordered">
                        <thead>
                            <tr style={{ backgroundColor: "aqua" }}>
                                <th colSpan={3}><center>Reports For Cross-verification</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/examQuestionSpecificationMatchReport" }}>
                                        Examination Question Specification Match Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/examQuestionSpecificationReport" }}>
                                        Examination Question Specification Mis-Match Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/qbStatusReport" }}>
                                        Question Bank Status Report
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/subjectWiseStudentCountReport" }}>
                                        Subjectwise Student Count Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/proctorWiseStudentCountReport" }}>
                                        Proctorwise Student Count Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/subjectWiseQuestionCountReport" }}>
                                        Subjectwise Question Count Report
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/studQuestCountMismatchReport" }}>
                                        Student Question Count Mismatch Report
                                    </Link>
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default InstReports;
