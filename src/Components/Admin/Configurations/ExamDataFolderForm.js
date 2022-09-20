import React, {useState,useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';

const validationSchema = Yup.object({
    instId: Yup.string()
    .required("Institute is Required"),
    folderName: Yup.string()
    .required("Folder Name is Required."),
});

const ExamDataFolderForm = (props) => 
{
    const [myMsg, setMyMsg]         = useState('');
    let [loading, setLoading]       = useState(false);
    const myInitialValues           = { instId: '', folderName: ''};
    const [instList, setInstList]   = useState();

    useEffect(() => {
        getUsers('EADMIN', setInstList, setLoading);
    }, []);

    const formik = useFormik({
        initialValues: myInitialValues,
        onSubmit: async (values,actions) => 
        {
            setMyMsg('');
            setDataFolderName(values,setMyMsg);
            actions.setSubmitting(false);
            actions.resetForm({
                values: {
                    instId: '', folderName: ''
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
                        <i className="fas fa-address-card mr-1"/>
                        Exam Data Folder Form
                    </div>
                    <div className="card-body">
                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-4">
                                        Select Institute
                                    </div>
                                    <div className="col-lg-8">
                                        <select id="instId" name="instId" className="form-control" onChange={async (e) => {
                                            formik.handleChange(e);
                                            await getDataFolderData(e.target.value,formik.setFieldValue);
                                        }} onBlur={formik.handleBlur} value={formik.values.instId}>
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
                                        Enter Data Folder Name
                                    </div>
                                    <div className="col-lg-8">
                                        <input type="text" id="folderName" name="folderName" onChange={formik.handleChange} value={formik.values.folderName} onBlur={formik.handleBlur} className="form-control" placeholder="Enter Data Folder Name..." />

                                        {formik.errors.folderName ? <div className="alert alert-info">{formik.errors.folderName}</div> : null}
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
        :null    
    );
};

async function setDataFolderName(values,setMyMsg)
{
    let instId = values.instId;
    let folderName = values.folderName;

    await API.put('/dataFolder',{"instId":instId,"folderName":folderName})
        .then(function (res) {
            setMyMsg(res.data.message);
        })
        .catch(function (error) {
            setMyMsg(error.response.data.message);
        });
}

async function getDataFolderData(instId,setFieldValue)
{
    await API.get('/dataFolder',{params:{"instId":instId}})
        .then(function (res) 
        {
            if(res.data.status === 'success')
            {
                if(res.data.folderName !== null && res.data.folderName !== undefined && res.data.folderName !== '')
                {
                    setFieldValue('folderName',res.data.folderName);
                }
                else
                {
                    setFieldValue('folderName','');
                }
            }
            else
            {
                setFieldValue('folderName','');
            }
        })
        .catch(function (error) {
            setFieldValue('folderName','');
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

export default ExamDataFolderForm;