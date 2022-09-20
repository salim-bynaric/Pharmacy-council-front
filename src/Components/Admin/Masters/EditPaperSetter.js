import React, {useState,useEffect,useContext} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';
import Modal from "react-bootstrap/Modal";

const EditPaperSetter = (props) => {
    const openEdit                  = props.edit;
    const setEdit                   = props.setEdit;

    const handleClose               = () => props.setEdit(false);

    const {setShow,setMsg}          = useContext(ShowContext);
    const [insts,setInsts]          = useState([]);
    const {currentUser }            = useContext(UserContext);

    const id                        = props.editData.uid;
    const instId                    = props.editData.inst_id;
    const checkerName               = props.editData.name;
    const mobile                    = props.editData.mobile;
    const email                     = props.editData.email;
    const origpass                  = props.editData.origpass;

    const myInitialValues           = { instId: instId, name: checkerName, mobile:mobile,email:email };


    useEffect(() => 
    {
        if(currentUser !== undefined && currentUser !== null)
        {
            getInsts(setInsts,setShow,setMsg,currentUser);
        }
       
    },[setShow,setMsg,currentUser]);

    let phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    return (
        <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {           
            await updatePaperSetter(values,id,setShow,setMsg,currentUser,props.setMyList,props.myList,setEdit);
        }}
        validationSchema = {Yup.object({
            flag: Yup.number(),
            instId: Yup.string().when('flag', {
                is:0,
                then: Yup.string().required("Inst ID is Required")
            }),
            name: Yup.string()
            .required("Name is Required"),
            mobile: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
            .required("Mobile Number is Required.").max(10).min(10),
            email: Yup.string().email()
            .required("Email is Required."),
        })}
        >
        {
            props => {
                const {
                    values,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit
                } = props;
                return (
                    <Modal show={openEdit} onHide={handleClose} backdrop="static" size="lg">
                        <Modal.Header closeButton style={{backgroundColor:"OliveDrab",color:"white"}}>
                            <Modal.Title>Edit Paper Setter</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="col-xl-12">
                                <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-address-card mr-1"/>
                                        Edit Paper Setter Form
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Select Inst Id
                                                </div>
                                                <div className="col-lg-8">
                                                <select id="instId" name="instId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.instId}>
                                                    {
                                                    insts.map(inst => 
                                                    (
                                                        <option key={inst.uid} value={inst.uid}>
                                                        ({inst.username}) {inst.college_name}
                                                        </option>
                                                    ))
                                                    }
                                                </select>

                                                {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter Name
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="name" name="name" onChange={handleChange} value={values.name} onBlur={handleBlur} className="form-control" placeholder="Enter Paper Setter Name..." />

                                                    {errors.name ? <div className="alert alert-info">{errors.name}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter Mobile Number
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="mobile" name="mobile" onChange={handleChange} value={values.mobile} onBlur={handleBlur} className="form-control" placeholder="Enter Mobile Number..." maxLength={10}/>

                                                    {errors.mobile ? <div className="alert alert-info">{errors.mobile}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-12 row">
                                                <div className="col-lg-4">
                                                    Enter Email Address
                                                </div>
                                                <div className="col-lg-8">
                                                    <input type="text" id="email" name="email" onChange={handleChange} value={values.email} onBlur={handleBlur} className="form-control" placeholder="Enter Email Address..." />

                                                    {errors.email ? <div className="alert alert-info">{errors.email}</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="form-group">
                                            <center>
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
                                            </center>
                                        </div>
                                        
                                    </div>
                                </div>
                                </form>
                            </div>
                        </Modal.Body>
                    </Modal>
                );
            }
        }
        </Formik>
    );
};

async function updatePaperSetter(values,id,setShow,setMsg,currentUser,setMyList,myList,setEdit)
{
    let username        = values.email;
    let email           = values.email;
    let name            = values.name;
    let mobile          = values.mobile;
    let inst            = '';

    if(currentUser.role === 'EADMIN')
    {
        inst = currentUser.username;
    }
    else if(currentUser.role === 'ADMIN')
    {
        inst = values.instId;
    }

    await API.put('/user/'+id,{'type':'paperSetter','username':username,'name':name,'instId':inst,'mobile':mobile,'email':email})
    .then((res) => 
    {
        if(res.data.status === 'success')
        {
            setShow(true);
            setMsg('Paper Setter Updated Successfully...');
            setMyList(!myList);
            setEdit(false);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Updating Paper Setter...');
    });
}

async function getInsts(setInsts,setShow,setMsg,currentUser)
{
    let params = {};
    if(currentUser && currentUser.role === 'ADMIN')
    {
      params = {"role":"EADMIN"};
    }
    else if(currentUser && currentUser.role === 'EADMIN')
    {
      params = {"role":"EADMIN",'instUid':currentUser.uid};
    }
  
    await API.get('/user',{params: params})
  .then((res) => {
    if(res.data.status === 'success')
    {
      setInsts(res.data.data);
    }
    else
    {
      setShow(true);
      setMsg('Problem Fetching Data from Server');
    }
  });
}
export default EditPaperSetter;