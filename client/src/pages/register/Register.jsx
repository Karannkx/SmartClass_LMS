import React, { useContext, useState, useEffect } from "react";
import "./style.scss";
import { useHistory } from "react-router-dom";
import axios from "axios";

// Importing icons for input fields
import Person from "@material-ui/icons/Person";
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import SchoolRounded from "@material-ui/icons/SchoolRounded";
import MenuBookRounded from "@material-ui/icons/MenuBookRounded";

// Importing context and helper methods
import { AuthContext } from "../../context/authContext/AuthContext";
import { registerUser } from "../../context/authContext/apiCalls";

// Importing assets
import background from "../../assets/Wave.png";
import sideimage from "../../assets/reg-side-img.svg";

const Register = () => {
  // Local state to store user input values
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [isTeacher, setIsTeacher] = useState(false); // Role toggle

  // Access dispatch method and loading status from AuthContext
  const { isFetching, dispatch } = useContext(AuthContext);

  // History object for programmatic navigation
  const history = useHistory();

  // Handles form submission logic
  const handleRegister = () => {
    // Basic validation: check for empty fields
    if (!(fullname && email && password && course && semester)) {
      alert("Fillup all fields");
    }
    // Check if both passwords match
    else if (password !== confirmPass) {
      alert("Passwords are not equal");
    }
    // Proceed with registration API call
    else {
      registerUser(
        {
          fullname,
          email,
          password,
          course,
          semester,
          isTeacher,
        },
        dispatch
      );
    }
  };

  return (
    <div className="register">
      <div className="register-page">
        <h1>Register</h1>

        {/* Fullname Input */}
        <div className="register-input">
          <input
            type="text"
            name="fullname"
            value={fullname}
            placeholder="Enter full name"
            onChange={(e) => setFullname(e.target.value)}
          />
          <Person className="icon" />
        </div>

        {/* Course Dropdown */}
        <div className="register-input">
          <select
            name="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="course-select"
          >
            <option value="">Select Course</option>
            <option value="BCA">BCA</option>
            <option value="BTech">B.Tech.</option>
            <option value="MBA">MBA</option>
            {/* Additional course options can be added here */}
          </select>
          <SchoolRounded className="icon" />
        </div>

        {/* Semester Input */}
        <div className="register-input">
          <input
            type="text"
            name="semester"
            value={semester}
            placeholder="Your semester"
            onChange={(e) => setSemester(e.target.value)}
          />
          <MenuBookRounded className="icon" />
        </div>

        {/* Email Input */}
        <div className="register-input">
          <input
            type="text"
            name="email"
            value={email}
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Email className="icon" />
        </div>

        {/* Password Input */}
        <div className="register-input">
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Lock className="icon" />
        </div>

        {/* Confirm Password Input */}
        <div className="register-input">
          <input
            type="password"
            name="confirmPassword"
            value={confirmPass}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <Lock className="icon" />
        </div>

        {/* Register Button */}
        <button className="btn" onClick={handleRegister} disabled={isFetching}>
          Register
        </button>

        {/* Alternative option to go to Login */}
        <div>or</div>
        <button className="btn" onClick={() => history.push("/login")}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
