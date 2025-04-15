import React, { useContext, useEffect, useState } from "react";
import "./style.scss";

// Layout components
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

// Functional components
import ClassComment from "../../components/classComment/ClassComment";
import QuestionAnswerRoundedIcon from "@material-ui/icons/QuestionAnswerRounded";
import { useLocation, useParams } from "react-router-dom";
import DetailedItem from "../../components/detailedItem/DetailedItem";

// Utilities and context
import { getItemdata } from "../../utils/fetchData";
import { AuthContext } from "../../context/authContext/AuthContext";
import formatDatetime from "../../utils/formatDatetime";

function IndividualTask() {
  // Extract state passed via navigation (task data + optional edit toggle)
  const { itemData, openEdit } = useLocation();

  // Local state to hold the task data
  const [data, setData] = useState(itemData);

  // Extract task ID from the route
  const { id: itemId } = useParams();

  // Access user information from global authentication context
  const { user } = useContext(AuthContext);

  // Reload the page once per session to ensure fresh data after navigation
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('has_refreshed');
    if (!hasRefreshed) {
      sessionStorage.setItem('has_refreshed', 'true');
      window.location.reload(); // Force refresh to sync navigation-based state
      return;
    }
    sessionStorage.removeItem('has_refreshed'); // Clean up after reload
  }, []);

  // Fetch the task details from the backend if data wasn't passed in
  useEffect(() => {
    if (!data) {
      getItemdata("task", itemId, user)
        .then((response) => {
          setData(response); // Set retrieved task data to local state
        })
        .catch((err) => console.log(err)); // Log any errors
    }
  }, [itemId, data]);

  return (
    <div className="individual-task">
      {/* Top navigation bar */}
      <Navbar />

      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content container */}
      <div className="container">
        <div className="wrapper">
          {/* Main task content with edit option if applicable */}
          <DetailedItem type="task" data={data} openEdit={openEdit} />

          {/* Class comments header */}
          <div className="comment-heading">
            <QuestionAnswerRoundedIcon className="icon" />
            <h3>Class comments</h3>
          </div>

          {/* Input box for adding a new comment */}
          <ClassComment
            inputMode
            parentType="task"
            itemId={data?._id}
            setDataChanged={setData}
          />

          {/* Render list of comments related to this task */}
          {data?.comments?.map((comment) => (
            <ClassComment
              parentType="task"
              key={comment?._id}
              commentId={comment?._id}
              posterId={comment?.poster?._id}
              postedBy={comment?.poster?.fullname}
              timeOfPosting={formatDatetime(comment?.createdAt)}
              profilePic={comment?.poster?.profilePic}
              message={comment?.comment}
              itemId={data?._id}
              setDataChanged={setData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default IndividualTask;
