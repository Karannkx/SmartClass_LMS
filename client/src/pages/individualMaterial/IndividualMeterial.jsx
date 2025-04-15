import React, { useContext, useEffect, useState } from "react";
import "./style.scss";

// Import layout components
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

// Import content-specific components
import ClassComment from "../../components/classComment/ClassComment";
import QuestionAnswerRoundedIcon from "@material-ui/icons/QuestionAnswerRounded";
import { useLocation, useParams } from "react-router-dom";
import DetailedItem from "../../components/detailedItem/DetailedItem";

// Utility functions and context
import { getItemdata } from "../../utils/fetchData";
import { AuthContext } from "../../context/authContext/AuthContext";
import formatDatetime from "../../utils/formatDatetime";

function IndividualMeterial() {
  // Extract passed state from navigation (item data and optional edit flag)
  const { itemData, openEdit } = useLocation();

  // Local state to store material data
  const [data, setData] = useState(itemData);

  // Get item ID from the route parameters
  const { id: itemId } = useParams();

  // Get logged-in user from global auth context
  const { user } = useContext(AuthContext);

  // Fetch item data if it's not passed via navigation
  useEffect(() => {
    if (!data) {
      getItemdata("material", itemId, user)
        .then((response) => {
          setData(response);
        })
        .catch((err) => console.log(err)); // Handle fetch error
    }
  }, []);

  return (
    <div className="individual-material">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="container">
        <div className="wrapper">
          {/* Render main material content using a reusable component */}
          <DetailedItem type="material" data={data} openEdit={openEdit} />

          {/* Class Comments Section Heading */}
          <div className="comment-heading">
            <QuestionAnswerRoundedIcon className="icon" />
            <h3>Class comments</h3>
          </div>

          {/* Comment input box for adding a new comment */}
          <ClassComment
            inputMode
            parentType="material"
            itemId={data?._id}
            setDataChanged={setData}
          />

          {/* Render list of existing comments if available */}
          {data?.comments?.map((comment) => (
            <ClassComment
              parentType="material"
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

export default IndividualMeterial;
