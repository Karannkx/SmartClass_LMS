import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import Navbar from "../../components/navbar/Navbar";
import HomeWidget from "../../components/homeWidget/HomeWidget";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../context/authContext/AuthContext";
import { MaterialsContext } from "../../context/materialsContext/MaterialsContext";
import { TasksContext } from "../../context/tasksContext/TasksContext";
import { SchedulesContext } from "../../context/schedulesContext/SchedulesContext";
import { DoubtsContext } from "../../context/doubtsContext/DoubtsContext";
import { getRecentMaterials } from "../../context/materialsContext/apiCalls";
import { getRecentTasks } from "../../context/tasksContext/apiCalls";
import { getRecentDoubts } from "../../context/doubtsContext/apiCalls";
import { getSchedules } from "../../context/schedulesContext/apiCalls";
import HeroSection from "../../components/heroSection/HeroSection";
import SubjectForm from "../../components/subjectForm/SubjectForm";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { recentMaterials, dispatch: materialsDispatch } = useContext(MaterialsContext);
  const { recentTasks, dispatch: tasksDispatch } = useContext(TasksContext);
  const { schedules, dispatch: schedulesDispatch } = useContext(SchedulesContext);
  const { recentDoubts, dispatch: doubtsDispatch } = useContext(DoubtsContext);
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  useEffect(() => {
    if (recentMaterials?.length < 3 && user) {
      getRecentMaterials(user, materialsDispatch);
    }
  }, [recentMaterials?.length, materialsDispatch, user]);

  useEffect(() => {
    if (recentTasks?.length < 3 && user) {
      getRecentTasks(user, tasksDispatch);
    }
  }, [recentTasks?.length, tasksDispatch, user]);

  useEffect(() => {
    if (schedules?.length < 3 && user) {
      getSchedules(user, schedulesDispatch);
    }
  }, [schedules?.length, schedulesDispatch, user]);

  useEffect(() => {
    if (recentDoubts?.length < 3 && user) {
      getRecentDoubts(user, doubtsDispatch);
    }
  }, [recentDoubts?.length, doubtsDispatch, user]);

  return (
    <div className="home">
      <Navbar />
      <Sidebar />
      <div className="container">
        {(user.isTeacher || user.isAdmin) && (
          <div className="create-subject-section">
            <div className="subject-btn-wrapper">
              <button
                onClick={() => setShowSubjectForm(!showSubjectForm)}
                className="create-subject-icon-btn"
              >
                {showSubjectForm ? "×" : "+"}
              </button>
              {!showSubjectForm && (
                <div className="subject-tooltip">Create New Subject</div>
              )}
            </div>

            {showSubjectForm && (
              <div className="subject-form-wrapper">
                <SubjectForm />
              </div>
            )}
          </div>
        )}

        <HeroSection large title="Welcome to WebDesk" />

        <div className="widgets-row">
          <HomeWidget
            title="Notes & Materials"
            type="materials"
            items={recentMaterials}
            link="/materials"
            itemList={recentMaterials}
          />
          <HomeWidget
            title="Tasks & Assignments"
            type="tasks"
            items={recentTasks}
            link="/tasks"
            itemList={recentTasks}
          />
        </div>

        <div className="widgets-row">
          <HomeWidget
            title="Class Schedule"
            type="schedules"
            items={schedules}
            link="/createclass"
            itemList={schedules}
          />
          <HomeWidget
            title="Doubts & Questions"
            type="doubts"
            items={recentDoubts}
            link="/doubts"
            itemList={recentDoubts}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
