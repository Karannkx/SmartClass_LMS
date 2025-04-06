
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./style.scss";

export default function SubjectForm() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    semester: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await axios.post("/api/subject", {
        ...formData,
        teachers: [user._id]
      }, {
        headers: {
          token: "Bearer " + user.accessToken,
        },
      });
      
      setSuccess("Subject created successfully!");
      setFormData({ name: "", course: "", semester: "" });
      
      // Refresh the page after 2 seconds to show new subject
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data || "Error creating subject");
    }
  };

  return (
    <div className="subject-form">
      <h3>Create New Subject</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="text" 
          placeholder="Course (e.g. BCA)"
          value={formData.course}
          onChange={(e) => setFormData({...formData, course: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Semester"
          value={formData.semester}
          onChange={(e) => setFormData({...formData, semester: e.target.value})}
          required
        />
        <button type="submit">Create Subject</button>
      </form>
    </div>
  );
}
