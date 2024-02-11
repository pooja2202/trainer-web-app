import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function SessionRoom() {
  const { id } = useParams();
  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1150178069;
    const serverSecret =
      "914fa7066b4c9000afc41d65ea9cab0733fa7491982e354972eb81a3ecb0b477";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      id
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            id,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };

  return (
    <>
      <div>SessionRoom - {id}</div>
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "50vw", height: "50vh" }}
      ></div>
    </>
  );
}

export default SessionRoom;
