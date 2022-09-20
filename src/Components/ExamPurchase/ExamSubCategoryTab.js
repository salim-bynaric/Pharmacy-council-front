import React, {useEffect} from 'react';

const ExamSubCategoryTab = ({ category, index, Path, element, purchased,setShow,setMyCategory, setSubCategory }) => {
    return (
        element !== undefined ?
            <>
                <div className="col-lg-2" key={index} onClick={() => {
                    setSubCategory(element.split(':$:')[2]);
                    setMyCategory(category);
                    setShow(true);
                }}>
                    <button className="btn"><img src={Path + element.split(':$:')[1]} height="40" width="40" style={{ "borderRadius": "50%" }} /> {element.split(':$:')[0]}</button>
                </div>
            </>
        : null
    );
};

function getSubCategories(category)
{
    let subcategoryArr = [];
    for(let i=0;i<category.subjects.length;i++)
    {
        subcategoryArr.push(category.subjects[i].subprogram.subprogram_code);
    }
    subcategoryArr = [...new Set(subcategoryArr)];
}

export default ExamSubCategoryTab;