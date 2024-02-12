import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTrainer } from "../../context/TrainerContext";
import { useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const Home = () => {
  const [sessions, setSessions] = useState([]);
  const { trainer } = useTrainer();
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `http://api.epicore.fit/trainer/web_sessions/${trainer?.trainer_id}`
      );
      console.log(response?.data?.response_body);
      setSessions(response?.data?.response_body?.upcoming_classes);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  // const handleJoinClass = (classIdValue) => {
  //   console.log(classIdValue);
  //   navigate(`/session-room/${classIdValue}`);
  // };
  const handleJoinClass = (classIdValue) => {
    console.log(classIdValue);
    // Open a new window for the session room
    const newWindow = window.open(`/session-room/${classIdValue}`, "_blank");
    // Add event listener to wait for new window to load
    newWindow.addEventListener("load", () => {
      // Call function in new window to start the meeting
      newWindow.init();
    });
  };
  

  useEffect(() => {
    fetchSessions();
  }, [trainer]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upcoming Sessions</h1>
      <div className="grid grid-cols-3 gap-4">
        {sessions.map((session) => (
          <div key={session.class_id} className="bg-gray-200 p-4 rounded">
            <p>{session.name}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleJoinClass(session.class_id)}
            >
              Start
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
