import React,{useState,useContext, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import { ShowContext } from '../../App';

const SelectMarks = ({ index, questions, marks, exam, checkerType }) => 
{
    let maxMarks = questions[index].marks;

    let marksobt = 0;
    if(checkerType === 'QPC')
    {
        marksobt = (questions[index].obtmarks !== null && questions[index].obtmarks !== undefined) ? questions[index].obtmarks : '';
    }
    else if(checkerType === 'QPM')
    {
        marksobt = (questions[index].obtmarks1 !== null && questions[index].obtmarks1 !== undefined) ? questions[index].obtmarks1 : '';
    }

    let history = useHistory();
    let myMarks = [];
    for (let i = 0; i <= maxMarks; i++) {
        myMarks[i] = i;
    }

    const [selectedOption, setSelectedOption] = useState();
    const { setShow, setMsg } = useContext(ShowContext);

    useEffect(() =>{
        setSelectedOption(marksobt);
    })

    return (
        <div className="col-lg-12 row">
            <div className="col-lg-4">
                Select Marks
            </div>
            <div className="col-lg-8">
                <select id="assignMarks" name="assignMarks" className="form-control" onChange={(e) => {
                    setSelectedOption(e.target.value);
                    saveMarks(questions,index,e.currentTarget.value,exam,marks,history,setShow, setMsg,setSelectedOption,checkerType);
                }} value={selectedOption}>
                    <option value="">Select Marks for the Answer</option>
                    {
                        myMarks.map((value,index) =>
                        (
                            <option key={index} value={value}>
                                {value}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
};

async function saveMarks(questions,index,mark,exam,marks,history,setShow, setMsg,setSelectedOption,checkerType)
{
    let questId = questions[index].id;
    let myMarks = [...marks];
    let myQuestions = questions;
    await API.put('/checker/student/exams/marks/'+questId+'/'+mark,{'checkerType':checkerType})
    .then(function (res) 
    {
        if(res.data.status === 'success')
        {
            setShow(true);
            setMsg('Marks Saved Successfully...');

            myMarks[index] = parseInt(mark);
            if(checkerType === 'QPC')
            {
                myQuestions[index].obtmarks = parseInt(mark);
            }
            else if(checkerType === 'QPM')
            {
                myQuestions[index].obtmarks1 = parseInt(mark);
            }
            let examDetails = {
                exam: exam,
                questions: myQuestions,
                currentQuestionIndex: index,
                marks: myMarks,
                checkerType:checkerType
            }
            history.replace("/paperChecking", examDetails);
        }
    })
    .catch(function (error) 
    {
        setShow(true);
        setMsg('Problem Saving marks in the database...');
    });
}

export default SelectMarks;