import React, { useEffect, useRef, useState } from "react";

const initialReviews = [
  { name: "יוסי כהן", content: "האתר ממש עזר לי להבין הסתברות, קיבלתי 95 בבגרות!" },
  { name: "דנה לוי", content: "ההסברים היו ברורים מאוד, ממליצה לכל מי שלומד מתמטיקה." },
  { name: "אייל שמעוני", content: "תודה רבה! סוף סוף הבנתי מה זה אינדוקציה מתמטית." },
  { name: "נופר אזולאי", content: "שיעורים מעולים, קל להבין את החומר!" },
  { name: "רועי מלכה", content: "האתר הציל אותי לפני מבחן, תודה!" },
  { name: "מיכל רוזן", content: "אהבתי מאוד את הדרך שבה מוסבר החומר, ממש ברור." },
  { name: "אור בן דוד", content: "התרגולים באתר מעולים, עזר לי לשפר את הציונים." },
  { name: "גלית קצב", content: "אני מרגישה הרבה יותר מוכנה לבגרות במתמטיקה!" },
  { name: "תומר שפירא", content: "ההסברים בנושא הסתברות פשוט מדהימים!" },
  { name: "ליאן נחום", content: "הפלטפורמה מאוד נוחה לשימוש וללמידה עצמית." },
  { name: "עדי מזרחי", content: "לא האמנתי שאני אצליח להבין חדו״א כל כך טוב!" },
  { name: "יונתן ברק", content: "האתר מלא בתוכן איכותי, שווה כל רגע של למידה." },
  { name: "שירה קפלן", content: "למדתי המון בזכות האתר, תודה רבה!" },
  { name: "נועם אלוני", content: "מערכת מושלמת לתרגול מתמטיקה, ממליץ מאוד!" },
  { name: "עומר גולן", content: "עזר לי לקבל 100 בבגרות במתמטיקה! אתר מעולה!" },
];

const ReviewsTable = () => {
  const tableRef = useRef(null);
  const [reviews, setReviews] = useState(initialReviews);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (tableRef.current) {
        setScrollPosition((prevPos) => {
          const maxScroll = tableRef.current.scrollHeight - tableRef.current.clientHeight;
          const newPos = prevPos + 2;
          return newPos >= maxScroll ? 0 : newPos;
        });
        tableRef.current.scrollTop = scrollPosition;
      }
    }, 50);
    return () => clearInterval(scrollInterval);
  }, [scrollPosition]);

  const addReview = () => {
    if (name.trim() && content.trim()) {
      setReviews((prevReviews) => {
        const updatedReviews = [...prevReviews, { name, content }];
        setTimeout(() => {
          if (tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight;
          }
        }, 100);
        return updatedReviews;
      });
      setName("");
      setContent("");
    }
  };

  return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto" dir="rtl">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">ביקורות תלמידים</h2>
        <div className="mb-4 flex gap-2">
          <input
              type="text"
              className="border p-2 rounded w-1/3"
              placeholder="שם"
              value={name}
              onChange={(e) => setName(e.target.value)}
          />
          <input
              type="text"
              className="border p-2 rounded w-2/3"
              placeholder="ביקורת"
              value={content}
              onChange={(e) => setContent(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addReview}>הוסף</button>
        </div>
        <div ref={tableRef} className="max-h-96 overflow-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-right border-b-2 border-blue-800 w-1/4">שם</th>
              <th className="p-3 text-right border-b-2 border-blue-800">ביקורת</th>
            </tr>
            </thead>
            <tbody>
            {reviews.map((review, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="p-4 border-b border-gray-200 font-bold text-blue-800">{review.name}</td>
                  <td className="p-4 border-b border-gray-200">{review.content}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default ReviewsTable;
