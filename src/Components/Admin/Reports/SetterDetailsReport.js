import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const SetterDetailsReport = (props) => {
    const [myMsg, setMyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const myInitialValues = { programId: '' };
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [programs, setPrograms] = useState();
    const [setterData, setSetterData] = useState();
    const header = getHeader();
    let data = [];

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


    if(setterData !== undefined)
    {
        data= getData(setterData);
    }

    useEffect(() => {
        if (currentUser) {
            getPrograms(currentUser, setShow, setMsg, setPrograms);
        }
    }, [setShow, setMsg, currentUser]);

    return (
        !loading && currentUser && programs !== undefined ? <Formik
            initialValues={myInitialValues}
            onSubmit={async (values, actions) => {
                setMyMsg('');
                await getSetterData(values, setSetterData, setShow, setMsg);
                actions.setSubmitting(false);
            }}
            validationSchema={Yup.object({
                programId: Yup.string()
                    .required("Program is Required"),
            })}
        >
            {
                props => {
                    const {
                        values,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    } = props;
                    return (
                        <div className="col-xl-12">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1" />
                                        Select Filter
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Program
                                                </div>
                                                <div className="col-lg-8">
                                                    <select id="programId" name="programId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.programId}>
                                                        <option value="">Select Program</option>
                                                        {
                                                            programs.map(program =>
                                                            (
                                                                <option key={program.id} value={program.id}>
                                                                    {program.program_code}-{program.program_name}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>

                                                    {errors.programId ? <div className="alert alert-info">{errors.programId}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="form-group">
                                            <center>
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
                                            </center>
                                        </div>


                                        {loading && (
                                            <div className="custom-loader"></div>
                                        )}
                                    </div>
                                </div>
                                {
                                    setterData !== undefined ?
                                        <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
                                    : null
                                }

                            </form>
                        </div>
                    );
                }
            }
        </Formik>
            : null
    );
};

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Setter Name', dataField: 'setterName'},
        { text: 'Setter User Name', dataField: 'setterUserName',filter: textFilter()},
        { text: 'Subject Code', dataField: 'subjectCode',filter: textFilter()},
        { text: 'Subject Name', dataField: 'subjectName'},
        { text: 'Setter Password', dataField: 'setterPassword'},
    ];
    return myHeader;
}

function getData(setterData)
{
    let myData = [];
    let i = 1;

    setterData.map((data, index) => 
    {
        myData.push({
            srno                        : i++,
            setterName                  : data.paperSetter.name,
            setterUserName              : data.paperSetter.username,
            subjectCode                 : data.subject.paper_code,
            subjectName                 : data.subject.paper_name,
            setterPassword              : data.paperSetter.password,
        });
    })

    return myData;
}


async function getPrograms(currentUser, setShow, setMsg, setPrograms) {
    let instId = 0;
    if (currentUser.role === 'EADMIN') {
        instId = currentUser.username;
    }
    else if (currentUser.role === 'ADMIN' && currentUser.username !== 'admin') {
        instId = currentUser.inst_id;
    }

    await API.get('/program', { params: { "type": "instId", "instId": instId } })
        .then((res) => {
            if (res.data.status === 'success') {
                setPrograms(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function getSetterData(values, setSetterData, setShow, setMsg) {
    let programId = values.programId;
    await API.get('/program/subject/setter/' + programId)
        .then((res) => {
            if (res.data.status === 'success') {
                setSetterData(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        })
        .catch(function (error) {
            setShow(true);
            setMsg(error.response.data.message);
        });
}

export default SetterDetailsReport;