import React from "react";

const AboutUs = () => {
  const styles = {
    container: {
      width: "100%",
      height: "100%",
    },
    card: {
      maxWidth: "750px",
      width: "100%",
      backgroundColor: "rgba(255,255,255,0.97)",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "24px",
      direction: "rtl", // Added for Hebrew text
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "24px",
    },
    text: {
      fontSize: "16px",
      color: "#4a5568",
      lineHeight: "1.8",
      textAlign: "right", // Added for Hebrew text
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="h-full">
        <h2 style={styles.title}>אודותינו 🧮</h2>
        <div style={styles.text}>
          <p>
            אנחנו קבוצה של צעירים נלהבים שחרטו על דגלם מטרה חשובה: להפוך את
            המתמטיקה לנגישה, מובנת ומהנה יותר עבור כולם. אנו מאמינים שכל אחד
            יכול להצליח במתמטיקה כשמקבלים את הכלים והתמיכה המתאימים.
          </p>
          <p style={{ marginTop: "16px" }}>
            הצוות שלנו מורכב ממורים מנוסים, סטודנטים מצטיינים ומומחי חינוך,
            שמבינים את האתגרים העומדים בפני תלמידים בלימודי המתמטיקה. אנחנו
            משלבים שיטות הוראה חדשניות עם טכנולוגיה מתקדמת כדי ליצור חווית למידה
            מותאמת אישית ואפקטיבית.
          </p>
          <p style={{ marginTop: "16px" }}>
            המטרה שלנו היא לא רק לעזור לתלמידים להצליח במבחנים, אלא גם לפתח אצלם
            אהבה אמיתית למתמטיקה, ביטחון עצמי ויכולת חשיבה אנליטית שתשרת אותם
            בכל תחומי החיים. אנחנו מזמינים אתכם להצטרף אלינו למסע מרתק של גילוי
            והבנה בעולם המתמטיקה.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
