import React, {useState,useEffect,useContext,createRef} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import {ShowContext} from '../../../App';
import {UserContext} from '../../../App';

const AddQuestionCheckerForm = (props) => {
    const [myMsg, setMyMsg]         = useState('');
    const [loading, setLoading]     = useState(false);
    const myFlag                    = useFlag(setLoading);
    let   ref                       = createRef()
    const {setShow,setMsg}          = useContext(ShowContext);
    const [insts,setInsts]          = useState([]);
    const {currentUser }            = useContext(UserContext);
    const myInitialValues           = { instId: '', name: '', flag:myFlag , mobile:'',email:'',password:''};

    useEffect(() => 
    {
        if(myFlag !== undefined && myFlag !== 1 && currentUser !== undefined && currentUser !== null)
        {
            getInsts(setInsts,setShow,setMsg,currentUser);
        }
    },[myFlag,setShow,setMsg,currentUser]);

    let phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    return (
        !loading && myFlag !== undefined ? <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            await saveQuestionChecker(values,setShow,setMsg,currentUser,props.setMyList,props.myList);
            
            actions.setSubmitting(false);
            actions.resetForm({
            values: {
                        instId: '', name: '', flag:myFlag , mobile:'',email:'',checkerType:'',password:''
                    },
            });
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
            password: Yup.string()
            .required("Password is Required."),
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
                <div className="col-xl-12">
                    <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-address-card mr-1"/>
                                Add Question Checker
                            </div>
                            <div className="card-body">
                                    {myFlag === 0 && insts.length > 0 && (
                                    <div className="form-group">
                                        <div className="col-lg-12 row">
                                            <div className="col-lg-4">
                                                Select Inst Id
                                            </div>
                                            <div className="col-lg-8">
                                            <select id="instId" name="instId" className="form-control" onChange={handleChange} onBlur={handleBlur} value={values.instId}>
                                                <option value="">Select Institute</option>
                                                {
                                                insts.map(inst => 
                                                (
                                                    <option key={inst.uid} value={inst.username}>
                                                    ({inst.username}) {inst.college_name}
                                                    </option>
                                                ))
                                                }
                                            </select>

                                            {errors.instId ? <div className="alert alert-info">{errors.instId}</div> : null}
                                            </div>
                                        </div>
                                    </div>)}
                                    <div className="form-group">
                                        <div className="col-lg-12 row">
                                            <div className="col-lg-4">
                                                Enter Checkers Name
                                            </div>
                                            <div className="col-lg-8">
                                                <input type="text" id="name" name="name" onChange={handleChange} value={values.name} onBlur={handleBlur} className="form-control" placeholder="Enter Question Checkers Name..." />

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
                                    <div className="form-group">
                                        <div className="col-lg-12 row">
                                            <div className="col-lg-4">
                                                Enter Password
                                            </div>
                                            <div className="col-lg-8">
                                                <input type="password" id="password" name="password" onChange={handleChange} value={values.password} onBlur={handleBlur} className="form-control" placeholder="Enter Password..." />

                                                {errors.password ? <div className="alert alert-info">{errors.password}</div> : null}
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
                                
                                {myMsg !== '' &&(
                                    <div className="alert alert-dark animate__animated animate__tada animate_slower">{myMsg}</div>)}

                                {loading && (
                                    <div className="custom-loader"></div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                );
            }
        }
        </Formik>
        :
        null
    );
};

async function saveQuestionChecker(values,setShow,setMsg,currentUser,setMyList,myList)
{
    let username        = values.email;
    let email           = values.email;
    let name            = values.name;
    let type            = values.checkerType;
    let mobile          = values.mobile;
    let inst            = '';
    let password        = values.password;

    if(currentUser.role === 'EADMIN')
    {
        inst = currentUser.username;
    }
    else if(currentUser.role === 'ADMIN')
    {
        inst = values.instId;
    }

    await API.post('/user',{'type':'checker','username':username,'name':name,'instId':inst,'mobile':mobile,'email':email,'password':password})
    .then((res) => 
    {
        if(res.data.status === 'success')
        {
            setShow(true);
            setMsg('Checker Added Successfully...');
            setMyList(!myList);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Adding Checker to Database...');
    });
}

function useFlag(setLoading)
{
    const [flag, setFlag]   =    useState();

    useEffect(() => {updateFlag();}, []);

    async function updateFlag()
    {
        setLoading(true);
        const res = await API.get('/settings',{params: {"type":"login"}});
        if(res.data.status==='success')
        {
            setFlag(res.data.flag);
            setLoading(false);
        }
    }

    return flag;
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

export default AddQuestionCheckerForm;