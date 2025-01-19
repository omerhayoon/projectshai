import React, { useState, useEffect } from "react";
import { axios } from "../utils/axiosConfig";
import "../CSS/Reviews.css";
const isHebrew = (text) => {
  const hebrewPattern = /[\u0590-\u05FF]/; // Hebrew Unicode range
  return hebrewPattern.test(text);
};
const Reviews = ({ username }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [error, setError] = useState("");

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    console.log("entered fetchReviews");
    try {
      const response = await axios.get("/api/reviews");
      if (response.request.status === 200) {
        console.log("Entered response");
        console.log(response.data);
        setReviews(response.data);
      }
      console.log(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log(newReview);
    console.log(username);

    if (!newReview.trim()) return; // Prevent empty reviews

    try {
      const response = await axios.post("/api/reviews", {
        username: username,
        content: newReview,
      });

      if (response.status === 200 || response.status === 201) {
        setNewReview(""); // Clear the input field
        fetchReviews(); // Refresh the reviews list
      } else {
        setError("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      setError("Failed to add review");
    }
  };

  return (
    <div className="reviews-section">
      <h2>Customer's review ❤️</h2>

      {/* Reviews List */}
      <div className="reviews-list">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <strong>
                  <td>{review.username}</td>
                </strong>
                <td dir={isHebrew(review.content) ? "rtl" : "ltr"}>
                  {review.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Form - Only shown to logged-in users */}
      {username.length > 0 && (
        <div className="review-form">
          <form onSubmit={handleSubmit}>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
              className="review-input"
              required
            />
            <button type="submit" className="submit-review">
              Add Review
            </button>
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Reviews;
