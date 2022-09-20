import React, {useState,useEffect,useContext} from 'react';
import { ShowContext } from '../../../App';
import { UserContext } from '../../../App';
import API from '../../../api';
import filterFactory, { textFilter,selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import Moment from 'react-moment';

const ModeratorCountReport = () => 
{
    const [checkerData,setCheckerData] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    let header                              =   [];
    let data                                =   [];

    const selectOptions = {
        InComplete: 'InComplete',
        Complete: 'Complete'
      };

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
        if(currentUser)
        {
            getCheckerData(setCheckerData,setShow,setMsg);
        }
    },[currentUser]);
    
    if(checkerData !== undefined && checkerData.length > 0)
    {
        header  = getHeader(selectOptions);
        data    = getData(checkerData);
    }

    return (
        <div>
            <div className="container-fluid">
                <h1 className="mt-4">Moderator Count Report</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Moderator Count Report</li>
                </ol>
                <div className="row col-lg-12">
                    {checkerData !== undefined && checkerData.length > 0 ?
                        <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
                    :<div className="custom-loader"></div>}
                </div>
            </div>
        </div>
    );
};

function getHeader(selectOptions)
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Checker Name', dataField: 'checkerName',filter: textFilter()},
        { text: 'Checker Email', dataField: 'checkerEmail'},
        { text: 'Subject',dataField: 'subject',filter: textFilter()},
        { text: 'Exam Date',dataField: 'examDate'},
        { text: 'Total Allocated Students', dataField: 'total'},
        { text: 'Checking Status', dataField: 'status',filter: selectFilter({options: selectOptions})},
        { text: 'Checked / Unchecked Count', dataField: 'count'},
    ];
    return myHeader;
}

function getData(checkerData)
{
    let myData = [];
    let i = 1;
    checkerData.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            checkerName             : data.checker.name,
            checkerEmail            : data.checker.username,
            subject                 : data.subject.paper_code+'-'+data.subject.paper_name,
            examDate                : <Moment format="MMMM Do YYYY, H:mm:ss A">{data.subject.from_date}</Moment>,
            total                   : data.TotalStudents,
            status                  : data.checkingStatus === 0 ? 'InComplete' : 'Complete',
            count                   : data.count,  
        });
    })

    return myData;
}

async function getCheckerData(setCheckerData,setShow,setMsg)
{
    await API.get('/checker/allocation', {params:{'type':'allModerated'}})
        .then((res) => 
        {
            if (res.data.status === 'success') 
            {
               setCheckerData(res.data.data);
            }
            else 
            {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        })
        .catch(function (error) 
        {
            setShow(true);
            setMsg('Problem Fetching Data from Server');
        });
}

export default ModeratorCountReport;