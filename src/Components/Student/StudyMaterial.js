import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const StudyMaterial = () => {
    return (
        <>
            <div className='col-lg-12'>
                <div className="card" style={{ "marginTop": "30px" }}>
                    <div className="card-header bg-primary" style={{ color: "white" }}>
                       <h5><center><b>Study Material</b></center></h5>
                    </div>
                  
                    <div className='row Study-m'>
                    <div className='col-sm-4'>
                                <div className='common-div'>
                            <h6><center>Video</center></h6>
                            <center>
                                <ul>
                            <li className='video-cap'>Data Science video</li>
                            <li className='sub-dwl'>Download</li>
                            </ul>
                            </center>
                            <hr className='seprator'></hr>
                            </div>
                            
                        </div>
                    
                        <div className='col-sm-4'>
                            <div className='common-div'>
                            <center>
                            <h6><center>PDF </center></h6>
                            <ul><li className='video-cap'>Data Science</li>
                            <li className='sub-dwl'>Download</li></ul>
                            </center>
                            <hr className='seprator'></hr>
                            </div>
                        </div>
                        
                        <div className='col-sm-4'>
                                <div className='common-div'>
                                <center>
                                <h6><center>Excel/PPT/Word</center></h6>
                                <ul><li className='video-cap'>Data Science</li>
                                <li className='sub-dwl'>Download</li>
                                </ul>
                                </center>
                                <hr className='seprator'></hr>
                                </div>
                        </div>

                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default StudyMaterial;