import React, { useContext, useEffect, useState } from "react";
import "./style.scss";

// Components
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import DetailedItem from "../../components/detailedItem/DetailedItem";

// Routing and context
import { useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";

// API utility
import { getItemdata } from "../../utils/fetchData";

const IndividualDoubt = () => {
  // Get passed-in data from router location (e.g., from previous page)
  const { itemData, openEdit } = useLocation();

  // Extract item ID from URL params
  const { id: itemId } = useParams();

  // Get current user from context
  const { user } = useContext(AuthContext);

  // State for doubt data and new response
  const [data, setData] = useState(itemData);
  const [newResponse, setNewResponse] = useState("");

  // Submit a new response to the server
  const handleSubmitResponse = async () => {
    if (!newResponse.trim()) return; // Prevent empty responses

    try {
      const response = await fetch(`/api/doubt/${data._id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          title: `Re: ${data.title}`,
          description: newResponse,
          subject: data.subject._id,
          course: data.course,
          semester: data.semester
        })
      });

      const updatedDoubt = await response.json();
      setData(updatedDoubt);        // Update local state with new data
      setNewResponse("");           // Clear the input field
    } catch (err) {
      console.error(err);           // Handle errors gracefully
    }
  };

  // Fetch doubt data on mount if not passed through location state
  useEffect(() => {
    if (!data) {
      getItemdata("doubt", itemId, user)
        .then((response) => {
          setData(response);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // Dynamically adjust height of textarea based on content
  const adjustTextarea = ({ target }) => {
    target.style.height = target.scrollHeight + "px";
    if (target.value === "") target.style.height = "96px";
  };

  return (
    <div className="individual-doubt">
      {/* Navigation and sidebar */}
      <Navbar />
      <Sidebar />

      {/* Main content container */}
      <div className="container">
        <div className="wrapper">
          {/* Main doubt content */}
          <DetailedItem type="doubt" data={data} openEdit={openEdit} />

          {/* Input area for teachers or original poster */}
          {(user?.isTeacher || data?.poster?._id === user?._id) && (
            <div className="writeAnswer">
              <img
                src={user.profilePic || "/assets/dummyProfilePic.png"}
                alt="profile"
              />
              <div className="inputSection">
                <textarea
                  placeholder={`Write your ${data?.isResponse ? 'reply' : 'response'}`}
                  spellCheck="false"
                  onKeyUp={adjustTextarea}
                  onChange={(e) => setNewResponse(e.target.value)}
                  value={newResponse}
                ></textarea>
                <button onClick={handleSubmitResponse}>Submit</button>
              </div>
            </div>
          )}

          {/* Responses section */}
          <div className="comment-heading">
            <CreateRoundedIcon className="icon" />
            <h3>Responses</h3>
          </div>

          {/* Render each response */}
          {data?.responses?.map((response, index) => (
            <DetailedItem key={index} type="doubtResponse" data={response} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualDoubt;
