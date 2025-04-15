// Sidebar.jsx - Calendar and subject list sidebar component with improved appearance

import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Importing authentication and subject-related context
import { AuthContext } from "../../context/authContext/AuthContext";
import { getSubjects } from "../../context/subjectsContext/apiCalls";
import { SubjectsContext } from "../../context/subjectsContext/SubjectsContext";

// Importing the widget that lists all classes below the calendar
import HomeWidget from "../homeWidget/HomeWidget";

// Importing styles specific to this sidebar component
import "./style.scss";

const Sidebar = () => {
  // Set current date as default for the calendar
  const [date, setDate] = useState(new Date());

  // Accessing user and subject context from global state
  const { user } = useContext(AuthContext);
  const { subjects, dispatch } = useContext(SubjectsContext);

  // Load subjects if not already fetched
  useEffect(() => {
    if (subjects.length === 0) {
      getSubjects(user, dispatch);
    }
  }, [dispatch]);

  // Update calendar when date changes
  const onChange = (Date) => {
    setDate(Date);
  };

  return (
    <div className="sidebar">
      <h2>Calendar</h2>
      <Calendar
        className="calendar"
        showWeekNumbers
        onChange={onChange}
        value={date}
        locale="en-US"
      />

      {/* Widget to list all subject classes */}
      <HomeWidget
        title="All Classes"
        type="all-classes"
        forLargeItems
        itemList={subjects}
        noSeeAll
      />
    </div>
  );
};

export default Sidebar;
