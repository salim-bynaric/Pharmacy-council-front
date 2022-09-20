import React,{useState,useEffect,useContext, useRef} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import Pagination from 'react-js-pagination';
import CustomSearch from '../../../CustomSearch';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DeleteConfirmationPopUp from '../../../DeleteConfirmationPopUp';

const StudProctorAllocList = (props) => 
{
    const {currentUser}                             =   useContext(UserContext);
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let [loading, setLoading]                       =   useState(true);
    let [studentList, setStudentList]               =   useState([]);
    const header                                    =   getHeader();
    const handleClose                               =   ()    => setClearAlloc(false);
    const handleShow                                =   ()    => setClearAlloc(true);
    const [curPage,setCurPage]                      =   useState(0);
    const [perPage,setPerPage]                      =   useState(0);
    const [total,setTotal]                          =   useState(0);
    let [selected,setSelected]                      =   useState([]);
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);
    const[clearAlloc,setClearAlloc]                 =   useState(false);
    
    const ref                                       =   useRef();

    const data                                      =   getData(studentList,props.setMyList,props.myList,setShow,setMsg,curPage,perPage,visible,setVisible,setDelId);
    
    async function searchStudent(searchValue,setStudentList,setShow,setMsg)
    {
        await API.get('proctorSearch',{params: {"username":searchValue}})
        .then((res) => 
        {
            setStudentList(res.data.data);
        })
        .catch(function (error) 
        {
            setShow(true);
            setMsg(error.response.data.message);
        });
    
    }

    function handleOnSelectAll(isSelect,rows)
    {
        const ids = rows.map(r => r.id);
        if (isSelect) 
        {
            setSelected(ids);
        } 
        else 
        {
            setSelected([]);
        } 
    }

    function handleOnSelect(row, isSelect)
    {
        if (isSelect) 
        {
            setSelected([...selected,row.id]);
        } 
        else 
        {
            setSelected(selected.filter(x => x !== row.id));
        }
    }

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        style: { backgroundColor: '#c8e6c9' },
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll,
      };


    useEffect(() => 
    {
        if(currentUser !== undefined)
        {
            getStudentProctorAlloc(setStudentList,setLoading,currentUser,curPage,setCurPage,setPerPage,setTotal,'all');
        }
    },[props.myList,props.paperId,currentUser]);

    return (
        studentList !== undefined && studentList.length > 0 && !loading && currentUser !== undefined ?
        <>
            <div className="col-lg-12" style={{"marginTop":"10px","marginBottom":"20px"}}>
                <CustomSearch searchParam={['student_enrollment_number_or_proctors_email']} searchMethod={searchStudent} dataSetter={setStudentList}/>
            </div>
            <div className="col-lg-12" style={{overflow:"auto"}}>
                <BootstrapTable ref={ref} keyField='srno' data={ data } columns={ header } selectRow={ selectRow } />
                {visible ?
                    <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Allocation ?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
                :null}
            </div>
            <div className="col-lg-12 row">
                <div className="col-lg-6">
                    
                        <Pagination 
                            totalItemsCount={total}
                            activePage={curPage}
                            itemsCountPerPage={perPage}
                            onChange={(pageNumber) =>{
                                getStudentProctorAlloc(setStudentList,setLoading,currentUser,pageNumber,setCurPage,setPerPage,setTotal,'all');
                            }}
                            itemClass="page-item"
                            linkClass="page-link"
                            firstPageText="First"
                            lastPageText="Last"
                        />
                
                </div>
                <div className="col-lg-6">
                    {props.bulkDelete ?
                    <button type="button" className="btn btn-sm btn-primary" onClick={() =>{   
                        if(selected.length === 0)
                        {
                            setShow(true);
                            setMsg('Please Select Rows from List for deletion...');
                            return false;
                        }               
                        setClearAlloc(true);       
                    }}>Bulk Delete Allocations
                    </button>
                    :null}
                </div>
                <Modal show={clearAlloc} onHide={handleClose} size="lg" backdrop="static">
                    <Modal.Header style={{backgroundColor:"OliveDrab",color:"white"}}>
                        <Modal.Title><center>Delete Student Proctor Allocation Confirmation !!!</center></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <b>Do you really want to Delete this allocation?</b>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button variant="success" onClick={async () => {clearAllocation(selected,currentUser,setShow,setMsg,props.setMyList,props.myList,setClearAlloc,ref);}}>Yes</Button>
                            <Button variant="danger" onClick={handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
        :   
        null
    );
};

async function clearAllocation(selected,currentUser,setShow,setMsg,setMyList,myList,setClearAlloc,ref)
{
    let params = null;
    if(currentUser.role === 'EADMIN')
    {
        params = {data:{'students':selected}};
    }
    
    await API.delete('/bulkProctor/allocation/',params)
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
            setClearAlloc(false);
            setShow(true);
            setMsg(res.data.message);
            setMyList(!myList);
            ref.current.selectionContext.selected = [];
        }
    })
    .catch(function (error) 
    {
        setClearAlloc(false);
        setShow(true);
        setMsg(error.response.data.message);
    });
}

async function getStudentProctorAlloc(setStudentList,setLoading,currentUser,page=1,setCurPage,setPerPage,setTotal,paperId)
{
    let params = {};
    if(currentUser.role === 'EADMIN')
    {
        if(paperId !=='' && paperId !== undefined && paperId !== null)
        {
            params = {params:{'paperId':paperId,'inst':currentUser.username,"page":page}}
        }
        else if(paperId ==='' || paperId === undefined || paperId === null)
        {
            params = {params:{'paperId':paperId,'inst':currentUser.username,"page":page}}
        }
    }

    await API.get('/proctorAllocation',params)
    .then(function (res) 
    {
        setStudentList(res.data.data);
        setCurPage(res.data.meta.current_page);
        setPerPage(res.data.meta.per_page);
        setTotal(res.data.meta.total);
       
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
        { text: 'Id', dataField: 'id'},
        { text: 'Proctor', dataField: 'proctor'},
        { text: 'Enrollno', dataField: 'enrollno'},
        { text: 'Student', dataField: 'student'},
        { text: 'Subject', dataField: 'subject'},
        { text: 'Date', dataField: 'date'},
        { text: 'Slot', dataField: 'slot'},
        { text: 'Delete', dataField: 'delete'},
    ];
    return myHeader;
}

function getData(studentList,setMyList,myList,setShow,setMsg,curPage,perPage,visible,setVisible,setDelId)
{
    let myData = [];
    let i = (curPage-1)*perPage+1;
    if(studentList !== undefined && studentList !== null && studentList.length > 0)
    {
        studentList.map((data, index) => 
        {
            myData.push({
                srno                    : i++,
                id                      : data.id,
                proctor                 : data.proctor !== null ? data.proctor.name : '',
                enrollno                : data.student !== null ? data.student.username : '',
                student                 : data.student !== null ? data.student.name : '',
                subject                 : data.subject !== null ?data.subject.paper_code+'-'+data.subject.paper_name : '',  
                date                    : data.date,
                slot                    : data.slot,
                delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.id);}}>Delete</button>
            });
        })
    }

    return myData;
}


async function deleteRecord(uid,setMyList,myList,setShow,setMsg)
{
    await API.delete('/proctorAllocation/'+uid)
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
        setMsg('Problem Deleting Data...');
        setTimeout(()=>{setShow(false)}, 10000);
    });
}


export default StudProctorAllocList;