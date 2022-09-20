import React,{useState,useEffect,useContext} from 'react';
import {UserContext,ShowContext} from '../../App';
import API from '../../api';
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from 'react-router-dom';

const ExamPreView = () => {
    const [examData,setExamData]    = useState();
    const {currentUser}             = useContext(UserContext);
    const {setShow,setMsg}          = useContext(ShowContext);
    const header                    =   getHeader();
    let data                        =   [];
    useEffect(()=>{
        if(currentUser)
        {
            getSubjects(currentUser,setShow,setMsg,setExamData);
        }
    },[currentUser]);

   if(examData !== undefined)
   {
        data                                      =   getData(examData);
   }

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
        currentUser && data.length > 0?
            <div>
                <div className="container-fluid">
                   <br/>
                    <ol className="breadcrumb mb-4">
                       Examination Pre-View &nbsp;&nbsp;&nbsp;&nbsp; <div style={{"color":"red"}}><b>Click on Subject Name for Examination Pre-view</b></div>
                    </ol>
                    <div className="row col-lg-12">
                        <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
                    </div>
                </div>
            </div>
        : <div className="custom-loader"></div>
    );
};

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Paper Code', dataField: 'paperCode',filter: textFilter()},
        { text: 'Paper Name', dataField: 'paperName'},
    ];
    return myHeader;
}

function getData(examData)
{
    let myData = [];
    let i = 1;
    examData.map((data, index) => 
    {
        let myData1 = {
            index:0,
            instId:data.instId,
            paperCode:data.paper_code,
            paperName:data.paper_name,
            questions:data.quest
        };

        myData.push({
            srno                    : i++,
            paperCode               : data.paper_code,
            paperName               : <Link to={{pathname: "/startExamPreview",state:myData1}}>{data.paper_name}</Link>,
        });
    })

    return myData;
}

async function getSubjects(currentUser,setShow,setMsg,setExamData)
{
    let params = {};
    if(currentUser.role === 'EADMIN')
    {
        params ={params: {"type":"byInstId","instId":currentUser.username,"mode":''}};
    }
    else if(currentUser.role === 'ADMIN' && currentUser.username !=='admin')
    {
        params ={params: {"type":"byInstId","instId":currentUser.inst_id,"mode":''}};
    }
    else if(currentUser.role === 'ADMIN' && currentUser.username === 'admin')
    {
        params ={params: {"type":"all","mode":''}};
    }


    await API.get('/subject',params)
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
                setExamData(res.data.data);
            }
            else
            {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

export default ExamPreView;