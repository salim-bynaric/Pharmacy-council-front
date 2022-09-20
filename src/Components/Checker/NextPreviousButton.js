import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const NextPreviousButton = ({ index, questions, marks, exam, checkerType }) => {
    let history = useHistory();
    let [prevDisable, setPrevDisable] = useState(false);
    let [nextDisable, setNextDisable] = useState(false);

    useEffect(() => {
        if (index === 0) {
            setPrevDisable(true);
        }
        else {
            setPrevDisable(false);
        }
        if (index === (questions.length - 1)) {
            setNextDisable(true);
        }
        else {
            setNextDisable(false);
        }
    }, [index]);

    return (
        <div className="col-lg-12 row">
            <div className="col-lg-4">
                <button className="btn  btn-sm btn-primary" style={{ float: "left" }} onClick={() => {
                    goPrev(index, questions, marks, exam, history,checkerType);
                }} disabled={prevDisable}>Previous</button>
            </div>
            <div className="col-lg-4">
                <center><Link to={{ pathname: '/StudQuestions/'+exam.id }} target="_blank">All Questions</Link></center>
            </div>
            <div className="col-lg-4">
                <button className="btn  btn-sm btn-primary" style={{ float: "right" }} onClick={() => {
                    goNext(index, questions, marks, exam, history,checkerType);
                }} disabled={nextDisable}>Next</button>
            </div>
        </div>
    );
};

function goPrev(index, questions, marks, exam, history,checkerType) {
    let examDetails = {
        exam: exam,
        questions: questions,
        currentQuestionIndex: index - 1,
        marks: marks,
        checkerType: checkerType
    }
    history.replace("/paperChecking", examDetails);
}

function goNext(index, questions, marks, exam, history,checkerType) {
    let examDetails = {
        exam: exam,
        questions: questions,
        currentQuestionIndex: index + 1,
        marks: marks,
        checkerType: checkerType
    }
    history.replace("/paperChecking", examDetails);
}

export default NextPreviousButton;