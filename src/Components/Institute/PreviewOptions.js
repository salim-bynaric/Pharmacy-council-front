import React,{useState,useContext} from 'react';
import MathJax from 'react-mathjax-preview';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Markup } from 'interweave';
import {ExamFolderContext} from '../../App';

const PreviewOptions = ({opt,optimage,questions,myIndex}) => 
{
    const [isOpen, setIsOpen]       =   useState(false);
    let optImg='';let optType='';let opt_path='';
    optType                         =   opt!==null ? opt.split(':$:')[1]:'';
    opt                             =   opt!==null ? opt.split(':$:')[0]:'';
    let mathIndexes                 =   getMathIndexes(opt);
    let textIndexes                 =   getTextIndexes(mathIndexes,opt);
    let optArray                    =   mergeTwoArr(textIndexes,mathIndexes,opt);
    let i                           =   0;
    const { examFolder }            =   useContext(ExamFolderContext);
    const dataFolder                =   examFolder;
    const projpath                  =   process.env.REACT_APP_PROJPATH;
    

    if(optimage)
    {
        optImg                          =   optimage.split(':$:')[0];
        optType                         =   optimage.split(':$:')[1];
        opt_path                        =   projpath+"data/"+dataFolder+"/files/"+optImg;
    }

    let style1 = null;

    if(optType === questions[myIndex].coption)
    {
      style1 ={"overflow":"auto","backgroundColor":"yellow","border-radius":"5px"}
    }
    else
    {
      style1 ={"overflow":"auto"}
    }

    return (
        <div className="col-lg-12 row" style={style1} >
            <span>
              <input type="radio"/>
            </span>
            <span style={{"marginLeft":"10px"}}>
              {
                opt !== undefined && opt !== null ?
                  optArray.map((data,index)=> 
                  {
                    if(index%2 === 0)
                    {
                      return <Markup content={optArray[index]} key={i++}/>
                    }
                    else
                    {
                      return <MathJax math={optArray[index]} key={i++}/>
                    }
                  })
                :null
              }
            </span>
            {isOpen && (<Lightbox
              mainSrc={opt_path}
              onCloseRequest={() => setIsOpen(false)}
              />
            )}
            <img src={opt_path} alt="" onClick={() => setIsOpen(true)} title="Click on Image to Enlarge" style={{"borderRadius":"5px"}} onDragStart={(e) => {e.preventDefault();}}/>
          </div>
    );
};

function mergeTwoArr(textIndexes,mathIndexes,question)
{
  let arr = [];
  let val = [];
  let t=0,m=0;
  for(let i=0;i<(textIndexes.length+mathIndexes.length);i++)
  {
    if(i%2 === 0)
    {
      arr.push(textIndexes[t++]);
    }
    else
    {
      arr.push(mathIndexes[m++]);
    }
  }

  for(let i=0;i<arr.length;i++)
  {
    let first = arr[i].split('-')[0];
    let second = arr[i].split('-')[1];

    val[i] = question.substring(first,second);
  }
  return val;
}

function getTextIndexes(mathIndexes,question)
{
  let textIndexes = [];
  let latstMathEnd = 0;
  let mathStart = 0;
  let mathEnd = 0;
  if(question !== null && question !== undefined)
  {
    if(mathIndexes.length > 0)
    {
      for(let i=0;i<mathIndexes.length;i++)
      {
        let start = 0;let end = 0;

        if(i===0)
        {
          mathStart = parseInt(mathIndexes[i].split('-')[0]);
          mathEnd = parseInt(mathIndexes[i].split('-')[1]);
          if(mathStart > 0)
          {
            textIndexes.push('0-'+(mathStart));
          }
          else
          {
            textIndexes.push('0-0');
          }
          latstMathEnd = mathEnd;
        }
        else
        {
          mathStart = parseInt(mathIndexes[i].split('-')[0]);
          mathEnd = parseInt(mathIndexes[i].split('-')[1]);

          textIndexes.push((latstMathEnd)+'-'+(mathStart));
          latstMathEnd = mathEnd;
        }
      }
      textIndexes.push((latstMathEnd)+'-'+(parseInt(question.length)));
    }
    else
    {
      textIndexes.push((0+'-'+question.length));
    }
  }
  return textIndexes;
}

function getMathIndexes(question)
{
  let count = 0;
  let mathIndex = [];
  if(question !== null && question !== undefined)
  {
    let totalLength = question.length;
    //-------------------Find number of <math> Tags--------------------------------------------------
    if(question.match(/<math/g)!==null)
    {
      count = question.match(/<math/g).length;
    }
    //-----------------------------------------------------------------------------------------------

    //-------------------Find indexes of <math> and </math> for each math tag and store in array-----
    let lastEnd = 0;
    for(let i=0;i<count;i++)
    {
      let start = question.indexOf('<math');
      let end = question.indexOf('</math>')+7;
    
      if(i === 0)
      {
        mathIndex.push((lastEnd+start)+'-'+(lastEnd+end));
        lastEnd = lastEnd+end;
      }
      else
      {
        mathIndex.push((lastEnd+start)+'-'+(lastEnd+end));
        lastEnd = lastEnd+end;
      }
      question = question.substr(end,question.length);
    }
    //-----------------------------------------------------------------------------------------------
  }
  return mathIndex;
}

export default PreviewOptions;