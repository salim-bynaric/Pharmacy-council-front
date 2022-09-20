import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Moment from 'react-moment';

const InvigilatorDashboardReport = ({ total, totalNotLoggedIn, totalLoggedIn, totalStud, reportData }) => {
    const header                                    =   getHeader();
    const data                                      =   getData(reportData);
    const options = {
        sizePerPageList: [
            {
                text: '50', value: 50
            },
            {
                text: '500', value: 500
            }, 
            {
                text: '1000', value: 1000
            }, 
            {
                text: '10000', value: 10000
            }
        ]
    };

    return (
        <div>
            <div className="col-lg-12 row">
                <div className="col-lg-3">
                    <div className="alert alert-primary" role="alert">
                        Total Assigned Candidates: <b>{totalStud}</b>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="alert alert-secondary" role="alert">
                        Total Loggedin Invigilators: <b>{totalLoggedIn}</b>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="alert alert-dark" role="alert">
                        Not Loggedin Invigilators: <b>{totalNotLoggedIn}</b>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="alert alert-success" role="alert">
                        <b>Total Distinct Invigilators</b>: <b>{total}</b>
                    </div>
                </div>
            </div>
            <div className="col-lg-12" style={{"marginTop":"20px"}}>
                <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
            </div>
        </div>
    );
};

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srNo'},
        { text: 'User Name', dataField: 'userName',filter: textFilter()},
        { text: 'Last Login', dataField: 'lastLogin'},
        { text: 'Scheduled Date Time', dataField: 'scheduleDateTime'},
        { text: 'Slot', dataField: 'slot'},
        { text: 'Student Count', dataField: 'studentCount'},
    ];
    return myHeader;
}

function getData(reportData)
{
    let myData = [];
    let i = 1;

    reportData.map((data, index) => 
    {
        myData.push({
            srNo                    : i++,
            userName                : data.proctor.username,
            lastLogin               : data.lastLogin!==null && data.lastLogin!==undefined ? <Moment format="MMMM Do YYYY, H:mm:ss A">{data.lastLogin.starttime}</Moment> : '',
            scheduleDateTime        : data.subject.from_date!==null && data.subject.from_date!==undefined && data.subject.from_date!=='' ? <Moment format="MMMM Do YYYY, H:mm:ss A">{data.subject.from_date}</Moment> : '',
            slot                    : data.subject.slot,
            studentCount            : data.studcount 
        });
    })
    return myData;
}

export default InvigilatorDashboardReport;