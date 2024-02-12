import * as React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function SessionRoom() {
  const { id } = useParams();
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
    const appId = 1033534244;
    const serverSecret = "9d9a5fbac408a4ed8d3ef978fb1e90fd";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      id,
      randomID(5),
      randomID(5)
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: document.querySelector("#root"),
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role,
        },
      },
      sharedLinks: [
        {
          name: "Join as an audience",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID +
            "&role=Audience",
        },
      ],
    });
  };

  return <div ref={myMeeting}></div>;
}

export default SessionRoom;
