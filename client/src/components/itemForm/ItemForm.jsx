import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import dummyProfilePic from "../../assets/dummyProfilePic.png";
import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import { AuthContext } from "../../context/authContext/AuthContext";
import { SubjectsContext } from "../../context/subjectsContext/SubjectsContext";
import { MaterialsContext } from "../../context/materialsContext/MaterialsContext";
import { TasksContext } from "../../context/tasksContext/TasksContext";
import { DoubtsContext } from "../../context/doubtsContext/DoubtsContext";
import {
  createNewMaterial,
  updateMaterial,
} from "../../context/materialsContext/apiCalls";
import { createNewTask, updateTask } from "../../context/tasksContext/apiCalls";
import {
  createNewDoubt,
  updateDoubt,
} from "../../context/doubtsContext/apiCalls";

const ItemForm = ({
  type,
  profilePic,
  currentSubject,
  editForm,
  open,
  setOpenEditForm,
  data,
  setData,
}) => {
  const placeholders = {
    material: "Create new material",
    task: "Assign new task",
    doubt: "Ask your doubt",
  };

  const [onFocus, setOnFocus] = useState(open || false);
  const [formdata, setFormdata] = useState({
    title: data?.title || "",
    description: data?.description || "",
    subject: data?.subject?.name || currentSubject || "",
    attachments: data?.attachments || [],
    dueDatetime: data?.dueDatetime || "",
    points: data?.points || "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    subject: "",
    attachments: "",
    dueDatetime: "",
    points: "",
  });
  const [filesLeftForUpload, setFilesLeftForUpload] = useState(0);

  const { user } = useContext(AuthContext);
  const { subjects } = useContext(SubjectsContext);
  const { dispatch: materialsDispatch } = useContext(MaterialsContext);
  const { dispatch: tasksDispatch } = useContext(TasksContext);
  const { dispatch: doubtsDispatch } = useContext(DoubtsContext);

  useEffect(() => {
    if (currentSubject) {
      setFormdata({ ...formdata, subject: currentSubject });
      setFormErrors({ ...formErrors, subject: "" });
    }
  }, [currentSubject]);

  const handleChange = ({ target: { name, value } }) => {
    setFormdata({ ...formdata, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const upload = async (items) => {
    for (const item of items) {
      const formData = new FormData();
      formData.append("file", item);
      formData.append("upload_preset", "unsigned_upload");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        setFormdata((prev) => ({
          ...prev,
          attachments: [...prev.attachments, { filename: item.name, link: data.secure_url }],
        }));
        setFilesLeftForUpload((prev) => prev - 1);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const handleUpload = ({ target: { files } }) => {
    setFormErrors({ ...formErrors, attachments: "" });
    setFilesLeftForUpload(files.length);
    const filesData = Array.from(files);
    upload(filesData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "doubtResponse" && formdata.description === "") {
      setFormErrors({ ...formErrors, description: "Answer can't be empty" });
      return;
    } else if (formdata.title === "" && type !== "doubtResponse") {
      setFormErrors({ ...formErrors, title: `${type} title can't be empty` });
      return;
    } else if (formdata.subject === "" && type !== "doubtResponse") {
      setFormErrors({ ...formErrors, subject: "Choose a subject" });
      return;
    } else if (formdata.description === "") {
      setFormErrors({ ...formErrors, description: "Write a description" });
      return;
    } else if (
      (type === "material" || type === "task") &&
      formdata.attachments.length === 0
    ) {
      setFormErrors({ ...formErrors, attachments: "Add attachment" });
      return;
    }

    let item = { ...formdata };
    const subjectObj = subjects.find((obj) => obj.name === item.subject);
    if (subjectObj) {
      item.subject = subjectObj._id;
      item.course = subjectObj.course;
      item.semester = subjectObj.semester;
    }

    if (type === "material" || type === "doubt" || type === "doubtResponse") {
      delete item.dueDatetime;
      delete item.points;
    }
    if (type === "doubt" || type === "doubtResponse") {
      delete item.attachments;
    }
    if (type === "doubtResponse") {
      delete item.title;
      delete item.subject;
      delete item.course;
      delete item.semester;
    }

    console.log("Submitting:", item);
    if (editForm) {
      item._id = data._id;
      if (type === "material") {
        updateMaterial(item, user, materialsDispatch).then((updatedData) =>
          setData(updatedData)
        );
      } else if (type === "task") {
        updateTask(item, user, tasksDispatch).then((updatedData) =>
          setData(updatedData)
        );
      } else if (type === "doubt") {
        updateDoubt(item, user, doubtsDispatch).then((updatedData) =>
          setData(updatedData)
        );
      }
      setOpenEditForm(false);
    } else {
      if (type === "material") createNewMaterial(item, user, materialsDispatch);
      else if (type === "task") createNewTask(item, user, tasksDispatch);
      else if (type === "doubt") createNewDoubt(item, user, doubtsDispatch);
      setOnFocus(false);
    }

    setFormdata({
      title: "",
      description: "",
      subject: "",
      attachments: [],
      dueDatetime: "",
      points: "",
    });
  };

  const handleClose = (e) => {
    if (editForm) setOpenEditForm(false);
    else setOnFocus(false);
  };

  return (
    <div
      className={
        "itemForm " +
        (onFocus ? "onFocus" : "ofFocus") +
        (editForm ? " editForm" : "")
      }
    >
      <div className="beforeFocus">
        <img src={profilePic || dummyProfilePic} alt="profile" />
        <input
          type="text"
          placeholder={placeholders[type]}
          onClick={() => setOnFocus(true)}
        />
      </div>

      <div className="afterFocus">
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {type === "doubtResponse" ? (
              <Grid item xs={12}>
                <TextField
                  label="Answer"
                  name="description"
                  value={formdata.description}
                  onChange={handleChange}
                  autoComplete="answer"
                  multiline
                  variant="filled"
                  rows={3}
                  fullWidth
                  required
                  error={!!formErrors.description}
                  helperText={formErrors.description || "Write your answer"}
                  FormHelperTextProps={{
                    style: { fontFamily: "Inter", fontSize: 13, fontWeight: "500" },
                  }}
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} lg={8}>
                  <TextField
                    autoComplete="title"
                    name="title"
                    required
                    fullWidth
                    label={`${type.charAt(0).toUpperCase() + type.slice(1)} title`}
                    value={formdata.title}
                    onChange={handleChange}
                    autoFocus
                    variant="outlined"
                    error={!!formErrors.title}
                    helperText={formErrors.title || `Give title for your ${type}`}
                    FormHelperTextProps={{
                      style: { fontFamily: "Inter", fontSize: 13, fontWeight: "500" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={4}>
                  <TextField
                    label="Subject"
                    name="subject"
                    value={formdata.subject}
                    onChange={handleChange}
                    select
                    required
                    fullWidth
                    variant="outlined"
                    error={!!formErrors.subject}
                    helperText={formErrors.subject || "Select subject"}
                    FormHelperTextProps={{
                      style: { fontFamily: "Inter", fontSize: 13, fontWeight: "500" },
                    }}
                  >
                    {subjects.map((option) => (
                      <MenuItem key={option._id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={formdata.description}
                    onChange={handleChange}
                    autoComplete="description"
                    multiline
                    variant="filled"
                    rows={3}
                    fullWidth
                    required
                    error={!!formErrors.description}
                    helperText={formErrors.description || "Add a description"}
                    FormHelperTextProps={{
                      style: { fontFamily: "Inter", fontSize: 13, fontWeight: "500" },
                    }}
                  />
                </Grid>
              </>
            )}

            {(type === "material" || type === "task") && (
              <Grid container item xs={12} lg={5} spacing={2}>
                <Grid item xs={12} lg={6}>
                  <LoadingButton
                    variant="contained"
                    component="label"
                    style={{ textTransform: "none" }}
                    disableElevation
                    startIcon={<PublishRoundedIcon />}
                    loading={filesLeftForUpload > 0}
                    loadingPosition="start"
                    color={formErrors.attachments ? "error" : "primary"}
                  >
                    Upload file
                    <input type="file" hidden multiple onChange={handleUpload} />
                  </LoadingButton>
                  {formErrors.attachments ? (
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: "red",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.attachments}
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: "#919191",
                        marginTop: "4px",
                      }}
                    >
                      Upload attachments
                    </p>
                  )}
                </Grid>
              </Grid>
            )}

            {type === "task" && (
              <>
                <Grid item xs={12} lg={4}>
                  <TextField
                    name="dueDatetime"
                    fullWidth
                    label="Due date & time (optional)"
                    value={formdata.dueDatetime}
                    onChange={handleChange}
                    variant="filled"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    helperText="Mention due date with time (Optional)"
                    FormHelperTextProps={{
                      style: { fontFamily: "Inter", fontSize: 13, fontWeight: "500" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={3}>
                  <TextField
                    autoComplete="points"
                    name="points"
                    fullWidth
                    label="Points (optional)"
                    value={formdata.points}
                    onChange={handleChange}
                    variant="outlined"
                    type="number"
                    helperText="Points for this task"
                    FormHelperTextProps={{
                      style: { fontFamily: "Inter", fontSize: 13, fontWeight: "500" },
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                style={{ marginRight: "20px", textTransform: "capitalize" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                style={{
                  background: "#646cff",
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                {editForm ? "Update" : "Create"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default ItemForm;