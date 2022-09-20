import React, { useState, useEffect, useContext } from 'react';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import API from '../../../api';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import Moment from 'react-moment';

const SubAnsNotSolvedReport = () => {
    const [subjects, setSubjects] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [reportData,setReportData] = useState();
    let header                              =   [];
    let data                                =   [];

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

    useEffect(() => {
        if (currentUser) {
            getSubjects(setSubjects, setShow, setMsg);
        }
    }, [currentUser]);

    if(reportData !== undefined)
    {
        header  = getHeader();
        data = getData(reportData);
    }

    return (
        subjects !== undefined ?
        <div>
            <div className="container-fluid">
                <h1 className="mt-4">Subjective Answers Not Solved Report</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Subjective Answers Not Solved Report</li>
                </ol>
                <div className="row col-lg-12">
                    <select id="paperId" name="paperId" onChange={async (e) => {
                        await getReportData(e.target.value,setShow, setMsg,setReportData);
                    }} className="form-control">
                        <option value="">Select Subject</option>
                        {subjects.map((subject, index) => {
                            return <option key={index} value={subject.id}>{subject.paper_code + '-' + subject.paper_name}</option>
                        })}
                    </select>
                </div>
                <div className="row col-lg-12" style={{"marginTop":"20px"}}>
                    {
                        reportData !== undefined && reportData.length > 0 ?
                            <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
                        :null
                    }
                </div>
            </div>
        </div>
        :null
    );
};

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Student Enroll No', dataField: 'enrollno',filter: textFilter()},
        { text: 'Student Name', dataField: 'name',filter: textFilter()},
        { text: 'Subject Name', dataField: 'subname'},
        { text: 'Exam Date', dataField: 'examDate'},
        { text: 'Total Subjective Questions', dataField: 'total'},
        { text: 'Unsolved Subjective Questions', dataField: 'unsolved'},
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
            srno                    : i++,
            enrollno                : data.stdid.username,
            name                    : data.stdid.name,
            subname                 : data.paper.paper_code+'-'+data.paper.paper_name,
            examDate                : <Moment format="MMMM Do YYYY, H:mm:ss A">{data.paper.from_date}</Moment>,
            total                   : <center>{data.totalSubjectiveQuestions}</center>,
            unsolved                : <center>{data.unansweredSubjectiveQuestionCount}</center>
        });
    })

    return myData;
}

async function getReportData(paperId,setShow, setMsg,setReportData)
{
    await API.get('/subject/unAnsweredCount/'+paperId)
        .then((res) => {
            if (res.data.status === 'success') {
                setReportData(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

async function getSubjects(setSubjects, setMsg, setShow) {
    await API.get('/subject', { params: { "type": "all" } })
        .then((res) => {
            if (res.data.status === 'success') {
                setSubjects(res.data.data);
            }
            else {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

export default SubAnsNotSolvedReport;