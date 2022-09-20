import React,{useState,useEffect,useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import Pagination from 'react-js-pagination';
import CustomSearch from '../../../CustomSearch';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const StudentList = (props) => 
{
    const {currentUser }                            =   useContext(UserContext);
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let [loading, setLoading]                       =   useState(true);
    let [studentList, setStudentList]               =   useState([]);
    const header                                    =   getHeader();
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);

    const [curPage,setCurPage]                      =   useState(0);
    const [perPage,setPerPage]                      =   useState(0);
    const [total,setTotal]                          =   useState(0);

    const data                                      =   getData(studentList,props.setMyList,props.myList,setShow,setMsg,props.edit,props.setEdit,props.setEditData,curPage,perPage,visible,setVisible,setDelId);
    

    useEffect(() => 
    {
        getStudents(setStudentList,setLoading,currentUser,curPage,setCurPage,setPerPage,setTotal);
    },[props.myList]);

    return (
        studentList.length > 0 && !loading && currentUser !== undefined ?
        <>
            <div className="col-lg-12" style={{"marginTop":"10px","marginBottom":"20px"}}>
                <CustomSearch searchParam={['enrollment_number']} searchMethod={searchStudent} dataSetter={setStudentList} currentUser={currentUser}/>
            </div>
            <div className="col-lg-12" style={{overflow:"auto"}}>
                <BootstrapTable keyField='srno' data={ data } columns={ header }/>
                {visible ?
                    <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Student ?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
                :null}
            </div>
            <div className="mt-3">
                    <Pagination 
                        totalItemsCount={total}
                        activePage={curPage}
                        itemsCountPerPage={perPage}
                        onChange={(pageNumber) =>{
                            getStudents(setStudentList,setLoading,currentUser,pageNumber,setCurPage,setPerPage,setTotal);
                        }}
                        itemClass="page-item"
                        linkClass="page-link"
                        firstPageText="First"
                        lastPageText="Last"
                    />
                </div>
        </>
        :   
        null
    );
};

async function getStudents(setStudentList,setLoading,currentUser,page=1,setCurPage,setPerPage,setTotal)
{
    let params = {};
    if(currentUser && currentUser.role === 'ADMIN' )
    {
        params = {'role':'STUDENT',"page":page}
    }
    else if(currentUser && currentUser.role === 'EADMIN')
    {
        params = {'role':'STUDENT','instId':currentUser.username,"page":page}
    }

    await API.get('/user', {params: params})
    .then(function (res) 
    {
        setStudentList(res.data.data);
        setCurPage(res.data.current_page);
        setPerPage(res.data.per_page);
        setTotal(res.data.total);
       
        setLoading(false);
    })
    .catch(function (error) 
    {
        setStudentList([]);
        setLoading(false);
    });   
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Inst Id', dataField: 'instid'},
        { text: 'Course Code', dataField: 'courseCode'},
        { text: 'Enrollment No', dataField: 'enrollno'},
        { text: 'Student Name', dataField: 'studname'},
        { text: 'Semester', dataField: 'semester'},
        { text: 'Mobile No', dataField: 'mobile'},
        { text: 'Edit', dataField: 'edit'},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(studentList,setMyList,myList,setShow,setMsg,edit,setEdit,setEditData,curPage,perPage,visible,setVisible,setDelId)
{
    let myData = [];
    let i = (curPage-1)*perPage+1;
    studentList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            instid                  : data.inst_id,
            courseCode              : data.course_code,
            enrollno                : data.username,
            studname                : data.name,
            semester                : data.semester,
            mobile                  : data.mobile,
            edit                    : <button className="btn btn-warning" onClick={()=>{editRecord(data,setEdit,setEditData);}}>Edit</button>,
            delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.uid);}}>Delete</button>
        });
    })

    return myData;
}

function editRecord(data,setEdit,setEditData)
{
    setEdit(true);
    setEditData(data);
}

async function deleteRecord(uid,setMyList,myList,setShow,setMsg)
{
    await API.delete('/user/'+uid,{data:{'type':'student'}})
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

async function searchStudent(searchValue,setStudentList,setShow,setMsg,currentUser)
{
    let instId ='';
    if(currentUser.role === 'EADMIN')
    {
        instId = currentUser.username;
    }
        await API.get('user/',{params: {"username":searchValue,"role":"STUDENT","instId":instId}})
        .then((res) => 
        {
            if(res.data.data.length === 0)
            {
                setShow(true);
                setMsg('Student Not Found ...');
            }
            else
            {
                setStudentList(res.data.data);
            }
        })
        .catch(function (error) 
        {
            setShow(true);
            setMsg('Student Not Found ...');
        });
}

export default StudentList;