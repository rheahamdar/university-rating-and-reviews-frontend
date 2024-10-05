import React, { useState, useEffect } from "react";
import "./ReviewPage.css"; 
import reviewImage from '../Assets/review2.png';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const ReviewPage = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');

  React.useEffect(() => {
    document.body.style.background = 'none';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  const COURSE_TYPE = [
    "NATURAL_SCIENCE",
    "SOCIAL_SCIENCE1",
    "SOCIAL_SCIENCE2",
    "CMPS_ELECTIVE",
    "CMPS_MAJOR",
    "CMPS_MINOR",
    "CHEM_ELECTIVE",
    "CHEM_MAJOR",
    "CHEM_MINOR",
    "BIO_ELECTIVE",
    "BIO_MAJOR",
    "BIO_MINOR",
    "HUMANITIES1",
    "HUMANITIES2",
    "CHLA1",
    "CHLA2",
    "ARAB",
    "MATH_MAJOR",
    "MATH_ELECTIVE",
    "MATH_MINOR",
    "ENGL_MAJOR",
    "ENGL_MINOR",
    "ENGL_ELECTIVE",
    "ENGL_REQUIREMENT",
    "HIST_MAJOR",
    "HIST_MINOR",
    "HIST_ELECTIVE"
  ];

  const COURSE_NAME = [
    'CMPS',
    'ECON',
    'BUSS',
    'BIO',
    'CHEM',
    'MATH',
    'PHYS',
    'ENGL',
    'CHLA',
    'HIST',
    'GEOL',
    'ARAB',
    'EECE',
    'CCE',
    'INDE',
    'MRKT',
    'MECH',
    'MUSC',
    'PHIL',
    'STAT'
  ];

  const PROFESSOR_NAME = [
    'HAIDAR_SAFA',
    'FATIMA_ABU_SALEM',
    'MAURICE_KHABBAZ',
    'WADI_JUREIDI',
    'RAHEEL_SAEED',
    'RIDA_ASSAF',
    'IZZAT_ELHAJJ',
    'AMER_MOUAWAD',
    'MOHAMED_KOBEISSI',
    'WISSAM_RAJI',
    'ABBAS_ALHAKIM',
    'RYAN_JOHNSON',
    'SOHA_RIMAN',
    'RIMA_DEEB',
    'ERIC_GOODFIELD',
    'MAHER_JARRAR'
  ];

  const SEMESTER = [
    'Spring_17-18',
    'Summer_17-18',
    'Fall_18-19',
    'Spring_18-19',
    'Summer_18-19',
    'Fall_19-20',
    'Spring_19-20',
    'Summer_19-20',
    'Fall_20-21',
    'Spring_20-21',
    'Summer_20-21',
    'Fall_21-22',
    'Spring_21-22',
    'Summer_21-22',
    'Fall_22-23',
    'Spring_22-23',
    'Summer_22-23',
    'Fall_23-24',
    'Spring_23-24',
    'Summer_23-24',
    'Fall_24-25',
    'Spring_24-25',
    'Summer_24-25',
  ]
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    courseNumber: "",
    courseType: "",
    professorName: "",
    semester: "",
    courseRating: "",
    reviewText: "",
    username: localStorage.getItem('rememberedEmail') || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/reviews/create',formData);

    if (response.status === 200) {
      setShowForm(false);
      setTimeout(() => {
        setShowForm(true);
        setFormData({
          courseName: "",
          courseNumber: "",
          courseType: "",
          professorName: "",
          semester: "",
          courseRating: "",
          reviewText: "",
          username: formData.username
        });
      }, 5000);
      alert(response.data); 
      navigate('/reviews');
    } else {
      alert("Error: " + response.data);
    }
  }catch (error) {
    let errorMessage = "An error occurred during submitting the review. Please try again.";
  
    if (error.response) {
      if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data); 
      }
    } else if (error.request) {
      errorMessage = "No response from the server. Please try again.";
    }
  setError(errorMessage);
  }
  };

  const [reviews, setReviews] = useState([]);

  const handleGetReviews = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

  if (formData.courseName) params.append('courseName', formData.courseName);
  if (formData.professorName) params.append('professorName', formData.professorName);
  if (formData.courseType) params.append('courseType', formData.courseType);
  if (formData.courseNumber) params.append('courseNumber', formData.courseNumber);
  if (formData.courseRating) params.append('reviewRating', formData.courseRating);
  if (formData.semester) params.append('semester', formData.semester);
  if (formData.username) params.append('username', formData.username);

  try {
    const response = await axios.get('http://localhost:8080/reviews/search', { params });

    if (response.status === 200) {
      console.log('Reviews fetched successfully:', response.data); 
      setReviews(response.data);    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

  return (
    <div className="review-page">
      <div className="container">
      <div className="left-side">
        <h1>Submit Your Review</h1>
        <p>Share your experience by submitting a review for a course or professor and benefit others.</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Submit a Review"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="review-form">
            <select
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select the course name
              </option>
              {COURSE_NAME.map((courseName,index) => (
                <option key={index} value={courseName}>
                  {courseName}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="courseNumber"
              placeholder="Course Number"
              value={formData.courseNumber}
              min="100"
              max="500"
              step="1"
              onChange={handleChange}
              title="Please enter a number between 100 and 500"
              required
            />
           <select
              name="courseType"
              value={formData.courseType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select the course type
              </option>
              {COURSE_TYPE.map((courseType,index) => (
                <option key={index} value={courseType}>
                  {courseType.replace("_", " ")}
                </option>
              ))}
            </select>
            <select
              name="professorName"
              value={formData.professorName}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select the professor of the course
              </option>
              {PROFESSOR_NAME.map((professorName,index) => (
                <option key={index} value={professorName}>
                  {professorName.replace("_", " ")}
                </option>
              ))}
            </select>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select the semester in which you took the course
              </option>
              {SEMESTER.map((semester,index) => (
                <option key={index} value={semester}>
                  {semester.replace("_", " ")}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="courseRating"
              placeholder="Rating (1-5)"
              value={formData.courseRating}
              min="1"
              max="5"
              step="0.5"
              onChange={handleChange}
              title="Please enter a number between 1 and 5"
              required
            />
            <textarea
              name="reviewText"
              placeholder="Your Comments"
              value={formData.reviewText}
              onChange={handleChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>

      <div className="right-side">
        <img src={reviewImage} alt="Review" />
      </div>
      </div>

      <div className="container-criterias">
            <h2>Search for a review</h2>
            <p>You can select as many criterias as you want.</p>
            <p>If you want to see all the reviews, press the submit button without entering any criteria.</p>
            <form onSubmit={handleGetReviews}>
              <select
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
              >
                <option value="">
                  Select the course name
                </option>
                {COURSE_NAME.map((courseName,index) => (
                  <option key={index} value={courseName}>
                    {courseName}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="courseNumber"
                placeholder="Course Number"
                value={formData.courseNumber}
                min="100"
                max="500"
                step="1"
                onChange={handleChange}
                title="Please enter a number between 100 and 500"
            />
            <select
                name="courseType"
                value={formData.courseType}
                onChange={handleChange}
              >
                <option value="">
                  Select the course type
                </option>
                {COURSE_TYPE.map((courseType,index) => (
                  <option key={index} value={courseType}>
                    {courseType.replace("_", " ")}
                  </option>
                ))}
              </select>
              <select
                name="professorName"
                value={formData.professorName}
                onChange={handleChange}
              >
                <option value="">
                  Select the professor of the course
                </option>
                {PROFESSOR_NAME.map((professorName,index) => (
                  <option key={index} value={professorName}>
                    {professorName.replace("_", " ")}
                  </option>
                ))}
              </select>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select the semester in which you took the course
                </option>
                {SEMESTER.map((semester,index) => (
                  <option key={index} value={semester}>
                    {semester.replace("_", " ")}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="courseRating"
                placeholder="Rating (1-5)"
                value={formData.courseRating}
                min="1"
                max="5"
                step="0.5"
                onChange={handleChange}
                title="Please enter a number between 1 and 5"
            />
              <button type="submit">Submit</button>
          </form>
          
      </div>
      <div className="container-reviews">
      {reviews.length > 0 ? (
      reviews.map((review, index) => (
        <div key={index} className="review-item">
          <p>UserName: {review.username} </p>
          <p>Course: {review.courseName}</p>
          <p>Number: {review.courseNumber}</p>
          <p>Type: {review.courseType.replace("_", " ")}</p>
          <p>Professor name: {review.professorName.replace("_", " ")}</p>
          <p>Semester taken: {review.semester.replace("_"," ")}</p>
          <p>Rating: {review.courseRating}</p>
          <p>Review: {review.reviewText}</p>
        </div>
      ))
    ) : (
    <p>No reviews found for the selected criteria.</p>
  )}
      </div>
    </div>
  );
};

export default ReviewPage;