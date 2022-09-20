import React,{useState,useEffect,useContext} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import Pagination from 'react-js-pagination';
import CustomSearch from '../../../CustomSearch';
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const StudentSubjectList = (props) => 
{
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let [loading, setLoading]                       =   useState(true);
    let [studentList, setStudentList]               =   useState([]);
    const header                                    =   getHeader();
    
    const {currentUser }                            =   useContext(UserContext);
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);

    const [curPage,setCurPage]                      =   useState(0);
    const [perPage,setPerPage]                      =   useState(0);
    const [total,setTotal]                          =   useState(0);
    const data                                      =   getData(studentList,props.setMyList,props.myList,setShow,setMsg,curPage,perPage,visible,setVisible,setDelId);

    useEffect(() => 
    {
        getStudentSubjects(setStudentList,setLoading,currentUser,curPage,setCurPage,setPerPage,setTotal);
    },[props.myList]);

    return (
        studentList.length > 0 && !loading ?
        <>
            <div className="col-lg-12" style={{"marginTop":"10px","marginBottom":"20px"}}>
                <CustomSearch searchParam={['enrollment_number']} searchMethod={searchAllocation} dataSetter={setStudentList}/>
            </div>
            <div className="col-lg-12" style={{overflow:"auto"}}>
                <BootstrapTable keyField='srno' data={ data } columns={ header } />
                {visible ?
                    <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Student Subject Allocation ?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
                :null}
            </div>
            <div className="mt-3">
                    <Pagination 
                        totalItemsCount={total}
                        activePage={curPage}
                        itemsCountPerPage={perPage}
                        onChange={(pageNumber) =>{
                            getStudentSubjects(setStudentList,setLoading,currentUser,pageNumber,setCurPage,setPerPage,setTotal);
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

async function searchAllocation(searchValue,setStudentList,setShow,setMsg)
{
    await API.get('exam/',{params: {"type":"byEnrollno","enrollno":searchValue}})
    .then((res) => 
    {
        setStudentList(res.data.data);
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Student Subject Allocation Not Found ...');
    });
}

async function getStudentSubjects(setStudentList,setLoading,currentUser,page=1,setCurPage,setPerPage,setTotal)
{
    let params = {};

    if(currentUser && currentUser.role === 'ADMIN')
    {
        await API.get('/exam')
        .then(function (res) 
        {
            if(res.data.status === 'success')
            {
                setStudentList(res.data.data);
            }
            else
            {
                setStudentList([]);
            }
            setLoading(false);
        })
        .catch(function (error) 
        {
            setStudentList([]);
            setLoading(false);
        });   
    }
    else if(currentUser && currentUser.role === 'EADMIN')
    {
        params = {'instId':currentUser.username,"page":page};
        await API.get('/exam',{params:params})
        .then(function (res) 
        {
            if(res.data.status === 'success')
            {
                setStudentList(res.data.data);
                setCurPage(res.data.meta.current_page);
                setPerPage(res.data.meta.per_page);
                setTotal(res.data.meta.total);
            }
            else
            {
                setStudentList([]);
            }
            setLoading(false);
        })
        .catch(function (error) 
        {
            setStudentList([]);
            setLoading(false);
        });   
    }
}

function getHeader()
{
    let myHeader = [
        { text: 'Sr No', dataField: 'srno'},
        { text: 'Enrollment No', dataField: 'enrollno'},
        { text: 'Student Name', dataField: 'studname'},
        { text: 'Inst Id', dataField: 'instid'},
        { text: 'Semester', dataField: 'semester'},
        { text: 'Program', dataField: 'program'},
        { text: 'Subject', dataField: 'subject'},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(studentList,setMyList,myList,setShow,setMsg,curPage,perPage,visible,setVisible,setDelId)
{
    let myData = [];
    let i = (curPage-1)*perPage+1;
    studentList.map((data, index) => 
    {
        myData.push({
            srno                    : i++,
            enrollno                : data.stdid !== undefined && data.stdid !== null ? data.stdid.username : '',
            studname                : data.stdid !== undefined && data.stdid !== null ? data.stdid.name : '',
            instid                  : data.stdid !== undefined && data.stdid !== null ? data.stdid.inst_id : '',
            semester                : data.stdid !== undefined && data.stdid !== null ? data.stdid.semester : '',
            program                 : data.paper ? data.paper.program.program_code : '',
            subject                 : data.paper ? '('+data.paper.paper_code+') '+data.paper.paper_name : '',
            delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.id);}}>Delete</button>
        });
    })

    return myData;
}

async function deleteRecord(id,setMyList,myList,setShow,setMsg)
{
    await API.delete('/exam/'+id)
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

export default StudentSubjectList;