import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import WarningModal from "./WarningModal";
const { connect } = require("twilio-video");

const VideoProctor = ({data,instId,date,slot,height,examid,day,region,token,}) => {
  const [room, setRoom] = useState();
  const overPath = process.env.REACT_APP_PROJPATH + "assets/images/blank1.png";
  const yetToStartPath =
    process.env.REACT_APP_PROJPATH + "assets/images/blank.jpg";
  const inprogressPath =
    process.env.REACT_APP_PROJPATH + "assets/images/loading.gif";
  const { currentUser } = useContext(UserContext);
  const [snap, setSnap] = useState();
  const [showWarning, setShowWarning] = useState(false);
  const handleClose1 = () => setShowWarning(false);
  const enroll = data.student.username;
  const paperId = data.subject.id;
  const warningDriver = data.subject.warningDriver;
  const warningType = data.subject.warningType;
  const [circle,setCircle] = useState(data.exam.examstatus === 'inprogress' ? 'start-exam' : 'end-exam');

  //------------------Manage Image and Video Transition-----------------------------------------
  useEffect(() => {
    if (currentUser) {
      if (data.exam.examstatus == "over") {
        document.getElementById("remote-media-div-" + examid).innerHTML = "";
        setSnap(undefined);
        setSnap(overPath);
        document.getElementById("remote-img-" + examid).style.display = "block";
      } else if (
        data.exam.examstatus === undefined ||
        data.exam.examstatus === null
      ) {
        document.getElementById("remote-media-div-" + examid).innerHTML = "";
        setSnap(undefined);
        setSnap(yetToStartPath);
        document.getElementById("remote-img-" + examid).style.display = "block";
      } else if (data.exam.examstatus === "inprogress") {
        setSnap(undefined);
        setSnap(inprogressPath);
      }
    }
  }, [currentUser, data.exam.examstatus]);
  //---------------------------------------------------------------------------------------------

  useEffect(() => {
    if (token !== undefined && data.exam.examstatus !== "over") {
      connect(token, {
        audio: false,
        name: examid,
        video: true,
      }).then((room) => {
        setRoom(room);
        //------------For Existing Participants in Room getting their feeds--------------------------
        room.participants.forEach((participant) => {
          participant.tracks.forEach((publication) => {
            if (publication.isSubscribed) {
              const track = publication.track;
              document.getElementById("remote-media-div-" + examid).innerHTML =
                "";
              document.getElementById("remote-img-" + examid).style.display =
                "none";
              document.getElementById("remote-media-div-" + examid).innerHTML =
                track.attach();
            }
          });

          participant.on("trackSubscribed", (track) => {
            document.getElementById("remote-media-div-" + examid).innerHTML =
              "";
            document.getElementById("remote-img-" + examid).style.display =
              "none";
            document
              .getElementById("remote-media-div-" + examid)
              .appendChild(track.attach());
          });
        });
        //-------------------------------------------------------------------------------------------
        //-------------------For Runtime Newly Attached Participants getting their feed--------------
        room.on("participantConnected", (participant) => {
          participant.tracks.forEach((publication) => {
            if (publication.isSubscribed) {
              const track = publication.track;
              document.getElementById("remote-media-div-" + examid).innerHTML =
                "";
              document.getElementById("remote-img-" + examid).style.display =
                "none";
              document.getElementById("remote-media-div-" + examid).innerHTML =
                track.attach();
            }
          });

          participant.on("trackSubscribed", (track) => {
            document.getElementById("remote-media-div-" + examid).innerHTML =
              "";
            document.getElementById("remote-img-" + examid).style.display =
              "none";
            document
              .getElementById("remote-media-div-" + examid)
              .appendChild(track.attach());
          });
        });
        //------------------------------------------------------------------------------------------
        //-------------------------Disconnected Participants----------------------------------------
        room.once("participantDisconnected", (participant) => {
         
        });
        //------------------------------------------------------------------------------------------
      });

      //--------------Cleanup function to unload the connected participant---------------------------
      return function cleanup() {
        if (room !== undefined) {
          room.on("disconnected", (room) => {
            // Detach the local media elements
            room.localParticipant.tracks.forEach((publication) => {
              const attachedElements = publication.track.detach();
              attachedElements.forEach((element) => element.remove());
            });
          });
          // To disconnect from a Room
          room.disconnect();
        }
      };
      //---------------------------------------------------------------------------------------------
    }
  }, [token, data.exam.examstatus]);

  return currentUser ? (
    <div>
      <div className="video-info">
        <i className={"fa fa-circle "+circle} aria-hidden="true"></i>
        <span onClick={async () => {
            if (
              data.exam.examstatus !== "over" &&
              data.exam.examstatus !== null &&
              data.exam.examstatus !== undefined
            ) {
              setShowWarning(true);
            } else {
              setShowWarning(false);
            }
          }}><i
          className="fa fa-exclamation-triangle"
          id="warning"
          aria-hidden="true"
        ></i>{" "}</span>
        
        <font size="3" color="red" className="std-numbers">
          {data.student.username}
        </font>{" "}
      </div>{" "}
      <div className="video-proctoring" id={"remote-media-div-" + examid}></div>{" "}
      <img
        className="video-proctor"
        src={snap + "?" + Date.now()}
        onDragStart={(e) => {
          e.preventDefault();
        }}
        id={"remote-img-" + examid}
      />{" "}

      <WarningModal
        showWarning={showWarning}
        handleClose1={handleClose1}
        enroll={enroll}
        examid={examid}
        paperId={paperId}
        instId={instId}
        room={room}
        warningDriver={warningDriver}
        warningType={warningType}
        day={day}
        slot={slot}
        region={region}
      />
    </div>
  ) : null;
};

export default VideoProctor;
