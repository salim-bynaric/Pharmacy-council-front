import React, { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { ShowContext } from '../../../App';

const validationSchema = Yup.object({
    instId: Yup.string()
        .required("Institute is Required"),
    url: Yup.string()
    .required("Url is Required"),
});

const InstUrlForm = (props) => 
{
    const [myMsg, setMyMsg] = useState('');
    let [loading, setLoading] = useState(false);
    const myInitialValues = { instId: '',url: ''};
    const { setShow, setMsg } = useContext(ShowContext);
    const [instList, setInstList] = useState();

    useEffect(() => {
        getUsers('EADMIN', setInstList, setLoading);
    }, []);

    const formik = useFormik({
        initialValues: myInitialValues,
        onSubmit: async (values, actions) => {
            setMyMsg('');
            await saveUrl(values,setShow,setMsg,setLoading,props.setMyList,props.myList);
            actions.setSubmitting(false);
            actions.resetForm({
                values: {
                    instId: '',url: ''
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
                            Set Institute Url Form
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
                                        Enter Url
                                    </div>
                                    <div className="col-lg-8">
                                        <input type="text" id="url" name="url" onChange={formik.handleChange} value={formik.values.url} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Url..." />

                                        {formik.errors.url ? <div className="alert alert-info">{formik.errors.url}</div> : null}
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

async function saveUrl(values,setShow,setMsg,setLoading,setMyList,myList)
{
    await API.put('/user/'+values.instId, { 'type':'instUrl', 'instId':values.instId,'url':values.url })
        .then(function (res) {
            setLoading(false);
            setShow(true);
            setMsg('Url Set Successfully...');
            setMyList(!myList);
        })
        .catch(function (error) {
            setLoading(false);
            setShow(true);
            setMsg('Problem Setting Url...');
        });
}

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

export default InstUrlForm;