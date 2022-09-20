import React, {useContext,useState} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../../api';
import {ShowContext} from '../../App';
import {AnsImgContext} from '../../App';
import {MaskContext} from '../../App';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Portal from '../../Portal';
import {en,de} from '../../utils/Helper';

const SubjectiveImageUpload = (props) => 
{
    const ref                       = React.useRef();
    const myInitialValues           = { file: ''};
    const index                     = props.index;
    const questions                 = props.questions;
    const {setShow,setMsg}          = useContext(ShowContext);
    const {setMask}                 = useContext(MaskContext);
    const {ImgArray,setImgArray}    = useContext(AnsImgContext);
    const [loading,setLoading]      = useState(false);
    const [isOpen, setIsOpen]       = useState(false);

    return (
        <Formik 
        initialValues= {myInitialValues}
        onSubmit= {async (values,actions) => 
        {
            setLoading(true);
            await saveImage(values,index,questions,setShow,setMsg,props,ImgArray,setImgArray);
            setLoading(false);
            setMask(false);
            actions.setSubmitting(false);
            ref.current.value='';
            actions.resetForm({
                values: {
                file: ''
                },
            });
        }}
        validationSchema = {Yup.object({
            file: Yup.string()
            .required("Please Upload only jpg,jpeg,ppt,pptx,doc,docx,xls,xlsx,pdf files"),
        })}
        >
        {
            props => {
                const {
                    errors,
                    isSubmitting,
                    setFieldValue,
                    handleBlur,
                    handleSubmit
                } = props;
                return (

                    <div className="col-lg-12 row">
                        <div className="col-lg-8">
                            <form id="form-Prog" method="post" className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <div className="col-lg-12 row">
                                        <div className="col-lg-8">
                                            <input 
                                                id="file" 
                                                name="file" 
                                                type="file" 
                                                ref = {ref}
                                                onChange={(event) => {
                                                    setMask(true);
                                                    setFieldValue("file", event.currentTarget.files[0]);
                                                    setMask(false);
                                                }} 
                                                onUnChange={() => {setMask(false);}}
                                                onClick ={() => {setMask(true);}}
                                                onBlur={handleBlur}
                                                className="form-control" 
                                            />
                                            {errors.file ? <div className="alert alert-info">{errors.file}</div> : null}
                                        </div>
                                        <div className="col-lg-4">
                                            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>Upload Answer</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {ImgArray.length > 0 && !loading ?
                        <div className="col-lg-12 row">
                            {ImgArray[index] !== '' && ImgArray[index] !== null && ImgArray[index] !== undefined ?
                                ImgArray[index].toString().split(',').map((element,index1) => 
                                {
                                    let str = element;
                                    let base_url = process.env.REACT_APP_PROJPATH;

                                    if(str.indexOf('.jpg') > 0 || str.indexOf('.jpeg') > 0 || str.indexOf('.JPG') > 0 || str.indexOf('.JPEG') > 0) 
                                    {
                                        return <div key={index1} className="col-lg-2 ansImage"><img src={str+'?t='+Date.now()} height={50} width={100} style={{'borderRadius':"5px", "marginLeft":"10px"}}  onDragStart={(e) => {e.preventDefault();}}/>
                                        {isOpen && (<Portal><Lightbox
                                            mainSrc={str}
                                            onCloseRequest={() => {setIsOpen(false);}}
                                        /></Portal>
                                        )}
                                        <center>
                                            <button className="btn btn-sm btn-danger remove-icon" id={str}  onClick={async () =>{setLoading(true);await deleteFile(str,questions,index1,index,setShow,setMsg,setImgArray);setLoading(false);}}>Delete</button>
                                        </center>
                                        </div>
                                    }

                                    if(str.indexOf('.pdf') > 0 || str.indexOf('.PDF') > 0 ) 
                                    {
                                        return <div className="col-lg-2 ansImage"><img src={base_url+'assets/images/pdf.png?t='+Date.now()} height={50} width={100} style={{'borderRadius':"5px", "marginLeft":"10px"}} onDragStart={(e) => {e.preventDefault();}}/>

                                        <center><button className="btn btn-sm btn-danger remove-icon" id={str}onClick={async () =>{setLoading(true);await deleteFile(str,questions,index1,index,setShow,setMsg,setImgArray);setLoading(false);}}>Delete</button></center>
                                        </div>
                                    }

                                    if(str.indexOf('.docx') > 0 || str.indexOf('.doc') > 0 ) 
                                    {
                                        return <div className="col-lg-2 ansImage"><img src={base_url+'assets/images/doc.png?t='+Date.now()} height={50} width={100} style={{'borderRadius':"5px", "marginLeft":"10px"}} onDragStart={(e) => {e.preventDefault();}}/>

                                        <center><button className="btn btn-sm btn-danger remove-icon" id={str}onClick={async () =>{setLoading(true);await deleteFile(str,questions,index1,index,setShow,setMsg,setImgArray);setLoading(false);}}>Delete</button></center>
                                        </div>
                                    }

                                    if(str.indexOf('.xlsx') > 0 || str.indexOf('.xls') > 0 ) 
                                    {
                                        return <div className="col-lg-2 ansImage"><img src={base_url+'assets/images/xls.png?t='+Date.now()} height={50} width={100} style={{'borderRadius':"5px", "marginLeft":"10px"}} onDragStart={(e) => {e.preventDefault();}}/>

                                        <center><button className="btn btn-sm btn-danger remove-icon" id={str}onClick={async () =>{setLoading(true);await deleteFile(str,questions,index1,index,setShow,setMsg,setImgArray);setLoading(false);}}>Delete</button></center>
                                        </div>
                                    }

                                    if(str.indexOf('.pptx') > 0 || str.indexOf('.ppt') > 0 ) 
                                    {
                                        return <div className="col-lg-2 ansImage"><img src={base_url+'assets/images/ppt.png?t='+Date.now()} height={50} width={100} style={{'borderRadius':"5px", "marginLeft":"10px"}} onDragStart={(e) => {e.preventDefault();}}/>

                                        <center><button className="btn btn-sm btn-danger remove-icon" id={str}onClick={async () =>{setLoading(true);await deleteFile(str,questions,index1,index,setShow,setMsg,setImgArray);setLoading(false);}}>Delete</button></center>
                                        </div>
                                    }

                                })
                            :null}
                        </div>
                        :<div className="custom-loader"></div>
                        }
                    </div>
                );
            }
        }
        </Formik>
    );
};

