import React, { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';

const validationSchema = Yup.object({
    instId: Yup.string()
        .required("Institute is Required"),
    name: Yup.string()
        .required("Name of Admin is Required."),
    orgName: Yup.string()
        .required("Organization Name of Admin is Required."),
    email: Yup.string()
        .required("Email of Admin is Required.")
        .email(),
    mobile: Yup.number()
        .required("Mobile Number of Admin is Required."),
    password: Yup.string()
        .required("Password for Login is Required.")
        .min(8, "Password is too short - should be 8 chars minimum"),
});

const AdminForm = (props) => {
    const [myMsg, setMyMsg] = useState('');
    let [loading, setLoading] = useState(false);
    const myInitialValues = { instId: '', name: '', orgName: '', email: '', mobile: '', password: '' };
    const { setShow, setMsg } = useContext(ShowContext);
    const [instList, setInstList] = useState();

    useEffect(() => {
        getUsers('EADMIN', setInstList, setLoading);
    }, []);

    const formik = useFormik({
        initialValues: myInitialValues,
        onSubmit: async (values, actions) => {
            setMyMsg('');
            registerAdmin(values.instId, values.name, values.orgName, values.email, values.mobile, values.password, setLoading, setMyMsg, props.setMyList, props.myList)
            actions.setSubmitting(false);
            actions.resetForm({
                values: {
                    instId: '', name: '', orgName: '', email: '', mobile: '', password: ''
                },
            });
        },
        validationSchema
    });

    return (
        instList !== undefined ?
            <div className="col-xl-12">
                <form id="form-GCA" method="post" className="form-horizontal" onSubmit={formik.handleSubmit}>
                    <div className="card mb-4">
                        <div className="card-header">
                            <i className="fas fa-address-card mr-1" />
                            Add Admin Form
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Select Institute
                                    </div>
                                    <div className="col-lg-8">
                                        <select id="instId" name="instId" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.instId}>
                                            <option value="">Select Institute</option>
                                            {
                                                instList.map((inst) => {
                                                    return <option key={inst.uid} value={inst.username}>{inst.uid+'-'+inst.name}</option>
                                                })
                                            }
                                        </select>
                                        {formik.errors.instId ? <div className="alert alert-info">{formik.errors.instId}</div> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Admin User Name
                                    </div>
                                    <div className="col-lg-8">
                                        <input type="text" id="name" name="name" onChange={formik.handleChange} value={formik.values.name} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Admin User Name..." />

                                        {formik.errors.name ? <div className="alert alert-info">{formik.errors.name}</div> : null}
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
                                        <input type="text" id="mobile" name="mobile" onChange={formik.handleChange} value={formik.values.mobile} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Mobile Number..." maxLength="10" />

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

                            {myMsg !== '' && (
                                <div className="alert alert-dark animate__animated animate__tada animate_slower">{myMsg}</div>)}

                            {loading && (
                                <div className="custom-loader"></div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        : null
    );
};

async function getUsers(role, setInstList, setLoading) 
{
    await API.get('/user', { params: { 'role': role } })
        .then(function (res) {
            setInstList(res.data.data);
            setLoading(false);
        })
        .catch(function (error) {
            setInstList(undefined);
            setLoading(false);
        });
}

async function registerAdmin(instId, name, orgName, email, mobile, password, setLoading, setMyMsg, setMyList, myList) 
{
    if(name === 'admin')
    {
        setMyMsg('You Can not use admin as username in this system. This username is reserved.');
        return false;
    }

    setLoading(true);
    await API.post('/user', { 'type': 'ADMIN', 'instId':instId ,'name': name, 'orgName': orgName, 'email': email, 'mobile': mobile, 'password': password })
        .then(function (res) {
            setLoading(false);
            setMyMsg(res.data.message);
            setMyList(!myList);
            setTimeout(() => { setMyMsg('') }, 10000);
        })
        .catch(function (error) {
            setLoading(false);
            setMyMsg(error.response.data.message);
            setTimeout(() => { setMyMsg('') }, 10000);
        });
}


export default AdminForm;