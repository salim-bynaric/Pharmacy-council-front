import React, {useEffect, useState} from 'react';

const UploadStudyMaterial = () => {
    
    return (
        <div>
          <div className="container-fluid">
              <br/>
              <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item active">Upload Study Material</li>
              </ol>
              <div className="col-lg-12 row">
              <div className="col-lg-12">
                  <UploadMaterial/>
                </div>
              </div>
          </div>
        </div>
    );
};

const UploadMaterial = (props) => {
   const [data, setData] =  useState('')
   const [subject, setSubject] = useState([]);
   const [type, setType] = useState([])

   function handleSubjectChange(event) {
    setSubject(event.target.value);
    }
    function handleTypeChange(event) {
        setType(event.target.value);
    }
 

    return (
            <div className="col-xl-12">
                <div className="card mb-4">
                    <form id="form-GCA" method="post" className="form-horizontal">
                        <div className="card-header">
                            <i className="fas fa-table mr-1"></i>
                            Upload Study Material
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <div className="col-lg-12 row">
                                    <div className="col-lg-12">
                                    <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" value={subject} onChange={handleSubjectChange}>
                                        <option selected>Select subject</option>
                                        <option value="One">One</option>
                                        <option value="Two">Two</option>
                                        <option value="Three">Three</option>
                                        <option value="Four">Four</option>
                                        <option value="Five">Five</option>
                                        <option value="Six">Six</option>
                                    </select>
                                    <br/>
                                    <select class="form-select form-select-lg mb-3 form-control-md" aria-label=".form-select-lg example" value={type} onChange={handleTypeChange}>
                                        <option selected>Select type</option>
                                        <option value="Video">Video</option>
                                        <option value="PDF">PDF</option>
                                        <option value="Word/excel">Word/excel</option>
                                    </select>
                                        <input 
                                            id="file" 
                                            name="file" 
                                            type="file" 
                                            className="form-control"
                                            value={data}
                                            onChange={(e)=>{
                                                setData(e.target.files)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                                <div className="form-group">
                                    <center>
                                        <button type="submit" className="btn btn-primary" >Submit</button>
                                    </center>
                                </div>
                                
                        </div>
                    </form>
                </div>
            </div>
    );
};


export default UploadStudyMaterial;