import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../api';
import { ShowContext, UserContext } from '../../../App';
import { Formik } from 'formik';
import DateTimePicker from 'react-datetime-picker';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const rowStyle = (row, rowIndex) => {
    if (row.srno === '') {
        return { backgroundColor: 'aqua' };
    }
};

function DashboardReportAdmin(props) {
    const { currentUser } = useContext(UserContext);
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

    const [examDate, onExamDateChange] = useState(new Date());
    const { setShow, setMsg } = useContext(ShowContext);
    const [allData, setAllData] = useState([]);
    const myInitialValues = { examDate: examDate, slot: '' };

    useEffect(() => {
        if (currentUser) {
            getAllDashboardReportData(setAllData, setShow, setMsg);
        }
    }, [currentUser])


    let header = getHeader();
    let data = getData(allData, currentUser);

    return (
        <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                const date = examDate;
                let date1 = date ? date.toISOString().slice(0, 10) : '';
                const slot = values.slot;

                getDashboardReportData(date1, slot, setAllData, setShow, setMsg, currentUser)
            }}
        >
            {
                props => {
                    const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    } = props;

                    return (
                        currentUser ?
                            <div>
                                <div className="container-fluid" style={{ "marginTop": "10px" }}>
                                    <br/>
                                    <ol className="breadcrumb mb-4">
                                        <li className="breadcrumb-item active">Admin Dashboard Report</li>
                                    </ol>
                                    <div className="col-lg-12 animate__animated animate__fadeInDown animate_slower">
                                        <div className="card mb-4">
                                            <div className="card-header">
                                                <i className="fas fa-address-card mr-1" />
                                                Report Filter
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="card-body row">
                                                    <div className="form-group col-lg-4">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Date
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <DateTimePicker onChange={onExamDateChange} value={examDate} id="examDate" name="examDate" className="form-control" format="yyyy-MM-dd" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <div className="col-lg-12 row">
                                                            <div className="col-lg-4">
                                                                Slot
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <select id="slot" name="slot" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.slot}>
                                                                    <option value="all">Select Slot</option>
                                                                    <option value="1">Slot 1</option>
                                                                    <option value="2">Slot 2</option>
                                                                    <option value="3">Slot 3</option>
                                                                    <option value="4">Slot 4</option>
                                                                    <option value="5">Slot 5</option>
                                                                    <option value="6">Slot 6</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <center>
                                                        <button className="btn btn-sm btn-primary" type="submit" id="submit" disabled={isSubmitting}>Get Report</button>
                                                    </center>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-lg-12">
                                            {allData && allData.length > 0 ?
                                                <BootstrapTable keyField='srno' data={data} columns={header} filter={filterFactory()} pagination={paginationFactory(options)} rowStyle={rowStyle} />
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null
                    );
                }
            }
        </Formik>
    );
}

async function getAllDashboardReportData(setAllData, setShow, setMsg) {
    await API.get('exam/dashboardreport/countDateInstWise')
        .then((res) => {
            if (res.data.status === 'success') {
                setAllData(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Data not found...');
            }
        });
}

async function getDashboardReportData(date, slot, setAllData, setShow, setMsg) {
    await API.get('exam/dashboardreport/countDateInstWise', { params: { "date": date, "slot": slot } })
        .then((res) => {
            if (res.data.status === 'success') {
                setAllData(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Data not found...');
            }
        });
}

function getHeader() {
    let myHeader = [
        { text: 'Sr No', dataField: 'srno' },
        { text: 'Date', dataField: 'date' },
        { text: 'Institute Code', dataField: 'instcode', filter: textFilter() },
        { text: 'Institute Name', dataField: 'instname', filter: textFilter() },
        { text: 'Total Students', dataField: 'total' },
        { text: 'Total In Progress', dataField: 'inprogress', style: { backgroundColor: 'yellow' } },
        { text: 'Total End', dataField: 'end', style: { backgroundColor: '#90ee90' } },
        { text: 'Total Not Started', dataField: 'notstarted', style: { backgroundColor: 'red' } },
    ];
    return myHeader;
}

function getData(allData, currentUser) {
    if (currentUser) 
    {
        let myData = [];
        let i = 1;
        let totalStud = 0;
        let totalEnd = 0;
        let totalInProgress = 0;
        let totalNotAttend = 0;

        allData.map((data, index) => {
            totalStud = totalStud + data.allStudents;
            totalEnd = totalEnd + data.overStudents;
            totalInProgress = totalInProgress + data.inprogressStudents;
            totalNotAttend = totalNotAttend + data.unattendStudents;

            myData.push({
                srno: i++,
                date: <Link to={{ pathname: '/instexamreport', state: { 'date': data.date, 'instId': data.instCode,'role':currentUser.role } }}>{data.date}</Link>,
                instcode: data.instCode,
                instname: data.instName,
                total: data.allStudents,
                inprogress: data.inprogressStudents,
                end: data.overStudents,
                notstarted: data.unattendStudents,
            });
        });

        myData.push({
            srno: 'Total',
            instcode: '',
            instname: '',
            total: totalStud,
            inprogress: totalInProgress,
            end: totalEnd,
            notstarted: totalNotAttend,
        });

        return myData;
    }
}

export default DashboardReportAdmin;
