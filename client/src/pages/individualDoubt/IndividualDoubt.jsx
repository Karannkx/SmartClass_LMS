import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import { useLocation, useParams } from "react-router-dom";
import DetailedItem from "../../components/detailedItem/DetailedItem";
import { AuthContext } from "../../context/authContext/AuthContext";
import { getItemdata } from "../../utils/fetchData";

const IndividualDoubt = () => {
  const { itemData, openEdit } = useLocation();
  const [data, setData] = useState(itemData);
  const [newResponse, setNewResponse] = useState("");

  const handleSubmitResponse = async () => {
    if (!newResponse.trim()) return;
    
    try {
      const response = await fetch(`/api/doubt/${data._id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          title: `Re: ${data.title}`,
          description: newResponse,
          subject: data.subject._id,
          course: data.course,
          semester: data.semester
        })
      });

      const updatedDoubt = await response.json();
      setData(updatedDoubt);
      setNewResponse("");
    } catch (err) {
      console.error(err);
    }
  };

  const { id: itemId } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!data) {
      getItemdata("doubt", itemId, user)
        .then((response) => {
          setData(response);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const adjustTextarea = ({ target }) => {
    target.style.height = target.scrollHeight + "px";
    if (target.value === "") target.style.height = 96 + "px";
  };

  return (
    <div className="individual-doubt">
      <Navbar />
      <Sidebar />

      <div className="container">
        <div className="wrapper">
          <DetailedItem type="doubt" data={data} openEdit={openEdit} />

          {(user?.isTeacher || data?.poster?._id === user?._id) && (
            <div className="writeAnswer">
              <img
                src={user.profilePic || "/assets/dummyProfilePic.png"}
                alt="profile"
              />
              <div className="inputSection">
                <textarea
                  placeholder={`Write your ${data?.isResponse ? 'reply' : 'response'}`}
                  spellCheck="false"
                  onKeyUp={adjustTextarea}
                  onChange={(e) => setNewResponse(e.target.value)}
                  value={newResponse}
                ></textarea>
                <button onClick={handleSubmitResponse}>Submit</button>
              </div>
            </div>
          )}

          <div className="comment-heading">
            <CreateRoundedIcon className="icon" />
            <h3>Responses</h3>
          </div>

          {data?.responses?.map((response, index) => (
            <DetailedItem key={index} type="doubtResponse" data={response} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualDoubt;
