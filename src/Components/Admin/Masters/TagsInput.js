import React, { useState } from 'react';

const TagsInput = ({tags,setTags,disabled=false}) => {
    function handleKeyDown(e) {
        if (e.key !== 'Enter') return
        const value = e.target.value
        if (!value.trim()) return

        setTags([...tags, value]);
        e.target.value='';
    }

    function removeTag(index) {
        setTags(tags.filter((el,i) => i !== index));
    }

    return (
        <div className='tags-input-container'>
            {
                tags.map((tag, index) => {
                    return <div className='tag-item1' key={index}>
                        <span className='text1'>
                            {tag}
                        </span>
                        <span className='close1' onClick={() => {
                            if(!disabled)
                            {
                                removeTag(index);
                            }
                        }}>X</span>
                    </div>
                })
            }
            <input type="text" onKeyDown={handleKeyDown} placeholder='Type Keyword...' className='tags-input1' disabled={disabled}/>
        </div>
    );
};

export default TagsInput;