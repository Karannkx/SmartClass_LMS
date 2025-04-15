import React, { useContext } from "react";
import "./style.scss";
import heroImg from "../../assets/heroimg.jpg";
import { AuthContext } from "../../context/authContext/AuthContext";

const HeroSection = ({ small, large, title, dept, sem }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={"heroSection " + (large ? "large" : "small")}>
      <div className="heroSection-content">
        <div className="left">
        {large && <img src={heroImg} alt="heroimage" style={{ width: '150px', height: '150px' }} />}
        </div>

        <div className="right">
          {/* <h3>
            {small
              ? dept + " " + sem + " sem"
              : `Hey ${user?.fullname.split(" ")[0]}!`}
          </h3> */}
          <h1>Welcome to SmartClass</h1>
          {large && (
            <p>
              All your class schedule, notes, tasks, and doubts will be managed and updated 
              here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
