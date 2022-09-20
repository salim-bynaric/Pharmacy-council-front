import React,{useState,useEffect,useContext} from 'react';
import PreViewQuestionButtons from './PreviewQuestionButtons';
import PreviewQuestionAnswers from '../Exam/PreviewQuestionAnswers';
import PreViewPreviousButton from './PreViewPreviousButton';
import PreViewNextButton from './PreViewNextButton';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import {ShowContext} from '../../App';

const StartExamPreview = (props) => 
{
    let history                             = useHistory();
    const [myQuestions,setMyQuestions]      = useState();
    const {setShow,setMsg}                  = useContext(ShowContext);

    useEffect(() => 
    {
        if(props.location.state)
        {
            getQuestions(props.location.state.paperCode,props.location.state.instId,setShow,setMsg,setMyQuestions);
        }
    },[props.location.state]);

    return (
        props.location.state && myQuestions !== undefined ?
            <div className="row animate__animated animate__pulse animate_slower" id="myExamm" style={{ "marginRight": "-20px" }}>
                <div className='card col-lg-12'>
                    <div className="card-header bg-primary row" style={{ color: "white" }}>
                        <div className="col-lg-12">
                            <br />
                            <h6><b>Subject Name: {props.location.state.paperName} ({props.location.state.paperCode}) </b></h6>
                        </div>
                    </div>
                </div>
                <div className="card col-lg-8">
                    <div className="card-body">
                        <PreviewQuestionAnswers questions={myQuestions} myIndex={props.location.state.index}/>
                        <hr/>
                        <div className="col-lg-12 row">
                            <span><PreViewPreviousButton questions={myQuestions} myIndex={props.location.state.index} paperCode={props.location.state.paperCode} paperName={props.location.state.paperName} instId={props.location.state.instId}/></span>

                            <span style={{"marginLeft":"20px"}}><PreViewNextButton questions={myQuestions} myIndex={props.location.state.index} paperCode={props.location.state.paperCode} paperName={props.location.state.paperName} instId={props.location.state.instId}/></span>

                            <span style={{"marginLeft":"20px"}}><button className="btn btn-sm btn-warning" onClick={() => {
                                 history.replace("/examPreview") ;
                            }}><b>End Exam PreView</b></button></span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4" style={{float: "right"}}>
                    <PreViewQuestionButtons questions={myQuestions} myIndex={props.location.state.index} paperCode={props.location.state.paperCode} paperName={props.location.state.paperName} instId={props.location.state.instId}/>
                </div>
            </div>
        :<div className="custom-loader"></div>
    );
};

async function getQuestions(paperCode,instId,setShow,setMsg,setMyQuestions)
{
    await API.get('/myQuestions/'+paperCode+'/'+instId)
        .then((res) => 
        {
            if(res.data.status === 'success')
            {
                setMyQuestions(res.data.data);
            }
            else
            {
                setShow(true);
                setMsg('Problem Fetching Data from Server');
            }
        });
}

export default StartExamPreview;