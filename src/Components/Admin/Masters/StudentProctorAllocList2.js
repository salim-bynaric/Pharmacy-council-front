import React,{useState,useEffect,useContext} from 'react';
import {ShowContext,UserContext} from '../../../App';
import API from '../../../api';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const StudentProctorAllocList2 = (props) => 
{
    const [listData,setListData] =   useState();
    const {currentUser}          =   useContext(UserContext);
    const {setShow,setMsg}       =   useContext(ShowContext);

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

    useEffect(() => 
    {
        if(currentUser)
        {
            getStudentProctorAllocList(currentUser,setShow,setMsg,setListData);
        }
    },[props.myList,currentUser]);

    const header                                    =   getHeader();
    let data                                        =   [];
    if(listData !== undefined)
    {
        data = getData(listData);
    }

    return (
        <div style={{"marginTop":"68px"}}>
            {
                listData !== undefined ?
                    <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
                :null
            }
        </div>
    );
};

function getData(listData)
{
    let myData = [];
    let i = 1;
    if(listData !== undefined && listData !== null && listData.length > 0)
    {
        listData.map((data, index) => 
        {
            myData.push({
                srno                    : i++,
                proctor                 : data.proctor !== null ? data.proctor : '', 
                date                    : data.date,
                day                     : data.day,
                slot                    : data.slot,
                studAlloc               : data.count
            });
        })
    }
    return myData;
}


function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Proctor', dataField: 'proctor',filter: textFilter()},
        { text: 'Date', dataField: 'date'},
        { text: 'Day', dataField: 'day'},
        { text: 'Slot', dataField: 'slot'},
        { text: 'Allocated Students', dataField: 'studAlloc'},
    ];
    return myHeader;
}

async function getStudentProctorAllocList(currentUser,setShow,setMsg,setListData)
{
    await API.get('/report/studentProctorAllocList2/',{params:{'instId':currentUser.inst_id}})
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
            setListData(res.data.data);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Fetching Report from Server...');   
    });
}

export default StudentProctorAllocList2;