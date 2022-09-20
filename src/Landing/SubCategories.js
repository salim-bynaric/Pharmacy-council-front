import React, { useState } from 'react';
import Exams from './Exams';

const SubCategories = ({ showSubCategories, setShowSubCategories, subCategories, setSubCategories, exams, setExams, data, showExams, setShowExams }) => 
{
    return (
        showSubCategories ?
            <>
                <div className='sub-dropdowns'>
                    <ul>
                        {
                            subCategories && subCategories.map((subcategory, index) => {
                                return <li key={index}
                                    onClick={async () => {
                                        await getExams(data, subcategory, setExams);
                                        setShowExams(!showExams);
                                    }}
                                    onMouseEnter={async () => { await getExams(data, subcategory, setExams); setShowExams(true); }}
                                >{subcategory.split('-')[1]}</li>
                            })
                        }
                    </ul>


                </div>
                <Exams exams={exams} setExams={setExams} showExams={showExams} setShowExams={setShowExams}/>
            </>
        : null
    );
};

async function getExams(data, subcategory, setExams) {
    let subCategoryId = subcategory.split('-')[0];
    let exams = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].subprogramId == subCategoryId) {
            exams.push(data[i].paperId + '-' + data[i].paper_name);
        }
    }
    exams = [...new Set(exams)];
    setExams(exams);
}

export default SubCategories;