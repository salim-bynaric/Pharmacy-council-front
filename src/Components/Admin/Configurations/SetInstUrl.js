import React, {useState} from 'react';
import InstUrlForm from './InstUrlForm';
import InstUrlList from './InstUrlList';

const SetInstUrl = () => {
    const [myList, setMyList]       = useState(true);

    return (
        <div>
            <div className="container-fluid">
                <br/>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Set Institute Url</li>
                </ol>
                <div className="row col-lg-12 animate__animated animate__fadeInDown animate_slower">
                    <InstUrlForm setMyList={setMyList} myList={myList}/>
                </div>
                <div className="row col-lg-12 animate__animated animate__fadeInDown animate_slower">
                    <InstUrlList setMyList={setMyList} myList={myList}/>
                </div>
            </div>
        </div>
    );
};

export default SetInstUrl;