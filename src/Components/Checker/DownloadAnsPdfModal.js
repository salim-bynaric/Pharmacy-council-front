import React , { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import API from '../../api';

const DownloadAnsPdfModal = ({ visible, setVisible, subjects , currentUser , setShow , setMsg }) => 
{
    const handleClose = () => setVisible(false);
    const [subject,setSubject] = useState();
    const [totStudents,setTotStudents] = useState();
    const [examNotGiven,setExamNotGiven] = useState();
    const [examGiven,setExamGiven] = useState();
    const [pdfUploaded,setPdfUploaded] = useState();
    const [loading, setLoading]     = useState(false);
    

    return (
        <div>
            <Modal show={visible} onHide={handleClose} size="lg" backdrop="static">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }} >
                    <Modal.Title><center>Download Answer Pdf</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <div className="col-lg-12 row">
                            <div className="col-lg-4">
                                Select Subject
                            </div>
                            <div className="col-lg-8">
                                <select id="paperId" name="paperId" className="form-control" onChange={async (e) => {
                                    setSubject(e.target.value);
                                    setLoading(true);
                                    await getStatistics(e.target.value,currentUser.inst_id,setShow,setMsg,setTotStudents,setExamNotGiven,setExamGiven,setPdfUploaded);
                                    setLoading(false);
                                }} value={subject}>
                                    <option value="">Select Subject</option>
                                    {
                                        subjects.map(subject =>
                                        (
                                            <option key={subject.subject.id} value={subject.subject.id}>
                                                {subject.subject.paper_code}-{subject.subject.paper_name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            {loading && (
                                <div className="custom-loader"></div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="col-lg-12 row">
                        {
                            (totStudents !== undefined && examNotGiven !== undefined && examGiven !== undefined && pdfUploaded !== undefined) ?
                            <>
                                <div className="col-lg-3">
                                    <div className="alert alert-primary" role="alert">
                                        Total Students : {totStudents}
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="alert alert-success" role="alert">
                                            Total Exam Giving Students : {examGiven}
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="alert alert-dark" role="alert">
                                            Total Exam Not Giving Students : {examNotGiven}
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="alert alert-danger" role="alert">
                                            Total Pdf Uploaded : {pdfUploaded}
                                    </div>
                                </div>
                            </>
                            :null
                        }
                    </div>
                    <hr/>
                    <div className="col-lg-12">
                        <center><button className="btn btn-primary" onClick={async () =>{
                            setLoading(true);
                            await download(subject,currentUser.inst_id,setVisible,setTotStudents,setSubject);
                            setLoading(false);
                        }}>Download</button></center>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

async function download(paperId,inst_id,setVisible,setTotStudents,setSubject)
{
    await API.get('/exam/downloadAnswerPdf/'+paperId, { params: { 'instId': inst_id } })
    .then(function (res) 
    {
        if (res.data.status === 'success') 
        {
            let path = res.data.path;
            window.open(path);
            setVisible(false);
            setTotStudents(undefined);
            setSubject(undefined);
        }
    })
    .catch(function (error) {

    });
}

async function getStatistics(paperId,instId,setShow,setMsg,setTotStudents,setExamNotGiven,setExamGiven,setPdfUploaded)
{
    let totalStudents = 0;
    let examNotGiven = 0;
    let examGiven = 0;
    let pdfUploaded = 0;

    if(paperId === '' || paperId === null || paperId === undefined) 
    {
        setShow(true);
        setTotStudents(undefined);
        setMsg('Please Select Subject For Downloading Answer PDF...');
        return false;
    }

    await API.get('/exam/AnswerPdfStatistics/'+paperId, { params: { 'instId': instId } })
        .then(function (res) 
        {
            if (res.data.status === 'success') 
            {
                let arr = res.data.data;
                setTotStudents(arr.length);totalStudents =  arr.length;

                arr.map((row,index) => {
                    if(row.status === '' || row.status === null || row.status === undefined)
                    {
                        examNotGiven = examNotGiven + 1;
                    }
                    else
                    {
                        examGiven = examGiven + 1;
                    }

                    if(row.answerFile !== undefined && row.answerFile !== null && row.answerFile !== '')
                    {
                        pdfUploaded = pdfUploaded + 1;
                    }
                });

                setExamNotGiven(examNotGiven);
                setExamGiven(examGiven);
                setPdfUploaded(pdfUploaded);
            }
        })
        .catch(function (error) {

        });
} 

export default DownloadAnsPdfModal;