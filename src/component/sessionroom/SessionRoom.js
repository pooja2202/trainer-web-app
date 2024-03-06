import * as React from "react";
import { useParams } from "react-router-dom";
import { useTrainer } from "../../context/TrainerContext";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate } from "react-router-dom";

const SessionRoom = () => {
  const { trainer } = useTrainer();
  const { id } = useParams();
  const navigate = useNavigate();
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
      onLeaveRoom: () => {
        navigate("/home");
        window.location.reload();
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

// import React, { useEffect, useState } from "react";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// const SessionRoom = () => {
//   // Move useState calls outside of useEffect
//   const [roomID, setRoomID] = useState("");
//   const [userID] = useState(() => Math.floor(Math.random() * 10000) + "");
//   const [userName] = useState(() => "userName" + userID);

//   useEffect(() => {
//     function getUrlParams(url) {
//       let urlStr = url.split("?")[1];
//       const urlSearchParams = new URLSearchParams(urlStr);
//       const result = Object.fromEntries(urlSearchParams.entries());
//       return result;
//     }

//     // Initialize roomID inside useEffect
//     setRoomID(() => {
//       const params = getUrlParams(window.location.href);
//       return params["roomID"] || Math.floor(Math.random() * 10000) + "";
//     });

//     const appID = 710940122;
//     const serverSecret = "9a5b7d64b076529800d42e64a53f5dfb";
//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       appID,
//       serverSecret,
//       roomID,
//       userID,
//       userName
//     );

//     const zp = ZegoUIKitPrebuilt.create(kitToken);
//     zp.joinRoom({
//       container: document.querySelector("#root"),
//       sharedLinks: [
//         {
//           name: "Personal link",
//           url:
//             window.location.protocol +
//             "//" +
//             window.location.host +
//             window.location.pathname +
//             "?roomID=" +
//             roomID,
//         },
//       ],
//       scenario: {
//         mode: ZegoUIKitPrebuilt.VideoConference,
//       },
//       turnOnMicrophoneWhenJoining: true,
//       turnOnCameraWhenJoining: true,
//       showMyCameraToggleButton: true,
//       showMyMicrophoneToggleButton: true,
//       showAudioVideoSettingsButton: true,
//       showScreenSharingButton: true,
//       showTextChat: true,
//       showUserList: true,
//       maxUsers: 50,
//       layout: "Auto",
//       showLayoutButton: true,
//     });

//     // Cleanup function
//     return () => {
//       // You can add cleanup logic here if needed
//     };
//   }, [roomID, userID, userName]); // Include dependencies in useEffect dependency array

//   return <div id="root" style={{ width: "100vw", height: "100vh" }}></div>;
// };

// export default SessionRoom;
