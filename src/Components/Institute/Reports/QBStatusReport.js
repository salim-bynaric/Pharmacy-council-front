import React, { useState,useContext,useEffect } from 'react';
import { ShowContext, UserContext } from '../../../App';
import API from '../../../api';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const QBStatusReport = () => {
    const { setShow, setMsg } = useContext(ShowContext);
    const { currentUser } = useContext(UserContext);
    const [type, setType] = useState();
    const [qbData,setQBData] = useState();
    const header =   getHeader();
    const [data,setData] = useState();

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

    useEffect(()=>{
        if(qbData !== undefined)
        {
            getData(qbData,setData);
        }
    },[qbData])

    return (
        currentUser ?
            <div>
                <div className="container-fluid">
                    <br />
                    <ol className="breadcrumb mb-4">
                        <li>Question Bank Status Report</li>
                    </ol>
                    <div className="col-lg-12">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-address-card mr-1" />
                                Select Filter
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-4">
                                            Select Report Type
                                        </div>
                                        <div className="col-lg-8">
                                            <select id="type" name="type" className="form-control" onChange={(e) => {
                                                setType(e.target.value);
                                            }} value={type}>
                                                <option value="">Select Type</option>
                                                <option value="inprogress">Inprogress QB</option>
                                                <option value="confirmed">Confirmed QB</option>
                                                <option value="notstarted">Not Started QB</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-12">
                                        <center><button type="button" className="btn btn-primary btn-sm" onClick={()=>{
                                            getQBReport(type,setShow,setMsg,currentUser,setQBData)
                                        }}>Submit</button></center>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            {
                                data !== undefined ?
                                    <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
                                :null
                            }
                        </div>
                    </div>
                </div>
            </div>
            : null
    );
};

function getData(qbData,setData)
{
    let myData              = [];
    let i                   = 1;

    qbData.map((data, index) => 
    {
         myData.push({
                srno                    : i++,
                code                    : data.paper_code,
                subjectname             : data.paper_name
         });
    });
    setData(myData);
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Subject Code', dataField: 'code',filter: textFilter()},
        { text: 'Subject Name', dataField: 'subjectname'},
    ];
    return myHeader;
}

async function getQBReport(type,setShow,setMsg,currentUser,setQBData)
{
    API.get('/questionQBstatus',{params:{"type":type,"inst_id":currentUser.inst_id}})
      .then(function (res) {
        if(res.data.status === 'success')
        {
            setQBData(res.data.data);
        }
      })
      .catch(function (error) {
        setShow(true);
        setMsg(error.response.data.message);
      })
}

export default QBStatusReport;