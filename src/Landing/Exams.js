import React, { useState, useContext } from 'react';
import API from '../api';
import { de } from '../utils/Helper';
import { UserContext, ShowContext } from '../App';
import Popup from './Popup';
import ExamCardPurchase from '../Components/ExamPurchase/ExamCardPurchaseOuter';

const Exams = ({ exams, setExams, showExams, setShowExams}) => {
    const [subjectData, setSubjectData] = useState();
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const [show,setShow1] = useState(false);
    const handleClose = () => setShow1(false);

    return (
        showExams ?
            <>
                <div className='sub-dropdowns-exam'>
                    <ul>
                        {
                            exams && exams.map((exam, index) => {
                                let subjectId = exam.split('-')[0];
                                return <li key={index} onClick={() => {
                                    getOuterSubjectData(subjectId, setSubjectData, setShow1, setShow, setMsg);
                                }}>{exam.split('-')[1]}</li>
                            })
                        }
                    </ul>
                </div>
                {
                    subjectData !== undefined ?
                        <Popup show={show} handleClose={handleClose}>
                            <ExamCardPurchase exams={[subjectData]} purchased={[]} subCategory={subjectData.subprogram.subprogram_code} handleClose1={handleClose} tag={"outer"} />
                        </Popup>
                    :null
                }
            </>
        : null
    );
};

async function getOuterSubjectData(subjectId, setSubjectData, setShow1, setShow, setMsg) {
    setShow1(false);
    await API.get('/subject/outerData', { params: { 'subjectId': subjectId } })
        .then((res) => {
            if (res.data.status === 'success') {
                setSubjectData(JSON.parse(de(res.data.data)));
                setShow1(true);
            }
        })
        .catch((error) => {
            setShow(true);
            setMsg(error.response.data.message);
        });
}

export default Exams;