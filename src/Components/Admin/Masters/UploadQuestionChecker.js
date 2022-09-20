import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
    file: Yup.string()
    .required("Please Upload Excel/Csv file"),
});

const UploadQuestionChecker = (props) => {
    const ref                           =   React.useRef();
    const [myMsg, setMyMsg]             =   useState('');
    const myInitialValues               =   { file: ''};
    let [loading, setLoading]           =   useState(false);

    const formik = useFormik({
        initialValues: myInitialValues,
        onSubmit: async (values,actions) => 
        {
            setMyMsg('');
            await UpQuestChecker(values.file,setMyMsg,props.myList,props.setMyList,setLoading);
            actions.setSubmitting(false);
            ref.current.value='';
        },
        validationSchema
    });

    return (
            <div className="col-xl-12">
                <div className="card mb-4">
                    <form id="form-GCA" method="post" className="form-horizontal" onSubmit={formik.handleSubmit}>
                        <div className="card-header">
                            <i className="fas fa-table mr-1"></i>
                            Upload Question Checker
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
        file: serverPath+'standardFormats/questchecker.xlsx',
      };
    window.open(response.file);
}
async function UpQuestChecker(file,setMyMsg,myList,setMyList,setLoading)
{
    setLoading(true);
    let fd = new FormData();
    fd.append("file", file);
    fd.append("type","checker");

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
            setLoading(false);
            setMyMsg(res.data.message);
            setMyList(!myList);   
        }
    })
    .catch(function (error) 
    {
        setLoading(false);
        setMyMsg(error.response.data.message);
        
    });
}

export default UploadQuestionChecker;