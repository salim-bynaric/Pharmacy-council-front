import React, {useState,useContext} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../api';
import { Markup } from 'interweave';

const validationSchema = Yup.object({
    file: Yup.string()
    .required("Please Upload Pdf file"),
});

const UploadAnswerPdf = ({setPath,examId,enrollNo,paperCode,examEndTime,examMaxAllowedTime,answerFile}) => 
{
    const ref                           =   React.useRef();
    const [myMsg, setMyMsg]             =   useState('');
    const myInitialValues               =   { file: ''};
    let [loading, setLoading]           =   useState(false);

    const formik = useFormik({
        initialValues: myInitialValues,
        onSubmit: async (values,actions) => 
        {
            setMyMsg('');
            setPath(undefined);
            await UpPdf(values.file,setMyMsg,setLoading,setPath,examId,enrollNo,paperCode,examEndTime,examMaxAllowedTime);
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
                            Upload Answer Pdf
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
                                <div className="alert alert-dark animate__animated animate__tada animate_slower"><Markup content={myMsg}/></div>)}

                                {loading && (
                                    <div className="custom-loader"></div>
                                )}

                        </div>
                    </form>
                </div>
            </div>
    );
};

async function UpPdf(file,setMyMsg,setLoading,setPath,examId,enrollNo,paperCode,examEndTime,examMaxAllowedTime)
{
    setLoading(true);
    let fd = new FormData();
    fd.append("file", file);
    fd.append("enrollNo", enrollNo);
    fd.append("paperCode", paperCode);
    fd.append("examId", examId);
    fd.append("examEndTime", examEndTime);
    fd.append("examMaxAllowedTime", examMaxAllowedTime);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/answer/uploadAnswerPdf',fd,config)
    .then(async function (res) 
    {
        if(res.data.status==='success')
        {
            setMyMsg(res.data.message);
            setLoading(false);
            setPath(res.data.path);
        }
    })
    .catch(function (error) 
    {
        setMyMsg(error.response.data.message);
        setLoading(false);
    });
}

export default UploadAnswerPdf;