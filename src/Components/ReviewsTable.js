import React, { useEffect, useRef, useState } from "react";
import { axios } from "../utils/axiosConfig"; // adjust the import path if needed
import Swal from "sweetalert2"; // Import SweetAlert2

const ReviewsTable = ({ isLoggedIn }) => {
  const tableRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [charLimitWarning, setCharLimitWarning] = useState(false);

  // Fetch reviews when the component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  const addReview = async () => {
    // Only attempt if there's actual content
    if (!content.trim()) return;

    try {
      const payload = { content };
      const response = await axios.post("/api/reviews", payload);
      setReviews((prevReviews) => [...prevReviews, response.data]);
      setContent("");
      setCharLimitWarning(false);
      Swal.fire({
        icon: "success",
        title: "הביקורת נוספה",
        text: "הביקורת נוספה בהצלחה",
        confirmButtonText: "בסדר",
        confirmButtonColor: "#1e3a8a",
        backdrop: "rgba(0,0,0,0.4)",
        customClass: {
          popup: "rounded-lg shadow-lg",
          title: "text-blue-700 font-bold",
          content: "text-gray-600",
        },
        reverseButtons: true,
        direction: "rtl",
      });
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "info",
          title: "נא התחבר",
          text: "כדי להוסיף ביקורת, עליך להתחבר תחילה לחשבונך",
          confirmButtonText: "בסדר",
          confirmButtonColor: "#1e3a8a",
          backdrop: "rgba(0,0,0,0.4)",
          customClass: {
            popup: "rounded-lg shadow-lg",
            title: "text-blue-700 font-bold",
            content: "text-gray-600",
          },
          reverseButtons: true,
          direction: "rtl",
        });
      } else {
        console.error("Error adding review", error);
      }
    }
  };

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (tableRef.current) {
        setScrollPosition((prevPos) => {
          const maxScroll =
            tableRef.current.scrollHeight - tableRef.current.clientHeight;
          const newPos = prevPos + 2;
          return newPos >= maxScroll ? 0 : newPos;
        });
        tableRef.current.scrollTop = scrollPosition;
      }
    }, 50);
    return () => clearInterval(scrollInterval);
  }, [scrollPosition]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 100) {
      setContent(inputValue);
      setCharLimitWarning(false);
    } else {
      setContent(inputValue.slice(0, 100));
      setCharLimitWarning(true);
    }
  };

  return (
    <div className="bg-white rounded-lg h-full shadow-lg p-6" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        ביקורות תלמידים
      </h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="ביקורת"
          value={content}
          onChange={handleInputChange}
          maxLength={100}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={addReview}
        >
          הוסף
        </button>
      </div>
      {charLimitWarning && (
        <p className="text-red-500 text-sm mb-2">
          לא ניתן להזין יותר מ-100 תווים
        </p>
      )}
      <div
        ref={tableRef}
        className="max-h-96 no-scrollbar border border-gray-200 rounded-lg"
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-right border-b-2 border-blue-800 w-1/4">
                שם פרטי
              </th>
              <th className="p-3 text-right border-b-2 border-blue-800">
                ביקורת
              </th>
            </tr>
          </thead>
          <tbody className="no-scrollbar overflow-y-hidden">
            {reviews.map((review, index) => (
              <tr
                key={review.id || index}
                className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
              >
                <td className="p-4 border-b border-gray-200 font-bold text-blue-800">
                  {review.name}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {review.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsTable;
