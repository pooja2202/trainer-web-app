import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function SessionRoom() {
  const { id } = useParams(); // Extracting 'id' parameter from the URL

  useEffect(() => {
    myMeeting(); // Call myMeeting function when component mounts
  }, []); // Empty dependency array ensures the effect runs only once on mount

  let myMeeting = async () => {
    const appDiv = document.querySelector(".myCallContainer"); // Selecting the container element
    const roomID = id; // Using the extracted 'id' parameter as roomID
    const userID = randomID(5); // Generating a random user ID
    const userName = randomID(5); // Generating a random user name

    // Fetching the token from the token server
    const { token } = await generateToken(
      "https://nextjs-token.vercel.app/api",
      userID
    );

    // Generating the Kit Token
    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      1150178069, // Your app ID
      token,
      roomID,
      userID,
      userName
    );

    // Creating ZegoUIKitPrebuilt instance
    const zp = ZegoUIKitPrebuilt.create(KitToken);

    // Joining the room
    zp.joinRoom({
      container: appDiv,
      branding: {
        logoURL:
          "https://www.zegocloud.com/_nuxt/img/zegocloud_logo_white.ddbab9f.png",
      },
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role: ZegoUIKitPrebuilt.Host, // Assuming the user who starts the meeting is the host
        },
      },
      onLeaveRoom: () => {
        // Handle leave room event if needed
      },
      showUserList: true,
    });
  };

  // Function to generate token
  function generateToken(tokenServerUrl, userID) {
    return fetch(
      `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
  }

  // Function to generate random ID
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

  return (
    <>
      <div
        className="myCallContainer"
        style={{ width: "100vw", height: "100vh" }}
      ></div>
    </>
  );
}

export default SessionRoom;
