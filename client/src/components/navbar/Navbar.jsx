// Navbar component with live gradient and bordered nav links
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import {
  HomeOutlined as HomeIcon,
  AssignmentOutlined as AssignmentIcon,
  ArrowDropDown as ArrowDropDownIcon,
  LiveHelpOutlined as HelpIcon,
} from "@material-ui/icons";
import {
  NoteAltOutlined as NoteIcon,
  CloseRounded as CloseIcon,
  AccountCircleOutlined as AccountIcon,
  VideoCallOutlined as VideoIcon,
  LogoutRounded as LogoutIcon,
} from "@mui/icons-material";

import { AuthContext } from "../../context/authContext/AuthContext";
import { logoutUser } from "../../context/authContext/apiCalls";
import dummyProfilePic from "../../assets/dummyProfilePic.png";
import "./style.scss";

const Navbar = () => {
  const location = useLocation();
  const { user, dispatch } = useContext(AuthContext);
  const [profileOptionsDialogOpened, setProfileOptionsDialogOpened] = useState(false);

  // Set active nav link based on route
  useEffect(() => {
    let currentTab = location.pathname.split("/")[1] || "home";
    if (currentTab !== "home" && currentTab.slice(-1) !== "s") currentTab += "s";
    const tabToSetActive = document.querySelector(`.link#${currentTab}`);
    if (tabToSetActive) tabToSetActive.classList.add("active");
  }, [location.pathname]);

  return (
    <div className="navbar">
      <div className="nav-container">
        {/* Left Logo Section */}
        <div className="left">
          <Link to="/" className="link">
            <h3 className="logo">SmartClass</h3>
          </Link>
        </div>

        {/* Center Nav Links */}
        <div className="middle">
          <div className="nav-links">
            <Link to="/" className="link" id="home">
              <HomeIcon className="icon" />
              <span>Home</span>
              <div className="navlink-border"></div>
            </Link>
            <Link to="/materials/all" className="link" id="materials">
              <NoteIcon className="icon" />
              <span>Subject Matter</span>
              <div className="navlink-border"></div>
            </Link>
            <Link to="/tasks/all" className="link" id="tasks">
              <AssignmentIcon className="icon" />
              <span>Assignments</span>
              <div className="navlink-border"></div>
            </Link>
            <Link to="/doubts/all" className="link" id="doubts">
              <HelpIcon className="icon" />
              <span>Queries</span>
              <div className="navlink-border"></div>
            </Link>
          </div>
        </div>

        {/* Right Profile Section */}
        <div className="right">
          <div className="profile" onClick={() => setProfileOptionsDialogOpened(true)}>
            <img src={user?.profilePic || dummyProfilePic} alt="profile" />
            <div className="userDetails">
              <span>{user?.fullname}</span>
              <span>{user?.isTeacher ? "Teacher" : "Student"}</span>
            </div>
            <ArrowDropDownIcon className="icon" />
          </div>

          {/* Profile Options Dialog */}
          <Dialog
            onClose={() => setProfileOptionsDialogOpened(false)}
            open={profileOptionsDialogOpened}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle disableTypography style={{ display: "flex", justifyContent: "center" }}>
              <IconButton
                onClick={() => setProfileOptionsDialogOpened(false)}
                style={{ position: "absolute", left: "10px", color: "var(--text-color2)" }}
              >
                <CloseIcon style={{ fontSize: "26px" }} />
              </IconButton>
              <h3 style={{ color: "var(--primary-color)" }}>SmartClass</h3>
            </DialogTitle>
            <Divider />

            {/* Navigation Items Inside Dialog */}
            <List>
              <Link to="/userupdate" className="link">
                <ListItem button onClick={() => setProfileOptionsDialogOpened(false)}>
                  <AccountIcon style={{ fontSize: "26px" }} />
                  <ListItemText primary="Update Profile" />
                </ListItem>
              </Link>

              <Link to="/materials/all" className="link">
                <ListItem button onClick={() => setProfileOptionsDialogOpened(false)}>
                  <NoteIcon style={{ fontSize: "26px" }} />
                  <ListItemText primary="All Materials" />
                </ListItem>
              </Link>

              <Link to="/tasks/all" className="link">
                <ListItem button onClick={() => setProfileOptionsDialogOpened(false)}>
                  <AssignmentIcon style={{ fontSize: "26px" }} />
                  <ListItemText primary="All Tasks" />
                </ListItem>
              </Link>

              <Link to="/doubts/all" className="link">
                <ListItem button onClick={() => setProfileOptionsDialogOpened(false)}>
                  <HelpIcon style={{ fontSize: "26px" }} />
                  <ListItemText primary="All Doubts" />
                </ListItem>
              </Link>

              <Link to="/createclass" className="link">
                <ListItem button onClick={() => setProfileOptionsDialogOpened(false)}>
                  <VideoIcon style={{ fontSize: "26px" }} />
                  <ListItemText primary="Create Meeting" />
                </ListItem>
              </Link>

              <Divider />
              <ListItem
                button
                onClick={() => {
                  setProfileOptionsDialogOpened(false);
                  logoutUser(dispatch);
                }}
              >
                <LogoutIcon style={{ fontSize: "26px" }} />
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
