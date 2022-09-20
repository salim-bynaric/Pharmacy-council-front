import React, { useContext, useEffect, useState } from 'react';
import SearchExam from './SearchExam';
import OuterCart from './OuterCart';
import Categories from './Categories';
import { ExamFolderContext } from '../App';
import API from '../api';
import { en, de } from '../utils/Helper';

const LandingHeader = ({ setStudentRegister, setAdminLogin }) => {
    const { setExamFolder } = useContext(ExamFolderContext);
    const [score,setScore] = useState(0);

    useEffect(() => {
        getMyExamFolder(setExamFolder);
    }, []);

    return (
        <>
            <div className="container-fluid p-0" >
                <div className="row">
                    <div className="col-md-3 logos">
                        <img src="assets\images\Landing\logos.png"></img>&nbsp;
                        <img src="assets\images\Landing\name.png"></img>
                    </div>
                    <div className="col-md-2" onMouseLeave={() => { setScore(0);}} onMouseEnter={() => { setScore(1);}}>
                        <Categories score={score} setScore={setScore}/>
                    </div>
                    <div className="col-md-3"><SearchExam /></div>
                    
                    <div className="col-md-4"><OuterCart setStudentRegister={setStudentRegister} setAdminLogin={setAdminLogin} /></div>
                    
                </div>
            </div>
        </>
    );
};

async function getMyExamFolder(setExamFolder) {
    await API.get('/configurations', { params: { "type": en("headerconfig"), "instId": en(1000) } })
        .then(function (res) {
            let examFolder = de(res.data.examFolder);

            if (res.data.status === 'success') {
                setExamFolder(examFolder);
            }
        })
        .catch(function (error) {
        })
}

export default LandingHeader;