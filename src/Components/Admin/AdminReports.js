import React from 'react';
import { Link } from 'react-router-dom';

function AdminReports(props) {
    return (
        <div>
            <div className="container-fluid">
                <br />
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Admin Reports</li>
                </ol>
                <div className="row col-lg-12 animate__animated animate__fadeInDown animate_slower">
                    <table className="table table-bordered">
                        <thead>
                            <tr style={{ backgroundColor: "aqua" }}>
                                <th colSpan={4}><center>Admin Examination Reports</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*<tr>
                            <td>
                                <Link  className="nav-link" to={{pathname: "/adminexamreport"}}>
                                    Examination Report
                                </Link>
                            </td>
                            <td>
                                <Link  className="nav-link" to={{pathname: "/examQuestionSpecificationMatchReport"}}>
                                    Examination Question Specification Match Report
                                </Link>
                            </td>
                            <td>
                                <Link  className="nav-link" to={{pathname: "/examQuestionSpecificationReport"}}>
                                    Examination Question Specification Mis-Match Report
                                </Link>
                            </td>
                        </tr>*/}
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/adminexamreport" }}>
                                        Examination Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/studentExamLogReport" }}>
                                        Student Exam Log Report
                                    </Link>
                                </td>
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
                            </tr>
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/checkerCountReport" }}>
                                        Paper Checker Count Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/moderatorCountReport" }}>
                                        Paper Moderator Count Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/subAnsNotSolvedReport" }}>
                                        Subjective Answer Not Solved Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/paperSetterDetailsReport" }}>
                                        Paper Setter Details Report
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/studProctoringCountReport" }}>
                                        Student Proctoring Count Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/studentAttendanceReport" }}>
                                        Student Attendance Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/qbStatusReport" }}>
                                        Question Bank Status Report
                                    </Link>
                                </td>
                                <td>
                                    <Link className="nav-link" to={{ pathname: "/sectionWiseStudMarks" }}>
                                        Section Wise Student Marks Report
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminReports;
