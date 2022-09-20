import React, {useState,useContext} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { Link } from 'react-router-dom';
import {UserContext} from '../../../App';

const validationSchema = Yup.object({
    file: Yup.string()
    .required("Please Upload Excel file"),
});

const UploadInstClusterMap = (props) => {
    const ref                           =   React.useRef();
    const [myMsg, setMyMsg]             =   useState('');
    const myInitialValues               =   { file: ''};
    let [loading, setLoading]           =   useState(false);
    const { currentUser }            = useContext(UserContext);

    const formik = useFormik({
        initialValues: myInitialValues,
        onSubmit: async (values,actions) => 
        {
            setMyMsg('');
            await UpMapping(values.file,setMyMsg,setLoading,props,currentUser);
            actions.setSubmitting(false);
            ref.current.value='';
        },
        validationSchema
    });

    return (
            <div className="col-xl-12">
                <div className="card mb-4">
                    <form id="form-QB" method="post" className="form-horizontal" onSubmit={formik.handleSubmit}>
                        <div className="card-header">
                            <i className="fas fa-table mr-1"></i>
                            Upload Institute To Cluster Admin Mapping
                            <span style={{"float":"right"}}><Link to={void(0)} onClick={() => {download();}}>Standard Format</Link></span>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-12">
                                        <input 
                                            id="file" 
                                            name="file" 
                                            type="file" 
                                            ref={ref}
                                            onChange={(event) => {
                                                formik.setFieldValue("file", event.currentTarget.files[0]);
                                            }} 
                                            onBlur={formik.handleBlur}
                                            className="form-control" 
                                        />
                                        {formik.errors.file ? <div className="alert alert-info">{formik.errors.file}</div> : null}
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
                    </form>
                </div>
            </div>
    );
};

function download()
{
    const serverPath = process.env.REACT_APP_PROJPATH;
    const response = {
        file: serverPath+'standardFormats/InstToClusterMap.xlsx',
      };
    window.open(response.file);
}

async function UpMapping(file,setMyMsg,setLoading,props,currentUser)
{
    setLoading(true);
    let fd = new FormData();
    fd.append("file", file);
    fd.append("type","instToClusterMapping");

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/user/upload',fd,config)
    .then(function (res) 
    {
        if(res.data.status==='success')
        {
            setMyMsg(res.data.message);
            props.setInserted(!props.inserted);
            setLoading(false);
        }
        else
        {
            setMyMsg(res.data.message);
            props.setInserted(!props.inserted);
            setLoading(false);
        }
    })
    .catch(function (error) 
    {
        setMyMsg(error.response.data.message);
        props.setInserted(!props.inserted);
        setLoading(false);
    });
}

export default UploadInstClusterMap;