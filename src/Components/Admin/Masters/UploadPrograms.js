import React, {useState,useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../../api';
import { Link } from 'react-router-dom';
import Pusher from "pusher-js";
import { de } from "../../../utils/Helper";
import UploadWarningModal from './UploadWarningModal';
import ProgressBar from "react-bootstrap/ProgressBar";

const validationSchema = Yup.object({
    file: Yup.string()
    .required("Please Upload Excel/Csv file"),
});

const UploadPrograms = (props) => {
    const ref                           =   React.useRef();
    const [myMsg, setMyMsg]             =   useState('');
    const myInitialValues               =   { file: ''};
    let [loading, setLoading]           =   useState(false);
    const [channel ,setChannel]         =   useState();
    const [errorMsg,setErrorMsg]        =   useState();
    const [popupShow,setPopupShow]      =   useState(true);
    const [totalRows, setTotalRows] = useState();
    const [proecessedRows, setProcessedRows] = useState(0);

    useEffect(() => {
        setChannel(''+Date.now());
    },[]);

    const formik = useFormik({
        initialValues: myInitialValues,
        onSubmit: async (values,actions) => 
        {
            setMyMsg('');
            await UpPrograms(values.file,setMyMsg,props.myList,props.setMyList,setLoading,channel);
            actions.setSubmitting(false);
            ref.current.value='';
        },
        validationSchema
    });

    useEffect(() => 
    {
        if(channel !== undefined)
        {
            let i = 0;
            const pusher = new Pusher("fb027f5a97144a25d7b6", {
            cluster: "ap2",
            });

            const channel1 = pusher.subscribe(channel);
            channel1.bind("my-event", function (data) 
            {
                if(de(data.message).includes('Warning:::'))
                {
                    if(i === 0)
                    {
                        props.setMyList(!props.myList);
                    }
                    setErrorMsg(de(data.message).split(':::')[1]);
                    i++;
                }
                else if(de(data.message).includes('Status:::'))
                {
                    if (de(data.message) == "Status:::Total") {
                        setTotalRows(de(data.warningId));
                      }
                
                      if (de(data.message) == "Status:::Current") {
                        setProcessedRows(de(data.warningId));
                      }
                }
            });
        }
    }, [channel,props.myList]);

    return (
            <div className="col-xl-4">
                <div className="card mb-4">
                    <form id="form-GCA" method="post" className="form-horizontal" onSubmit={formik.handleSubmit}>
                        <div className="card-header">
                            <i className="fas fa-table mr-1"></i>
                            Upload Programs
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
                                <br/>
                                <div className="col-lg-12">
                                    <br />
                                    {totalRows !== undefined  ? (
                                        <>
                                        <ProgressBar
                                            striped
                                            animated
                                            variant="success"
                                            max={totalRows}
                                            now={proecessedRows}
                                            key={1}
                                            label={`${Math.round(
                                            (proecessedRows / totalRows) * 100
                                            )}%`}
                                        />
                                        </>
                                    ) : null}

                                    {totalRows !== undefined ? (
                                        <>
                                        <br />
                                        <div className="alert alert-success">
                                            Imported {proecessedRows} Records of {totalRows}.
                                        </div>
                                        </>
                                    ) : null}

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
                {
                    errorMsg !== undefined ?
                        <UploadWarningModal errorMsg={errorMsg} header={'Program Upload Warnings'} setErrorMsg={setErrorMsg} setPopupShow={setPopupShow} popupShow={true}/>
                    :null
                }
            </div>
    );
};

function download()
{
    const serverPath = process.env.REACT_APP_PROJPATH;
    const response = {
        file: serverPath+'standardFormats/programs.xlsx',
      };
    window.open(response.file);
}
async function UpPrograms(file,setMyMsg,myList,setMyList,setLoading,channel)
{
    setLoading(true);
    let fd = new FormData();
    fd.append("file", file);
    fd.append("channel",channel)

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/program/upload',fd,config)
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

export default UploadPrograms;