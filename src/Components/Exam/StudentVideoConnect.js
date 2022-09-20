import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import api from "../../api";
import { UserContext, ShowContext } from "../../App";
const { connect, createLocalVideoTrack, isSupported } = require("twilio-video");

function StudentVideoConnect({ examid, show, setMyCameraPerm, audio, status, resolution }) {
  const [token, setToken] = useState();
  const [room, setRoom] = useState();
  let history = useHistory();
  const { setShow, setMsg } = useContext(ShowContext);
  let audiio = "";
  if (audio === "AV") {
    audiio = true;
  } else if (audio === "V") {
    audiio = false;
  }

  let resolutionArr = resolution.split('x');
  let height = resolutionArr[0];
  let width = resolutionArr[1];

  const { currentUser } = useContext(UserContext);
  let disp = "";
  if (show === "no") {
    disp = "none";
  } else {
    disp = "block";
  }

  useEffect(() => {
    if (currentUser) {
      getToken(setToken, currentUser.username, examid);
    }
  }, [currentUser]);

  //----------------------------Connects Student with Twilio Video API------------------------------
  useEffect(() => 
  {
    if (token !== undefined) 
    {
      if(isSupported)
      {
          setMyCameraPerm(false);
          connect(token, {
            audio: audiio,
            name: examid,
            video: { width: width, height: height },
          }).then(
            (room) => {
              setRoom(room);
              setMyCameraPerm(true);
              //-----------------------Get feed of local track--------------------------------------
              createLocalVideoTrack().then((track) => {
                const localMediaContainer = document.getElementById("local-media");
                localMediaContainer.appendChild(track.attach());
              });
              //------------------------------------------------------------------------------------
            },
            (error) => {
              console.error(`Unable to connect to Room: ${error.message}`);
              setMyCameraPerm(false);
              setShow(true);
              setMsg("Without Camera Premission Examination can not be started."+error.message);
              if (currentUser && currentUser.role === "STUDENT") {
                history.replace("/studenthome");
              } else if (currentUser && currentUser.role === "ADMIN") {
                history.replace("/adminexamreport");
              }
            }
          );
          //------------------Cleanup function to remove disconnected user------------------------
          if (room !== undefined) {
            return function cleanup() {
              room.on("disconnected", (room) => {
                room.localParticipant.tracks.forEach((publication) => {
                  publication.track.stop();
                  const attachedElements = publication.track.detach();
                  attachedElements.forEach((element) => element.remove());
                });
              });
              // To disconnect from a Room
              room.disconnect();
            };
          }
      }
      else
      {
        setMyCameraPerm(false);
        setShow(true);
        setMsg("Video Proctoring Facility not supported on android webview. Can not give Camera Permissions.");
        if (currentUser && currentUser.role === "STUDENT") 
        {
          history.replace("/studenthome");
        } 
        else if (currentUser && currentUser.role === "ADMIN") 
        {
          history.replace("/adminexamreport");
        }
      }
      //--------------------------------------------------------------------------------------
    }
  }, [token]);
  //------------------------------------------------------------------------------------------------

  //-----------------------Regularly check camera permission after every second-----------------------
  useEffect(() => {
    let myInterval = setInterval(async () => {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: audiio,
        });
      } catch (err) {
        setShow(true);
        setMsg("Without Camera Premission Examination can not be started.");
        if (currentUser && currentUser.role === "STUDENT") {
          history.replace("/studenthome");
        } else if (currentUser && currentUser.role === "ADMIN") {
          history.replace("/adminexamreport");
        }
      }
    }, 1000);

    //--------------------------------------------------------------------

    //--------------Cleanup Function--------------------------------------
    return () => {
      clearInterval(myInterval);
    };
    //---------------------------------------------------------------------
  });
  //------------------------------------------------------------------------------------------------------

  return token !== undefined ? (
    <center>
      <div style={{ display: disp }}>
        <center>
          <div id="local-media"></div>
        </center>
      </div>
    </center>
  ) : null;
}

async function getToken(setToken, name, examid) 
{
  api
    .get("token", { params: { name: name, room: examid } })
    .then(function (response) {
      if (response.data.status === "success") {
        setToken(response.data.token);
      }
    })
    .catch(function (error) {});
}

export default StudentVideoConnect;
