import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';


const validationSchema = Yup.object({
    regType: Yup.string()
    .required("Registration Type is Required"),
    controllerName: Yup.string()
    .required("Name of Global Controller Admin is Required."),
    orgName: Yup.string()
    .required("Organization Name of Global Controller Admin is Required."),
    email: Yup.string()
    .required("Email of Global Controller Admin is Required.")
    .email(),
    mobile: Yup.number()
    .required("Mobile Number of Global Controller Admin is Required."),
    password: Yup.string()
    .required("Password for Login is Required.")
    .min(8, "Password is too short - should be 8 chars minimum"),
});

const GlobalControllerForm = (props) => 
{
    const [myMsg, setMyMsg]     = useState('');
    let [loading, setLoading]   = useState(false);
    const myInitialValues       = { regType: '', controllerName: '', orgName: '', email: '', mobile: '', password: ''};

    const formik = useFormik({
        initialValues: myInitialValues,
        onSubmit: async (values,actions) => 
        {
            setMyMsg('');
            registerGadmin(values.regType, values.controllerName, values.orgName, values.email, values.mobile, values.password,setLoading,setMyMsg,props.setMyList,props.myList);
            actions.setSubmitting(false);
            actions.resetForm({
            values: {
                        regType: '', controllerName: '', orgName: '', email: '', mobile: '', password: ''
                    },
            });
        },
        validationSchema
    });

    return (
        <div className="col-xl-8">
            <form id="form-GCA" method="post" className="form-horizontal" onSubmit={formik.handleSubmit}>
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-address-card mr-1"/>
                        Add Global Controller Form
                    </div>
                    <div className="card-body">
                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Select User Type
                                    </div>
                                    <div className="col-lg-8">
                                        <select id="regType" name="regType" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.regType}>
                                            <option value="">Select User Type</option>
                                            <option value="GADMIN">Global Controller Admin</option>
                                        </select>
                                        {formik.errors.regType ? <div className="alert alert-info">{formik.errors.regType}</div> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Admin User Name
                                    </div>
                                    <div className="col-lg-8">
                                        <input type="text" id="controllerName" name="controllerName" onChange={formik.handleChange} value={formik.values.controllerName} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Admin User Name..." />

                                        {formik.errors.controllerName ? <div className="alert alert-info">{formik.errors.controllerName}</div> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Organization Name of Admin
                                    </div>
                                    <div className="col-lg-8">
                                        <input type="text" id="orgName" name="orgName" onChange={formik.handleChange} value={formik.values.orgName} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Organization Name..." />

                                        {formik.errors.orgName ? <div className="alert alert-info">{formik.errors.orgName}</div> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Email of Admin
                                    </div>
                                    <div className="col-lg-8">
                                        <input type="text" id="email" name="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Email..." />

                                        {formik.errors.email ? <div className="alert alert-info">{formik.errors.email}</div> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Mobile of Admin
                                    </div>
                                    <div className="col-lg-8">
                                        <input type="text" id="mobile" name="mobile" onChange={formik.handleChange} value={formik.values.mobile} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Mobile Number..." maxLength="10"/>

                                        {formik.errors.mobile ? <div className="alert alert-info">{formik.errors.mobile}</div> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Enter Password
                                    </div>
                                    <div className="col-lg-8">
                                        <input type="password" id="password" name="password" onChange={formik.handleChange} value={formik.values.password} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Password..." />

                                        {formik.errors.password ? <div className="alert alert-info">{formik.errors.password}</div> : null}
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="card-footer">
                        <div className="form-group">
                            <center>
                                <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>Submit</button>
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
};

async function registerGadmin(regType,controllerName,orgName,email,mobile,password,setLoading,setMyMsg,setMyList,myList)
{
    setLoading(true);
    await API.post('/user', {'regType': regType,'controllerName': controllerName,'orgName': orgName,'email': email,'mobile': mobile,'password': password})
    .then(function (res) 
    {
        setLoading(false);
        setMyMsg(res.data.message);
        setMyList(!myList);
        setTimeout(()=>{setMyMsg('')}, 10000);
    })
    .catch(function (error) 
    {
        setLoading(false);
        setMyMsg(error.response.data.message);
        setTimeout(()=>{setMyMsg('')}, 10000);
    });   
}

export default GlobalControllerForm;