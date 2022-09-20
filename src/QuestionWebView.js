import React from 'react';
import {useParams} from "react-router-dom";
import MathJax from 'react-mathjax-preview';

const QuestionWebView = () => 
{
    let { id } = useParams();
    id = Buffer.from(id, "base64").toString();
    id = id.replace(/\\/g,"");
    id = replaceAll(id,'xmlns="http://www.w3.org/1998/Math/MathML"',"");

    return (
        id !== undefined ?
        <div>
            <div className="col-lg-12" style={{height:"150px", overflow:"auto"}}>
                <MathJax math={id} />
            </div>
        </div>
        :null
    );
};

function replaceAll(str, find, replace) 
{
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) 
{
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

export default QuestionWebView;