import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./style.scss";
import dummyProfilePic from "../../assets/dummyProfilePic.png";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import ArrowUpwardRoundedIcon from "@material-ui/icons/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@material-ui/icons/ArrowDownwardRounded";
import Add from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import GetAppIcon from "@material-ui/icons/GetApp"; // Added import for download icon
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { AuthContext } from "../../context/authContext/AuthContext";
import { MaterialsContext } from "../../context/materialsContext/MaterialsContext";
import { TasksContext } from "../../context/tasksContext/TasksContext";
import { deleteMaterial } from "../../context/materialsContext/apiCalls";
import { deleteTask } from "../../context/tasksContext/apiCalls";
import formatDatetime from "../../utils/formatDatetime";
import { Link, useHistory, useParams } from "react-router-dom";
import { deleteDoubt } from "../../context/doubtsContext/apiCalls";
import { DoubtsContext } from "../../context/doubtsContext/DoubtsContext";
import ItemForm from "../itemForm/ItemForm";

const DetailedItem = ({ type, data, openEdit }) => {
  const { id: itemId } = useParams();
  const [item, setItem] = useState(null);
  let moreOptions = [];


  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(openEdit || false);
  const openMore = Boolean(anchorEl);
  const moreBtn = useRef(null);

  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { dispatch: materialsDispatch } =
    useContext(MaterialsContext);
  const { dispatch: tasksDispatch } = useContext(TasksContext);
  const { dispatch: doubtsDispatch } = useContext(DoubtsContext);

  useEffect(() => {
    setItem(data);
  }, [data]);

  console.log(data)

  if (user?._id === item?.poster?._id || user.isAdmin) {
    moreOptions = ["Edit", "Delete", "Copy link"];
  } else {
    moreOptions = ["Copy link"];
  }

  if (type === "doubtResponse")
    moreOptions = moreOptions.filter((op) => op !== "Copy link");

  useEffect(() => {
    if (moreOptions.length === 0) moreBtn.current.style.display = "none";
  }, [moreOptions.length]);

  const handleMoreBtnClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMore = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(null);
  };

  const handleDialogBtnClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (e.target.textContent === "Yes") {
      try {
        if (type === "material") {
          await deleteMaterial(itemId, user, materialsDispatch);
          history.push("/");
        } else if (type === "task") {
          await deleteTask(itemId, user, tasksDispatch);
          history.push("/");
        } else if (type === "doubt" || type === "doubtResponse") {
          await deleteDoubt(itemId, user, doubtsDispatch);
          if (!item.isResponse) { // Check if it's not a response
            history.push("/doubts");
          }
        }
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }

    setOpenConfirmDialog(false);
  };

  const handleOptionCLick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(null);
    console.log(e.target.textContent);

    let selectedOption = e.target.textContent;

    if (selectedOption === "Copy link") {
      let url = window.location.href;
      navigator.clipboard.writeText(url);
    } else if (selectedOption === "Delete") {
      setOpenConfirmDialog(true);
    } else if (selectedOption === "Edit") {
      setOpenEditForm(true);
    }
  };

  const handleGradeSubmission = async (submission, status, grade, feedback) => {
    try {
      const response = await axios.post(
        `/api/task/${item._id}/grade`,
        {
          submissionId: submission._id,
          status,
          grade,
          feedback
        },
        {
          headers: { token: `Bearer ${user.accessToken}` }
        }
      );
      if (response.data) {
        setItem(response.data);
        alert('Submission graded successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to grade submission');
    }
  };

  const handleDownload = (fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log(item?.submissions)

  return (
    <>
      {!openEditForm ? (
        <div className={"detailedItem " + type}>
          {type === "doubt" || type === "doubtResponse" ? (
            <>
              <div className="votes">
                <ArrowUpwardRoundedIcon className="icon" />
                <p>{item?.votes}</p>
                <ArrowDownwardRoundedIcon className="icon" />
              </div>

              <div className="itemContent">
                {type === "doubt" && (
                  <div className="topSection">
                    <Link
                      to={`/${type}s/${item?.subject?.name}`}
                      className="link"
                    >
                      <h4 className="subject">{item?.subject?.name}</h4>
                    </Link>
                  </div>
                )}

                <div className="bottomSection">
                  <img
                    src={item?.poster?.profilePic || dummyProfilePic}
                    alt="profile"
                  />
                  <div className="textContent">
                    <div className="titleSection">
                      <h4 className="itemTitle">
                        {item?.poster?.fullname +
                          (type === "doubtResponse"
                            ? " answered to this question"
                            : " asked " + item?.title)}
                      </h4>
                      <p>{formatDatetime(item?.createdAt)}</p>
                    </div>

                    <p className="doubtDesc">{item?.description}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="itemInfo">
                <h1 className="title">{item?.title}</h1>
                <div className="name-and-time">
                  <h5>{item?.poster?.fullname}</h5>
                  <h5 className="Postingtime">
                    {formatDatetime(item?.createdAt)}
                  </h5>
                </div>
                <h5 className="subject">{item?.subject?.name}</h5>

                <div className="attachments">
                  {item?.attachments?.map((attachment, index) => (
                    <div className="attachment" key={index}>
                      <DescriptionOutlinedIcon className="icon" />
                      <a
                        href="#"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.preventDefault();
                          const baseUrl = process.env.REACT_APP_API_URL || 'http://0.0.0.0:5000';
                          const fileUrl = attachment.link.startsWith('/') ? attachment.link : `/${attachment.link}`;
                          window.open(`${baseUrl}${fileUrl}`, '_blank');
                        }}
                      >
                        {attachment.filename}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {type === "task" && (
                <div className="your-work">
                  <div className="topDiv">
                    {item?.points && (
                      <h5 className="points">{item?.points} points</h5>
                    )}
                    {item?.dueDatetime && (
                      <h5 className="dueDatetime">
                        Due {formatDatetime(item?.dueDatetime)}
                      </h5>
                    )}
                  </div>
                  <div className="workinfo">
                    <h3>Your Work</h3>
                    <p>{item?.submission ? 'Submitted' : 'Pending'}</p>
                  </div>

                  {user.isTeacher ? (
                    <div className="teacher-actions">
                      <h4>Student Submissions</h4>
                      <table className="student-list">
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Course</th>
                            <th>Status</th>
                            <th>Submission Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item?.submissions?.map((submission, index) => (
                          <tr key={index}>
                            <td>{submission.student.fullname}</td>
                            <td>{submission.student.course}</td>
                            <td>
                              <span className={`status-badge ${submission.status}`}>
                                {submission.status}
                              </span>
                            </td>
                            <td>
                              {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Not submitted'}
                            </td>
                            <td>
                              {submission.file && (
                                <>
                                  <button 
                                    className="view-btn"
                                    onClick={() => {
                                      const baseUrl = process.env.REACT_APP_API_URL || 'http://0.0.0.0:5000';
                                      const fileUrl = submission.file ? 
                                        (submission.file.startsWith('/') ? submission.file : `/${submission.file}`) :
                                        '';
                                      if (fileUrl) {
                                        window.open(`${baseUrl}${fileUrl}`, '_blank');
                                      }
                                    }}
                                  >
                                    View Submission
                                  </button>
                                  <button 
                                    className="feedback-btn"
                                    onClick={() => {
                                      const feedback = prompt('Enter feedback for ' + submission.student.fullname + ':');
                                      if (feedback !== null) {
                                        handleGradeSubmission(submission, submission.status || 'pending', submission.grade || 0, feedback);
                                      }
                                    }}
                                  >
                                    {submission.feedback ? 'Update Feedback' : 'Give Feedback'}
                                  </button>
                                  {!user.isTeacher && submission.feedback && (
                                    <div className="feedback-text">
                                      <strong>Teacher's Feedback:</strong> {submission.feedback}
                                    </div>
                                  )}
                                  {submission.status === 'pending' && (
                                    <>
                                      <button 
                                        className="accept-btn"
                                        onClick={() => {
                                          const grade = prompt('Enter grade (0-100):');
                                          const feedback = prompt('Enter feedback:');
                                          if (grade !== null) {
                                            handleGradeSubmission(submission, 'accepted', Number(grade), feedback);
                                          }
                                        }}
                                      >
                                        Accept
                                      </button>
                                      <button 
                                        className="reject-btn"
                                        onClick={() => {
                                          const feedback = prompt('Enter feedback:');
                                          handleGradeSubmission(submission, 'rejected', 0, feedback);
                                        }}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="student-actions">
                      {item?.submissions?.find(s => s.student._id === user._id)?.status === 'submitted' ? (
                        <div className="submission-status">
                          <p className="status-text">Assignment Submitted</p>
                          {item?.submissions?.find(s => s.student._id === user._id)?.feedback && (
                            <div className="feedback-box">
                              <h4>Teacher's Feedback:</h4>
                              <p>{item?.submissions?.find(s => s.student._id === user._id)?.feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="submission-buttons">
                          <input
                            type="file"
                            id="taskSubmission"
                            accept=".pdf"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;


                            const formData = new FormData();
                            formData.append('submission', file);

                            try {
                              const response = await axios.post(`/api/task/${item._id}/submit`, formData, {
                                headers: {
                                  token: `Bearer ${user.accessToken}`,
                                  'Content-Type': 'multipart/form-data'
                                }
                              });
                              if (response.data) {
                                setItem(response.data);
                                alert('Assignment submitted successfully!');
                              }
                            } catch (err) {
                              console.error(err);
                              alert('Failed to submit assignment');
                            }
                          }}
                        />
                        <button 
                          className="upload-btn"
                          onClick={() => document.getElementById('taskSubmission').click()}
                        >
                          Upload Assignment (PDF only)
                        </button>
                        <button 
                          className="submit-btn"
                          disabled={!item?.submission}
                          onClick={async () => {
                            try {
                              const response = await axios.post(`/api/task/${item._id}/finalize`, {}, {
                                headers: {
                                  token: `Bearer ${user.accessToken}`
                                }
                              });
                              if (response.data) {
                                setItem(response.data);
                                alert('Assignment submitted successfully!');
                              }
                            } catch (err) {
                              console.error(err);
                              alert('Failed to submit assignment');
                            }
                          }}
                        >
                          Submit
                        </button>
                      )}
                        </div>
                      )}
                      {item?.submissions?.find(s => s.student._id === user._id)?.status === 'rejected' && (
                        <p className="rejection-message">Your submission was rejected. Please upload a new assignment.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <IconButton
            className="moreBtn"
            ref={moreBtn}
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
            onClose={handleCloseMore}
            open={openMore}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            {moreOptions.map((option) => (
              <MenuItem key={option} value={option} onClick={handleOptionCLick}>
                {option}
              </MenuItem>
            ))}
          </Menu>

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
                Do you want to delete <b>{item?.title + " ?"}</b>
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
        </div>
      ) : (
        <>
          {(user._id === item?.poster._id || user.isAdmin) && (
            <ItemForm
              type={type}
              editForm
              open={openEditForm}
              setOpenEditForm={setOpenEditForm}
              data={item || data}
              setData={setItem}
            />
          )}
        </>
      )}
    </>
  );
};

export default DetailedItem;