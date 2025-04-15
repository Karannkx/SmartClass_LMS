import React, { useContext, useState } from "react";
import "./style.scss";

// Icons
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CancelRounded from "@material-ui/icons/CancelRounded";

// Assets
import dummyProfilePic from "../../assets/dummyProfilePic.png";

// Material UI Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";

// Contexts
import { AuthContext } from "../../context/authContext/AuthContext";
import { MaterialsContext } from "../../context/materialsContext/MaterialsContext";
import { TasksContext } from "../../context/tasksContext/TasksContext";

// API Calls
import {
  createCommentInMaterial,
  deleteCommentInMaterial,
  updateCommentInMaterial,
} from "../../context/materialsContext/apiCalls";
import {
  createCommentInTask,
  deleteCommentInTask,
  updateCommentInTask,
} from "../../context/tasksContext/apiCalls";

const ClassComment = ({
  inputMode,
  commentId,
  parentType,
  posterId,
  postedBy,
  timeOfPosting,
  profilePic,
  message,
  itemId,
  setDataChanged,
}) => {
  // Context state
  const { user } = useContext(AuthContext);
  const { dispatch: materialsDispatch } = useContext(MaterialsContext);
  const { dispatch: tasksDispatch } = useContext(TasksContext);

  // Local state
  const [comment, setComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Delete dialog state
  const [openInput, setOpenInput] = useState(inputMode); // Show input or not
  const [editing, setEditing] = useState(false); // Is editing existing comment
  const openMore = Boolean(anchorEl); // Menu visibility

  const moreOptions = ["Edit", "Delete"];

  // Open options menu
  const handleMoreBtnClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // Close options menu
  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  // Handles confirmation dialog for deletion
  const handleDialogBtnClick = (e) => {
    if (e.target.textContent === "Yes") {
      if (parentType === "material") {
        deleteCommentInMaterial(
          { commentId, posterId, itemId },
          user,
          materialsDispatch
        ).then((updatedData) => updatedData && setDataChanged(updatedData));
      } else if (parentType === "task") {
        deleteCommentInTask(
          { commentId, posterId, itemId },
          user,
          tasksDispatch
        ).then((updatedData) => updatedData && setDataChanged(updatedData));
      }
    }
    setOpenConfirmDialog(false);
  };

  // Handles menu option clicks (Edit/Delete)
  const handleOptionCLick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(null);

    const selectedOption = e.target.textContent;

    if (selectedOption === "Edit") {
      setEditing(true);
      setOpenInput(true);
      setComment(message);
    } else if (selectedOption === "Delete") {
      setOpenConfirmDialog(true);
    }
  };

  // Cancel editing an existing comment
  const handleCancelEdit = () => {
    setEditing(false);
    setOpenInput(false);
  };

  // Handle new or updated comment submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment) return;

    // Update existing comment
    if (editing) {
      if (parentType === "material") {
        updateCommentInMaterial(
          { comment, commentId, posterId, itemId },
          user,
          materialsDispatch
        ).then((updatedData) => updatedData && setDataChanged(updatedData));
      } else if (parentType === "task") {
        updateCommentInTask(
          { comment, commentId, posterId, itemId },
          user,
          tasksDispatch
        ).then((updatedData) => updatedData && setDataChanged(updatedData));
      }
      setEditing(false);
      setOpenInput(false);
      setComment("");
    } else {
      // Create new comment
      if (parentType === "material") {
        createCommentInMaterial(
          { comment, itemId },
          user,
          materialsDispatch
        ).then((updatedData) => updatedData && setDataChanged(updatedData));
      } else if (parentType === "task") {
        createCommentInTask({ comment, itemId }, user, tasksDispatch).then(
          (updatedData) => updatedData && setDataChanged(updatedData)
        );
      }
      setComment("");
    }
  };

  return (
    <div
      className={"comment " + (openInput ? "writeComment" : "writtenComment")}
    >
      {/* Profile Picture */}
      <img
        src={
          openInput
            ? user?.profilePic || dummyProfilePic
            : profilePic || dummyProfilePic
        }
        alt="profile"
      />

      {openInput ? (
        // Input section (new or edit mode)
        <form className="inputSection" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add class comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {/* Cancel edit button */}
          {editing && (
            <IconButton
              className="cancelBtn"
              onClick={handleCancelEdit}
              aria-label="cancel"
            >
              <CancelRounded color="error" />
            </IconButton>
          )}

          {/* Submit button */}
          <IconButton type="submit" disabled={!comment}>
            <SendIcon />
          </IconButton>
        </form>
      ) : (
        <>
          {/* Display posted comment */}
          <div className="textContent">
            <div className="topSection">
              <h4>{postedBy}</h4>
              <p>{timeOfPosting}</p>
            </div>
            <p className="message">{message}</p>
          </div>

          {/* Show options if user is poster or admin */}
          {(user._id === posterId || user.isAdmin) && (
            <>
              {/* More options menu */}
              <IconButton
                className="moreBtn"
                onClick={handleMoreBtnClick}
                aria-label="more"
                aria-haspopup="true"
                aria-controls="long-menu"
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                className="moreOptions"
                anchorEl={anchorEl}
                keepMounted
                open={openMore}
                onClose={handleCloseMore}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                {moreOptions.map((option) => (
                  <MenuItem key={option} onClick={handleOptionCLick}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>

              {/* Confirmation dialog for deleting a comment */}
              <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Do you want to delete <b>{message + " ?"}</b>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleDialogBtnClick}
                    style={{ textTransform: "none" }}
                    size="large"
                  >
                    No
                  </Button>
                  <Button
                    onClick={handleDialogBtnClick}
                    autoFocus
                    style={{ textTransform: "none" }}
                    size="large"
                  >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ClassComment;
