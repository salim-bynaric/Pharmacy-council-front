import React, { useState } from 'react';
import SubCategories from './SubCategories';

const MainCategories = ({ categories, setCategories, showCategories, setShowCategories, data, subCategories, setSubCategories, exams, setExams, showSubCategories, setShowSubCategories, showExams, setShowExams}) => {

    return (
        <>
            <div className='cat_name' onClick={() => { setShowCategories(!showCategories); setShowSubCategories(false); setShowExams(false); }} onMouseEnter={() => { setShowSubCategories(false); setShowExams(false); setShowCategories(true);}}>
                Categories
            </div>
            {
                showCategories ?
                    <div className='dropdowns'>
                        <ul>
                            {
                                categories.map((category, index) => {
                                    return <li key={index} onClick={async () => {
                                        await getSubCategory(data, category, setSubCategories);
                                        setShowSubCategories(!showSubCategories);
                                        setShowExams(false);
                                    }}
                                        onMouseEnter={async () => { await getSubCategory(data, category, setSubCategories); setShowExams(false); setShowSubCategories(true); 
                                        }}
                                    >{category.split('-')[1]}</li>
                                })
                            }
                        </ul>
                    </div>
                : null
            }
            <SubCategories showSubCategories={showSubCategories} setShowSubCategories={setShowSubCategories} subCategories={subCategories} setSubCategories={setSubCategories} exams={exams} setExams={setExams} data={data} showExams={showExams} setShowExams={setShowExams}/>
        </>
    );
};

async function getSubCategory(data, category, setSubCategories) {
    let categoryId = category.split('-')[0];
    let subCategory = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].programId == categoryId) {
            subCategory.push(data[i].subprogramId + '-' + data[i].subprogram_name);
        }
    }
    subCategory = [...new Set(subCategory)];
    setSubCategories(subCategory);
}

export default MainCategories;