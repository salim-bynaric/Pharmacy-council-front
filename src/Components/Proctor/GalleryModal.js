import React,{useState,useEffect,useContext} from 'react';
import Modal from "react-bootstrap/Modal";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { ExamFolderContext } from '../../App';
import Moment from 'react-moment';
import {rtrim} from '../../utils/Helper';

const GalleryModal = ({show,handleClose,examId,setShow,setMsg,log,loadReport}) => 
{
    const [img,setImg] = useState();
    const { examFolder } = useContext(ExamFolderContext);

    useEffect(() => {
        if(log !== undefined && log !== null && examFolder !== undefined)
        {
            createImagesArray(log,setImg,examFolder);
        }
    },[log,examFolder]);

    return (
        <div>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton style={{ backgroundColor: "OliveDrab", color: "white", zIndex: "99999" }}>
                    <Modal.Title><center>Snapshot Gallery...</center></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-lg-12" style={{"minHeight":"300px"}}>
                        {img !== undefined ?
                            <ImageGallery showThumbnails={true} items={img}/>
                        :<div className="custom-loader"></div>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

function createImagesArray(logs,setImg,examFolder)
{
    let output = [];
    let tmp;
    const imgPath = process.env.REACT_APP_PROJPATH;

    for(let i = 0; i < logs.length; i++)
    {
        tmp =   {"original" : rtrim(imgPath,'/')+''+logs[i].path, 
                "thumbnail" : rtrim(imgPath,'/')+''+logs[i].path,
                "description" : <Moment format="MMMM Do YYYY, H:mm:ss A">{logs[i].created_at}</Moment>
                };
        output.push(tmp);
    }

    setImg(output);
}

export default GalleryModal;