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

const StudCheckerAllocList = (props) => 
{
    const {currentUser}                             =   useContext(UserContext);
    const {setShow,setMsg}                          =   useContext(ShowContext);
    let [loading, setLoading]                       =   useState(true);
    let [studentList, setStudentList]               =   useState([]);
    
    const handleClose                               =   ()    => setClearAlloc(false);
    const handleShow                                =   ()    => setClearAlloc(true);
    const [curPage,setCurPage]                      =   useState(0);
    const [perPage,setPerPage]                      =   useState(0);
    const [total,setTotal]                          =   useState(0);
    let [selected,setSelected]                      =   useState([]);
    const[clearAlloc,setClearAlloc]                 =   useState(false);
    const [delId,setDelId]                          =   useState();
    const [visible, setVisible]                     =   useState(false);
    const [role,setRole]                            =   useState('');
    const header                                    =   getHeader();
    const ref                                       =   useRef();

    const data                                      =   getData(studentList,props.setMyList,props.myList,setShow,setMsg,curPage,perPage,visible,setVisible,setDelId);
    
    async function searchStudent(searchValue,setStudentList,setShow,setMsg)
    {
        await API.get('checker/search',{params: {"username":searchValue}})
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
            setSelected(selected.filter(x => x !== row.enrollno));
        }
    }

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        style: { backgroundColor: '#c8e6c9' },
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll,
      };

    useEffect(()=> {
        if(props !== null && props !== undefined)
        {
            setRole(props.type);
        }
    },[props.type])

    useEffect(() => 
    {
        if(currentUser !== undefined)
        {
            getStudentCheckerAlloc(setStudentList,setLoading,currentUser,curPage,setCurPage,setPerPage,setTotal,props.paperId,role);
        }
    },[props.myList,props.paperId,currentUser,role]);

    return (
        studentList !== undefined && studentList.length > 0 && !loading && currentUser !== undefined ?
        <>
            <div className="col-lg-12 row" style={{"marginTop":"10px","marginBottom":"20px"}}>
                <div className="col-lg-6">
                    <CustomSearch searchParam={['student_enrollment_number_or_checker_email']} searchMethod={searchStudent} dataSetter={setStudentList}/>
                </div>
                <div className="col-lg-6">
                    <select id="type" name="type" className="form-control" onChange={async (e) =>{
                        setRole(e.target.value);
                        await getStudentCheckerAlloc(setStudentList,setLoading,currentUser,curPage,setCurPage,setPerPage,setTotal,props.paperId,e.target.value);
                    }} value={role}>
                        <option value="">Select Role</option>
                        <option value="QPC">Paper Checker</option>
                        <option value="QPM">Paper Moderator</option>
                    </select>
                </div>
            </div>
            <div className="col-lg-12" style={{overflow:"auto"}}>
                <BootstrapTable ref={ref} keyField='srno' data={ data } columns={ header } selectRow={ selectRow } />
                {visible ?
                    <DeleteConfirmationPopUp visible={visible} setVisible={setVisible} popupMsg={"Do you really want to delete this Allocation?"} deleteRecord={deleteRecord} id={delId} setInserted={props.setMyList} inserted={props.myList} setShow={setShow} setMsg={setMsg} setCurPage={1}/>
                :null}
            </div>
            <div className="col-lg-12 row">
                <div className="col-lg-6">
                    
                        <Pagination 
                            totalItemsCount={total}
                            activePage={curPage}
                            itemsCountPerPage={perPage}
                            onChange={(pageNumber) =>{
                                getStudentCheckerAlloc(setStudentList,setLoading,currentUser,pageNumber,setCurPage,setPerPage,setTotal,props.paperId,role);
                            }}
                            itemClass="page-item"
                            linkClass="page-link"
                            firstPageText="First"
                            lastPageText="Last"
                        />
                
                </div>
                <div className="col-lg-6">
                    <button type="button" className="btn btn-sm btn-primary" onClick={() =>{
                                if(selected.length === 0)
                                {
                                    setShow(true);
                                    setMsg('Please Select Rows from List for deletion...');
                                    return false;
                                }
                                setClearAlloc(true);
                            }}>Bulk Delete Allocation
                    </button>
                </div>

                <Modal show={clearAlloc} onHide={handleClose} size="lg" backdrop="static">
                    <Modal.Header style={{backgroundColor:"OliveDrab",color:"white"}}>
                        <Modal.Title><center>Delete Student Checker Allocation Confirmation !!!</center></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <b>Do you really want to Delete this allocation?</b>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button variant="success" onClick={async () => {clearAllocation(selected,currentUser,setShow,setMsg,props.setMyList,props.myList,setClearAlloc,setCurPage,ref);}}>Yes</Button>
                            <Button variant="danger" onClick={handleClose}>No</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
        :   
        null
    );
};

async function clearAllocation(selected,currentUser,setShow,setMsg,setMyList,myList,setClearAlloc,setCurPage,ref)
{
    let params = null;
    if(currentUser.role === 'EADMIN')
    {
        params = {data:{'students':selected}};
    }
    
    await API.delete('/bulk/checker/allocation/',params)
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
            setShow(true);
            setMsg(res.data.message);
            setCurPage(1);
            setMyList(!myList);
            setClearAlloc(false);
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

async function getStudentCheckerAlloc(setStudentList,setLoading,currentUser,page=1,setCurPage,setPerPage,setTotal,paperId,role)
{
    let params = {};
    if(currentUser.role === 'EADMIN')
    {
        if(paperId !=='' && paperId !== undefined && paperId !== null)
        {
            params = {params:{'paperId':paperId,'type':'byPaperId','inst':currentUser.username,"page":page,"role":role}}
        }
        else if(paperId ==='' || paperId === undefined || paperId === null)
        {
            paperId = 'all';
            params = {params:{'paperId':paperId,'type':'byPaperId','inst':currentUser.username,"page":page,"role":role}}
        }
    }

    await API.get('/checker/allocation',params)
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
        { text: 'Paper Checker', dataField: 'checker'},
        { text: 'Role', dataField: 'role'},
        { text: 'Enrollno', dataField: 'enrollno'},
        { text: 'Student', dataField: 'student'},
        { text: 'Subject', dataField: 'subject'},
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
            let type = '';
            if(data.type === 'QPC')
            {
                type = 'Paper Checker';
            }
            else if(data.type ==='QPM')
            {
                type = 'Paper Moderator';
            }
            myData.push({
                srno                    : i++,
                id                      : data.id,
                checker                 : data.checker.name+'('+data.checker.username+')',
                role                    : type,
                enrollno                : data.student !== null ? data.student.username : '',
                student                 : data.student !== null ? data.student.name : '',
                subject                 : data.subject.paper_code+'-'+data.subject.paper_name,
                delete                  : <button className="btn btn-danger" onClick={()=>{setVisible(true);setDelId(data.id);}}>Delete</button>
            });
        })
    }
    return myData;
}


async function deleteRecord(uid,setMyList,myList,setShow,setMsg)
{
    await API.delete('/checker/allocation/'+uid)
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


export default StudCheckerAllocList;