import React,{useState,useEffect,useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {ShowContext} from '../../../App';

const UserList = (props) => 
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let role                                        =   props.role;
    let [loading, setLoading]                       =   useState(true);
    let [userList, setUserList]                     =   useState([]);
    const header                                    =   getHeader(userList);
    const data                                      =   getData(userList,props.setMyList,props.myList,setShow,setMsg);
    

    const options = {
        sizePerPageList: [
            {
                text: '5', value: 5
            }, 
            {
                text: '10', value: 10
            }, 
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
        getUsers(role,setUserList,setLoading);
    },[props.myList,role]);

    return (
        userList.length > 0 && !loading ?
        <div className="col-lg-12" style={{overflow:"auto"}}>
            <BootstrapTable keyField='srno' data={ data } columns={ header } filter={ filterFactory() } pagination={ paginationFactory(options) }/>
        </div>
        :   
        null
    );
};

async function getUsers(role,setUserList,setLoading)
{
    await API.get('/user', {params: {'role': role}})
    .then(function (res) 
    {
        setUserList(res.data.data);
        setLoading(false);
    })
    .catch(function (error) 
    {
        setUserList(undefined);
        setLoading(false);
    });   
}

function getHeader(userList)
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'User Name', dataField: 'username',filter: textFilter()},
        { text: 'Org', dataField: 'org',filter: textFilter()},
        { text: 'Role', dataField: 'role',filter: textFilter()},
        { text: 'Mobile', dataField: 'mobile',filter: textFilter()},
        { text: 'Email', dataField: 'email',filter: textFilter()},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(userList,setMyList,myList,setShow,setMsg)
{
    let myData = [];
    let i = 1;

    userList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            username                : data.username,
            org                     : data.college_name,
            role                    : data.role,
            mobile                  : data.mobile,
            email                   : data.email,
            delete                  : <button className="btn btn-danger" onClick={()=>{deleteRecord(data.uid,setMyList,myList,setShow,setMsg);}}>Delete</button>
        });
    })

    return myData;
}

async function deleteRecord(uid,setMyList,myList,setShow,setMsg)
{
    await API.delete('/user/'+uid)
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
            setShow(true);
            setMsg(res.data.message);
            setMyList(!myList);
            setTimeout(()=>{setShow(false)}, 10000);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg(error.response.data.message);
        setTimeout(()=>{setShow(false)}, 10000);
    });
}

export default UserList;