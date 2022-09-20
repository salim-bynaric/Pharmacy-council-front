import React, {useState} from 'react';

const ReadMore = ({ children, maxLength }) => {
    const [isTruncated,setIsTruncate] =  useState(true);
    let text = children;
    const resultString = isTruncated ? text ? text.slice(0, maxLength) : '' : text;

    let lable  = '';let myclass=''

    if(isTruncated)
    {
        lable = ' Read More ';
        myclass = 'btn-readmore';
        if((text ? text.length : 0) <= maxLength)
        {
            lable ='';
            myclass='';
        }
    }
    else
    {
        lable= ' Read Less ';
        myclass = 'btn-readmore';
    }
    
    return (
        <>
            <p style={{ "textAlign": "justify","overflow":"auto" }} className='card-text scroll1'>
                {
                    resultString
                }&nbsp;
                <a className={myclass} href="# " onClick={() => {
                    setIsTruncate(!isTruncated);
                }}>{lable}</a>
            </p>
        </>
    );
};

export default ReadMore;