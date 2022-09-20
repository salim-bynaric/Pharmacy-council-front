import React from 'react';
import { Link } from 'react-router-dom';

const ProctorReports = () => {
    return (
        <div>
        <div className="container-fluid">
            <br/>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Proctor Reports</li>
            </ol>
            <div className="row col-lg-12 animate__animated animate__fadeInDown animate_slower">
            <table className="table table-bordered">
                <thead>
                    <tr style={{backgroundColor:"aqua"}}>
                        <th colSpan={3}><center>Proctor Reports</center></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Link  className="nav-link" to={{pathname: "/proctorStudAllocReport"}}>
                                Proctor Student Allocation Report
                            </Link>
                        </td>
                        <td>
                            <Link  className="nav-link" to={{pathname: "/proctoringSummaryReport"}}>
                                Proctoring Summary Report
                            </Link>
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
};

export default ProctorReports;