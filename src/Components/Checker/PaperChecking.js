import React from 'react';
import Question from './Question';
import Answer from './Answer';
import SelectMarks from './SelectMarks';
import AnswerPallettee from './AnswerPallettee';
import PaperCheckingSummary from './PaperCheckingSummary';
import NextPreviousButton from './NextPreviousButton';


const PaperChecking = (props) => {
    const index = props.location.state.currentQuestionIndex;
    const exam = props.location.state.exam;
    const questions = props.location.state.questions;
    const marks = props.location.state.marks;
    const checkerType = props.location.state.checkerType;

    return (
        props.location.state !== undefined && props.location.state.exam !== undefined ?
            <>
                <div className='card col-lg-12'>
                    <div className="card-header bg-primary row" style={{ color: "white" }}>
                        <div className="col-lg-8">
                            <h6><b>Subject Name: {props.location.state.exam.paper.paper_name} ({props.location.state.exam.paper.paper_code}) </b></h6>
                        </div>
                        <div className="col-lg-4">
                            <h6><b>Exam Id: {exam.id}</b></h6>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 row">
                    <div className="col-lg-8">
                        <div className="card-body">
                            <Question index={index} questions={questions} />
                            <Answer index={index} questions={questions} /><br />
                            <hr />
                            <SelectMarks index={index} questions={questions} marks={marks} exam={exam} checkerType={checkerType}/>
                            <hr />
                            <NextPreviousButton index={index} questions={questions} marks={marks} exam={exam} checkerType={checkerType}/>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <AnswerPallettee index={index} questions={questions} marks={marks} exam={exam} checkerType={checkerType}/>
                        <PaperCheckingSummary index={index} questions={questions} marks={marks} exam={exam} checkerType={checkerType}/>
                    </div>
                </div>
                
            </>
            : null
    );
};

export default PaperChecking;