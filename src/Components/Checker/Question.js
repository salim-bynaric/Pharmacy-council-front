import React, { useState } from 'react';
import MathJax from 'react-mathjax-preview';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const Question = ({ index, questions }) => {

    let question = questions[index].question.question;
    const [isOpen, setIsOpen] = useState(false);
    const projpath = process.env.REACT_APP_PROJPATH;
    let question_path = '';

    if (questions[index] && !questions[index].question.qu_fig) {
        question = questions[index].question.question;
    }
    else {
        if (questions[index]) {
            question = questions[index].question.question;
            question_path = projpath + "files/" + questions[index].question.qu_fig;
        }
    }

    return (
        <>
            <div className="col-lg-12">
                <b>Question {questions[index].qnid_sr}:</b>
                <span style={{ float: "right" }}>
                    <div style={{ float: 'right' }}><b>{'Marks: ' + questions[index].marks}</b></div>
                </span>
            </div>

            <div className="col-lg-12" style={{ height: "120px", overflow: "auto" }}>
                <MathJax math={question} />
                <br />
                {isOpen && (<Lightbox
                    mainSrc={question_path}
                    onCloseRequest={() => setIsOpen(false)}
                />
                )}
                <img src={question_path} alt="" onClick={() => setIsOpen(true)} title="Click on Image to Enlarge" onDragStart={(e) => {e.preventDefault();}}/>
            </div>
        </>
    );
};

export default Question;