import * as React from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useTrainer } from "../../context/TrainerContext";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate } from "react-router-dom";

const SessionRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { classId } = location.state;
  const { trainer } = useTrainer();
  const { id } = useParams();

  const sessionLiveStatus = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/trainer/live_status/${classId}`
      );
      console.log(
        "sessionLiveStatus method call-----",
        response?.data?.message
      );
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const endSession = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/trainer/end_class/${classId}`
      );
      console.log("response end session", response?.data);
      // setSessions(response?.data?.response_body?.upcoming_classes);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }

  function getUrlParams(url) {
    let urlStr = url.split("?")[1];
    const urlSearchParams = new URLSearchParams(urlStr);
    const result = Object.fromEntries(urlSearchParams.entries());
    return result;
  }
  let myMeeting = async (element) => {
    const roomID = getUrlParams(window.location.href)["roomID"] || randomID(5);
    let role = getUrlParams(window.location.href)["role"] || "Host";
    role =
      role === "Host"
        ? ZegoUIKitPrebuilt.Host
        : role === "Cohost"
        ? ZegoUIKitPrebuilt.Cohost
        : ZegoUIKitPrebuilt.Audience;

    let sharedLinks = [];
    if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
      sharedLinks.push({
        name: "Join as co-host",
        url:
          window.location.origin +
          window.location.pathname +
          "?roomID=" +
          roomID +
          "&role=Cohost",
      });
    }
    sharedLinks.push({
      name: "Join as audience",
      url:
        window.location.origin +
        window.location.pathname +
        "?roomID=" +
        roomID +
        "&role=Audience",
    });
    const appId = 710940122;
    const serverSecret = "9a5b7d64b076529800d42e64a53f5dfb";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      id,
      trainer?.trainer_id,
      trainer?.name
    );
    console.log(trainer?.trainer_id);

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: document.querySelector("#root"),
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
        // config: {
        //   role,
        // },
      },

      // sharedLinks: [
      //   {
      //     name: "Join as an audience",
      //     url:
      //       window.location.protocol +
      //       "//" +
      //       window.location.host +
      //       window.location.pathname +
      //       "?roomID=" +
      //       roomID +
      //       "&role=Audience",
      //   },
      // ],
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],

      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 50,
      layout: "Sidebar",
      showLayoutButton: true,
      scenario: {
        mode: "GroupCall",
        config: {
          role: "Host",
        },
      },
      onLeaveRoom: async () => {
        await sessionLiveStatus();
        await endSession();
        navigate("/home");
        await new Promise((resolve) => window.location.reload());
      },
    });
  };

  return (
    <div style={{ height: "500px" }}>
      <div ref={myMeeting} style={{ height: "100%" }}></div>;
    </div>
  );
};

export default SessionRoom;
