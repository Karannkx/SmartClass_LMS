import React, { useContext, useState } from "react";
import axios from "axios";
import "./style.scss";

// Components and icons
import Navbar from "../../components/navbar/Navbar";
import Person from "@material-ui/icons/Person";
import SchoolRounded from "@material-ui/icons/SchoolRounded";
import MenuBookRounded from "@material-ui/icons/MenuBookRounded";
import Email from "@material-ui/icons/Email";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Button } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";

// Context and utilities
import { AuthContext } from "../../context/authContext/AuthContext";
import { updateUser } from "../../context/authContext/apiCalls";
import dummyProfilePic from "../../assets/dummyProfilePic.png";

function UserUpdate() {
  // Access user, dispatch, and loading state from context
  const { user, isFetching, dispatch } = useContext(AuthContext);

  // State to manage user form input
  const [userInfo, setUserInfo] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    course: user?.course || "",
    semester: user?.semester || "",
    profilePic: user?.profilePic || "",
  });

  // Store selected profile picture file
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Handles input changes for user fields
  const handleChange = ({ target: { name, value } }) => {
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Handles profile picture file selection and preview
  const handleProfilePicChange = ({ target: { files } }) => {
    if (files[0]) {
      setNewProfilePic(files[0]);
      setUserInfo({ ...userInfo, profilePic: URL.createObjectURL(files[0]) });
    }
  };

  // Handles user data submission, including optional image upload
  const handleSubmit = async (e) => {
    setUpdateLoading(true);
    let tempData = { ...userInfo };

    // If user selected a new profile picture
    if (newProfilePic) {
      const formData = new FormData();
      formData.append("file", newProfilePic);

      try {
        // Upload new image
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: `Bearer ${user.accessToken}`,
          },
        });

        // Set uploaded image URL in user data
        tempData.profilePic = response.data.secure_url;

        // Update user profile with new image
        await updateUser(user, tempData, dispatch);
        setUpdateLoading(false);
      } catch (error) {
        console.error("Upload error:", error);
        setUpdateLoading(false);
      }
    } else {
      // Update user profile without changing image
      updateUser(user, tempData, dispatch);
      setUpdateLoading(false);
    }

    // Log for debugging purposes
    console.log(tempData);
  };

  return (
    <div className="container">
      {/* Top navigation bar */}
      <Navbar />

      <div className="user-page">
        {/* Profile picture section */}
        <div className="userimg">
          <img src={userInfo.profilePic || dummyProfilePic} alt="profile" />

          {/* Upload button with camera icon */}
          <div className="upload">
            <Button
              variant="text"
              component="label"
              disableElevation
              endIcon={<PhotoCamera className="cam" />}
            >
              <input type="file" hidden onChange={handleProfilePicChange} />
            </Button>
          </div>
        </div>

        {/* Profile update form */}
        <h2>Profile Update</h2>
        <div className="edit-user">
          {/* Full Name */}
          <div className="user-input">
            <input
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              value={userInfo.fullname}
              onChange={handleChange}
            />
            <Person className="icon" />
          </div>

          {/* Email */}
          <div className="user-input">
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={userInfo.email}
              onChange={handleChange}
            />
            <Email className="icon" />
          </div>

          {/* Course */}
          <div className="user-input">
            <input
              type="text"
              name="course"
              placeholder="Enter your course"
              value={userInfo.course}
              onChange={handleChange}
            />
            <SchoolRounded className="icon" />
          </div>

          {/* Semester */}
          <div className="user-input">
            <input
              type="text"
              name="semester"
              placeholder="Enter your semester"
              value={userInfo.semester}
              onChange={handleChange}
            />
            <MenuBookRounded className="icon" />
          </div>
        </div>

        {/* Save button with loading state */}
        <div className="save-psswd">
          <LoadingButton
            variant="contained"
            className="btn"
            onClick={handleSubmit}
            style={{ textTransform: "none" }}
            loading={updateLoading || isFetching}
            loadingPosition="center"
          >
            Save
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

export default UserUpdate;
