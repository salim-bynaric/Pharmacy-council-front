import React, { useState, useEffect, useContext } from 'react';
import UploadAnswerPdf from './UploadAnswerPdf';
import PdfViewer from './PdfViewer';
import API from '../../api';
import { ExamFolderContext } from '../../App';
import { Link } from 'react-router-dom';

const UploadSubjectiveAnswer = (props) => {
    let examId = props.location.state.examId;
    const enrollno = props.location.state.enrollno;
    const paperCode = props.location.state.paperCode;
    const { examFolder } = useContext(ExamFolderContext);
    const examEndTime = props.location.state.examEndTime;
    const examMaxAllowedTime = props.location.state.examMaxAllowedTime;
    const answerFile = props.location.state.answerFile;

    const [path, setPath] = useState();

    useEffect(async () => {
        if(props.location.state && examFolder !== undefined)
        {
            await fetchPdfPath(examId, setPath, examFolder);
        }
    }, [props.location.state,examFolder])

    return (

        <div>
            <div className="container-fluid"><br />
                <div className="breadcrumb col-lg-12 row">
                    <div className="breadcrumb-item active col-lg-10" style={{ "color": "red" }}><b>Upload Answer PDF.</b></div>
                    <div className="col-lg-2">
                        {
                            <Link to="studenthome" className="btn btn-danger btn-sm">Go Back</Link>
                        }</div>
                </div>
                <div className="row col-lg-12">
                    <div className="card mb-4">
                        <div className="card-header">
                            <i className="fas fa-table mr-1"></i>
                            <b>Important Instructions</b>
                        </div>
                        <div className="card-body">
                            <ol style={{"color":"red"}}>
                                <li><b>Do not Reload This Page, this may clear View of your uploaded files from this page. Use Go Back button on upper right corner to go to previous page</b></li>
                                <li>Answer File Upload Link will accept answer file for <b>30 Minutes after Ending your Examination</b>.</li>
                                <li><b>Only .pdf</b> documents can be uploaded as an Answer.</li>
                                <li>Maximum Answer file Upload Size can be upto <b>120 MB</b>.</li>
                                <li>After Successful File upload, answer PDF will be loaded in Pdf Viewer. <b>If it is not loaded then Direct Access Link will be automatically generated to view the uploaded Pdf</b>.</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="row col-lg-12 row">
                    <div className="col-lg-4">
                        <UploadAnswerPdf setPath={setPath} examId={examId} enrollNo={enrollno} paperCode={paperCode} examEndTime={examEndTime} examMaxAllowedTime={examMaxAllowedTime} answerFile={answerFile}/>
                        
                    </div>
                    <div className="col-lg-8">
                        {examFolder !== undefined ?
                            <PdfViewer path={path} answerFile={'View Answer Pdf'}/>
                            : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

async function fetchPdfPath(examId, setPath, examFolder) {
    await API.get('/exam/' + examId)
        .then(function (res) {
            if (res.data.status === 'success') {
                const serverPath = process.env.REACT_APP_PROJPATH;
                if (res.data.data.answerFile !== '' && res.data.data.answerFile !== undefined && res.data.data.answerFile !== null) 
                {
                    if (examFolder !== undefined) {
                        setPath(serverPath + 'data/' + examFolder + '/answers/' + res.data.data.answerFile);
                    }
                }
            }
        })
        .catch(function (error) {
        });
}

export default UploadSubjectiveAnswer;