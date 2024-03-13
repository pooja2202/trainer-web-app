import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTrainer } from "../../context/TrainerContext";
import { useNavigate } from "react-router-dom";
import { splitDateTime } from "../../utils/utils";

const Home = () => {
  const [sessions, setSessions] = useState([]);
  const { trainer } = useTrainer();
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/trainer/web_sessions/${trainer?.trainer_id}`
      );
      setSessions(response?.data?.response_body?.upcoming_classes);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const startClassHandler = async (classIdValue) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/trainer/start_class`,
        {
          trainer_id: trainer?.trainer_id,
          class_id: classIdValue,
        }
      );
      if (response.status === 200) {
        return response?.data?.response_body?.meeting_id;
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error("Error fetching :", error);
    }
  };

  const handleJoinClass = async (classIdValue) => {
    const meetingIdValue = await startClassHandler(classIdValue);
    navigate(`/session-room/${meetingIdValue}`, {
      state: { meetingId: meetingIdValue, classId: classIdValue },
    });
  };

  useEffect(() => {
    fetchSessions();
  }, [trainer]);

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto px-4 py-8">
        <h4 className="text-4xl font-light mb-8 text-left text-gray-700 font-serif">
          Upcoming Sessions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {sessions.map((session) => (
            <div
              key={session.class_id}
              className="relative rounded-lg overflow-hidden bg-white shadow-md"
            >
              <img
                src={session.image}
                alt={session.name}
                className="object-fill object-center w-full h-auto rounded-t-lg"
                style={{ height: "350px" }}
              />
              <div className="p-4 flex justify-between">
                <div className="text-left my-2">
                  <p style={{ fontSize: "1rem" }}>
                    Date : {splitDateTime(session?.start_date).date}
                  </p>
                  <p style={{ fontSize: "1rem" }}>
                    Time : {splitDateTime(session?.start_date).time}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    // style={{
                    //   backgroundColor: isTimeApproaching(session.start_date)
                    //     ? "#42800d"
                    //     : "#d2d2d2",
                    //   cursor: isTimeApproaching(session.start_date)
                    //     ? "pointer"
                    //     : "not-allowed",
                    // }}
                    // disabled={!isTimeApproaching(session.start_date)}
                    onClick={() => handleJoinClass(session.class_id)}
                  >
                    Start Class
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
