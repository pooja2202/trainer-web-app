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
        `https://api.epicore.fit/trainer/web_sessions/${trainer?.trainer_id}`
      );
      console.log(response?.data?.response_body);
      setSessions(response?.data?.response_body?.upcoming_classes);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleJoinClass = (classIdValue) => {
    console.log(classIdValue);
    // Open a new window for the session room
    navigate(`/session-room/${classIdValue}`);
    // Add event listener to wait for new window to load
   
  };

  useEffect(() => {
    fetchSessions();
  }, [trainer]);

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto px-4 py-8">
      <h4 className="text-4xl font-light mb-8 text-left text-gray-700 font-serif">Upcoming Sessions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
          {sessions.map((session) => (
            <div key={session.class_id} className="relative rounded-lg overflow-hidden bg-white shadow-md">
              <img src={session.image} alt={session.name} className="object-cover object-center w-full h-auto rounded-t-lg" style={{height: "450px"}} />
              <div className="p-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={() => handleJoinClass(session.class_id)}
                >
                  Start Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
