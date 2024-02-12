import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";


function SessionRoom() {
  const { id } = useParams();

  useEffect(() => {
    myMeeting(); // Call myMeeting function when component mounts
  }, []); 

  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1150178069;
    const serverSecret =
      "914fa7066b4c9000afc41d65ea9cab0733fa7491982e354972eb81a3ecb0b477";
      const appDiv = document.querySelector('.myCallContainer'); 
      // const appDiv = document.getElementById('app');
    // appDiv.innerHTML = `<h1>JS Starter</h1>`;
    
    // const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    //   appID,
    //   serverSecret,
    //   id
    // );

    //zego-cloud-live-stream-code


  function generateToken(tokenServerUrl, userID) {
    // Obtain the token interface provided by the App Server
    return fetch(
      `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
      {
        method: 'GET',
      }
    ).then((res) => res.json());
  }
  
  function randomID(len) {
    let result = '';
    if (result) return result;
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }
  
  function getUrlParams(url) {
    let urlStr = url.split('?')[1];
    const urlSearchParams = new URLSearchParams(urlStr);
    const result = Object.fromEntries(urlSearchParams.entries());
    return result;
  }
  
  async function init() {
    
    const roomID = getUrlParams(window.location.href)['roomID'] || randomID(5);
    let role = getUrlParams(window.location.href)['role'] || 'Host';
    role =
      role === 'Host'
        ? ZegoUIKitPrebuilt.Host
        : role === 'Cohost'
        ? ZegoUIKitPrebuilt.Cohost
        : ZegoUIKitPrebuilt.Audience;
  
    let sharedLinks = [];
    if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
      sharedLinks.push({
        name: 'Join as co-host',
        url:
          window.location.origin +
          window.location.pathname +
          '?roomID=' +
          roomID +
          '&role=Cohost',
      });
    }
    sharedLinks.push({
      name: 'Join as audience',
      url:
        window.location.origin +
        window.location.pathname +
        '?roomID=' +
        roomID +
        '&role=Audience',
    });
  
    const userID = randomID(5);
    const userName = randomID(5);
    const { token } = await generateToken(
      'https://nextjs-token.vercel.app/api',
      userID
    );
    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      1150178069, // You need to replace the appid with your own appid
      token,
      roomID,
      userID,
      userName
    );
    const zp = ZegoUIKitPrebuilt.create(KitToken);
    zp.joinRoom({
      container: appDiv,
      branding: {
        logoURL:
          'https://www.zegocloud.com/_nuxt/img/zegocloud_logo_white.ddbab9f.png',
      },
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role,
        },
      },
      sharedLinks,
      onLeaveRoom: () => {
        // do do something
      },
      showUserList: true,
    });
  }

//live stream code end 

    // Create instance object from Kit Token.
    // const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    // zp.joinRoom({
    //   container: element,
    //   sharedLinks: [
    //     {
    //       name: "Personal link",
    //       url:
    //         window.location.protocol +
    //         "//" +
    //         window.location.host +
    //         window.location.pathname +
    //         "?roomID=" +
    //         id,
    //     },
    //   ],
    //   scenario: {
    //     mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
    //   },
    // });
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