async function deleteFile(filepath,questions,fileindex,questindex,setShow,setMsg,setImgArray)
{
    
    let answerId = questions[questindex].id;
    let ExamId = questions[questindex].exam_id;
    await API.put('/answer/'+answerId,{"type":"removeAnswerImage","filePath":filepath,"fileIndex":fileindex})
    .then(async function(res) 
    {
        if(res.data.status==='success')
        {
            setShow(true);
            setMsg('File Deleted Successfully...');
            await getQuestions(ExamId,setImgArray);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Deleting Answer file...');
    });
}

async function getQuestions(ExamId,setImgArray)
{
  const res = await API.get('/answer',{params: {"exam_id": ExamId}});
  if(res.data.status === 'success')
  {
    let data = JSON.parse(de(res.data.data));
    let myArray = [];
    let base_url = process.env.REACT_APP_PROJPATH;

    data.forEach((element,index) => {
        if(element.answerImage!==null && element.answerImage!==undefined && element.answerImage!=='')
        {
            let strr= '';
            element.answerImage.split(',').map(path => {
                strr = strr + base_url+''+path+',';
            });
            strr = strr.replace(/,\s*$/, ""); // remove rightmost cocmma in string.
            myArray[index] = strr;
        }
        else
        {
            myArray[index] = '';
        }
    });

    setImgArray(myArray);

  }
  else
  {
    return null;
  }
}

async function saveImage(values,index,questions,setShow,setMsg,props,ImgArray,setImgArray)
{
    if(ImgArray[index].split(',').length >= 5)
    {
        setShow(true);
        setMsg('Only 5 Files can be uploaded for each Answer...');
        return false;
    }

    let answerId                    = questions[index].id;
    const curOptionStatus           = questions[index].answered;
    let newOptionStatus             = '';
    let ExamId                      = props.data.questions.location.state.exam.id;

    //-----------------------Find new option status2---------------------------
    if(curOptionStatus === 'unanswered')
    {
        newOptionStatus = 'answered';
    }
    else if(curOptionStatus === 'unansweredandreview')
    {
        newOptionStatus = 'answeredandreview';
    }
    else 
    {
        newOptionStatus = curOptionStatus;
    }
    //-----------------------------------------------------------------

    let fd = new FormData();
    fd.append("file", values.file);
    fd.append("newAnswered", newOptionStatus);
    fd.append("answer_by", ExamId);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    await API.post('/answer/upload/'+answerId,fd,config)
    .then(async function(res) 
    {
        if(res.data.status==='success')
        {
            setShow(true);
            setMsg('File Uploaded Successfully...');


            
            ImgArray[index] = res.data.path;
            setImgArray(ImgArray);
        }
    })
    .catch(function (error) 
    {
            setShow(true);
            setMsg(error.response.data.message);
    });
}

function getIndexes(myQuestions,searchString)
{
  let arr     = [];
  myQuestions.forEach(function(question,index){
    if(question.answered === searchString)
    {
      arr.push(index);
    }
  });
  return arr;
}

export default SubjectiveImageUpload;