import React,{useState,useContext} from 'react';
import Moment from 'react-moment';
import {ExamFolderContext} from '../../../App';
import {rtrim} from '../../../utils/Helper';

const StudentProctorLog = (props) => {
    const [isOpen, setIsOpen]   =   useState(false);
    let log                     =   props.log;
    const { examFolder }        = useContext(ExamFolderContext);
    let dataFolder              =   props.dataFolder !== undefined ? props.dataFolder : examFolder ;     
    let i                       =   1;
    
    const location              =   process.env.REACT_APP_PROJPATH;

    return (
        log.length > 0 ?
        <div className="col-lg-12" style={{"overflow":"auto"}}>
            <table className="table table-bordered">
                <thead>
                    <tr style={{"backgroundColor":"#e9ecef"}}>
                        <th colSpan={5}>Student Name: {log[0].examData.stdid.name} <span style={{"float":"right"}}>Enrollment No: {log[0].examData.stdid.username}</span></th>
                    </tr>
                    <tr style={{"backgroundColor":"#e9ecef"}}>
                        <th colSpan={5}>Subject Name: {log[0].examData.paper.paper_name} <span style={{"float":"right"}}>Subject Code: {log[0].examData.paper.paper_code}</span></th>
                    </tr>
                    <tr style={{"backgroundColor":"#e9ecef"}}>
                        <th width="10%">Sr No</th>
                        <th width="10%">Snap Id</th>
                        {/*<th width="10%">Total Persons</th>*/}
                        <th width="30%">Snap</th>
                        <th width="40%">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    
                {log.map((image,index) => 
                {
                    return <tr key={index}>
                        <td>{i++}</td>
                        <td>
                            {image.proctorData[0]!== undefined ? image.proctorData[0].snapid : image.id}
                        </td>
                        {/*<td>
                            {image.totalPersons}
                        </td>*/}
                        <td><img src={rtrim(location,'/')+''+image.path} height={100} width={100} onClick={() => setIsOpen(true)} style={{"borderRadius":"5px"}} onDragStart={(e) => {e.preventDefault();}}></img></td>
                        <td><Moment format="MMMM Do YYYY, H:mm:ss A">{image.created_at}</Moment></td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
        :
        <div className="alert alert-danger col-lg-12">
            No Snapshot Data found for this Student with this Course.
        </div>
    );
};

export default StudentProctorLog;