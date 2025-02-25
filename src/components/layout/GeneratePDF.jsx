import React from "react";
import pdfMake from "pdfmake/build/pdfmake.min";

// Configure fonts
pdfMake.fonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

const GeneratePDF = ({ data, generate = false, closePrint = () => {} }) => {
  function calculateGPA(obtainedMarks, fullMarks) {
    if (!obtainedMarks) {
      return " - ";
    }

    if (!fullMarks || fullMarks === 0) {
      return " - ";
    }

    if (fullMarks === 0) {
      return " - ";
    }

    if (obtainedMarks > fullMarks) {
      return "Error";
    }

    const percentage = (obtainedMarks / fullMarks) * 100;
    const gpa = (percentage / 100) * 4.0;

    return parseFloat(gpa.toFixed(2));
  }

  function calculateTotalGPA(theory, practical, obtainedMarks, obtainedMarks2) {
    if (!obtainedMarks) {
      return {
        gpa: " - ",
        gradePoint: " - ",
      };
    }

    if (!obtainedMarks2 && practical && practical > 0) {
      return {
        gpa: " - ",
        gradePoint: " - ",
      };
    }

    if (obtainedMarks2 && practical && obtainedMarks2 > practical) {
      return {
        gpa: " - ",
        gradePoint: " - ",
      };
    }

    // Validate inputs
    if (theory <= 0 || obtainedMarks < 0 || obtainedMarks > theory) {
      return {
        gpa: " - ",
        gradePoint: " - ",
      };
    }

    const totalFullMarks =
      theory + (practical && practical > 0 ? practical : 0);
    const totalObtainedMarks =
      obtainedMarks +
      (practical > 0 && obtainedMarks2 && obtainedMarks2 <= practical
        ? obtainedMarks2
        : 0);

    // Calculate the final GPA (on a 4.0 scale)
    const finalGPA = parseFloat(
      ((totalObtainedMarks / totalFullMarks) * 4).toFixed(2)
    );

    return {
      gpa: finalGPA,
      gradePoint:
        finalGPA >= 3.6
          ? "A+"
          : finalGPA >= 3.2
          ? "A"
          : finalGPA >= 2.8
          ? "B+"
          : finalGPA >= 2.4
          ? "B"
          : finalGPA >= 2.0
          ? "C+"
          : finalGPA >= 1.6
          ? "C"
          : finalGPA >= 1.2
          ? "D+"
          : finalGPA >= 0.8
          ? "D"
          : "E",
    };
  }

  // this is the very last one
  function calculateOverallGPA(subjects) {
    // Validate input
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return { gpa: "-", gradePoint: "-" };
    }

    // Initialize variables to track total marks
    let totalFullMarks = 0;
    let totalObtainedMarks = 0;

    for (const subject of subjects) {
      const { theory, practical, obtainedMarks, obtainedMarks2 } = subject;

      // Skip subjects with invalid marks
      if (theory <= 0 || obtainedMarks < 0 || obtainedMarks > theory) {
        continue;
      }

      // Add to total marks
      totalFullMarks += theory + (practical && practical > 0 ? practical : 0);
      totalObtainedMarks +=
        obtainedMarks +
        (practical > 0 && obtainedMarks2 && obtainedMarks2 <= practical
          ? obtainedMarks2
          : 0);
    }

    // Handle case with no valid marks
    if (totalFullMarks === 0) {
      return { gpa: "-", gradePoint: "-" };
    }

    // Calculate the final GPA
    const finalGPA = parseFloat(
      ((totalObtainedMarks / totalFullMarks) * 4).toFixed(2)
    );

    // Determine grade point
    const gradePoint =
      finalGPA >= 3.6
        ? "A+"
        : finalGPA >= 3.2
        ? "A"
        : finalGPA >= 2.8
        ? "B+"
        : finalGPA >= 2.4
        ? "B"
        : finalGPA >= 2.0
        ? "C+"
        : finalGPA >= 1.6
        ? "C"
        : finalGPA >= 1.2
        ? "D+"
        : finalGPA >= 0.8
        ? "D"
        : "E";

    return { gpa: finalGPA, gradePoint };
  }

  const generatePdf = () => {
    const docDefinition = {
      content: [],

      // [

      // ],

      styles: {
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: "#2C3E50",
          alignment: "left",
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          color: "#FFFFFF",
          // alignment: "center",
        },
        studentInfoLabel: {
          fontSize: 11,
          bold: true,
          color: "#2C3E50",
        },
        studentInfoValue: {
          fontSize: 11,
          color: "#34495E",
        },
        gradingHeader: {
          fontSize: 14,
          bold: true,
          color: "#2C3E50",
        },
        commentHeader: {
          fontSize: 14,
          bold: true,
          color: "#2C3E50",
        },
      },

      defaultStyle: {
        fontSize: 11,
        color: "#2C3E50",
      },

      pageSize: "A4",
      pageMargins: [40, 40, 40, 40],
    };

    data.forEach((item, index) => {
      const { schoolInfo, studentInfo, subjects } = item;
      docDefinition.content.push(
        // Header with School Name and Report Card Title
        {
          stack: [
            {
              text: schoolInfo.name.toUpperCase(),
              fontSize: 20,
              bold: true,
              alignment: "center",
              color: "#2C3E50",
              margin: [0, 0, 0, 5],
            },
            {
              text: schoolInfo.address,
              bold: true,
              fontSize: 12,
              alignment: "center",
              color: "#34495E",
              margin: [0, 5, 0, 0],
            },
            {
              text: "Academic Report Card",
              bold: true,
              fontSize: 13,
              alignment: "center",
              color: "#34495E",
              margin: [0, 5, 0, 20],
            },
          ],
        },

        {
          style: "studentInfo",
          table: {
            widths: [150, "*"],
            body: [
              [
                {
                  text: "Student Name :",
                  style: "studentInfoLabel",
                  margin: [10, 10, 0, 10], // Reduced margin by 20%
                },
                {
                  text: studentInfo.name,
                  style: "studentInfoValue",
                  margin: [10, 10, 0, 10], // Reduced margin by 20%
                },
              ],
              [
                {
                  text: "Class / Section :",
                  style: "studentInfoLabel",
                  margin: [10, 10, 0, 10], // Reduced margin by 20%
                },
                {
                  text: `${studentInfo.class} / ${studentInfo.section}`,
                  style: "studentInfoValue",
                  margin: [10, 10, 0, 10], // Reduced margin by 20%
                },
              ],
              [
                {
                  text: "Year / Term",
                  style: "studentInfoLabel",
                  margin: [10, 10, 0, 10], // Reduced margin by 20%
                },
                {
                  text: "2071 / 2nd",
                  style: "studentInfoValue",
                  margin: [10, 10, 0, 10], // Reduced margin by 20%
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i) {
              return 0.5;
            },
            vLineWidth: function (i) {
              return 0.5;
            },
            hLineColor: function (i) {
              return "#E8EDF2";
            },
            vLineColor: function (i) {
              return "#E8EDF2";
            },
            fillColor: function (rowIndex) {
              return rowIndex % 2 === 0 ? "#F8FAFC" : null;
            },
          },
        },

        // Academic Performance Header
        {
          text: "",
          style: "sectionHeader",
          margin: [0, 20, 0, 0],
        },

        // Grades Table with enhanced spacing

        {
          table: {
            headerRows: 1,
            widths: ["*", 70, 70, 70, 70],
            body: [
              [
                {
                  text: "SUBJECT",
                  style: "tableHeader",
                  margin: [10, 8, 10, 8],
                },
                {
                  text: "Theory",
                  style: "tableHeader",
                  margin: [0, 8, 0, 8],
                },
                {
                  text: "Practical",
                  style: "tableHeader",
                  margin: [0, 8, 0, 8],
                },
                {
                  text: "Final Grade",
                  style: "tableHeader",
                  margin: [0, 8, 0, 8],
                },
                {
                  text: "Grade Point",
                  style: "tableHeader",
                  margin: [0, 8, 0, 8],
                },
              ],
              ...subjects.map((subject) => [
                { text: subject.name, margin: [10, 8, 0, 8] },
                {
                  text: calculateGPA(subject.obtainedMarks, subject.theory),
                  // alignment: "center",
                  margin: [0, 8, 0, 8],
                },
                {
                  text: calculateGPA(subject.obtainedMarks2, subject.practical),
                  // alignment: "center",
                  margin: [0, 8, 0, 8],
                },
                {
                  text: calculateTotalGPA(
                    subject.theory,
                    subject.practical,
                    subject.obtainedMarks,
                    subject.obtainedMarks2
                  ).gpa,
                  // alignment: "center",
                  margin: [0, 8, 0, 8],
                },
                {
                  text: calculateTotalGPA(
                    subject.theory,
                    subject.practical,
                    subject.obtainedMarks,
                    subject.obtainedMarks2
                  ).gradePoint,
                  // alignment: "center",
                  margin: [0, 8, 0, 8],
                  bold: true,
                },
              ]),
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === 1 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 1;
            },
            hLineColor: function (i, node) {
              return i === 0 || i === 1 || i === node.table.body.length
                ? "#2C3E50"
                : "#E8EDF2";
            },
            vLineColor: function () {
              return "#E8EDF2";
            },
            fillColor: function (rowIndex) {
              return rowIndex === 0
                ? "#2C3E50"
                : rowIndex % 2 === 1
                ? "#F8FAFC"
                : null;
            },
          },
        },

        // Footer For Final Grade

        {
          style: "studentInfo",
          table: {
            widths: ["*", 150, "*", 150], // Defining 4 columns
            body: [
              [
                {
                  text: "GPA :",
                  style: "studentInfoLabel",
                  margin: [8, 8, 0, 8],
                },
                {
                  text: calculateOverallGPA(subjects).gpa,
                  style: "studentInfoValue",
                  margin: [8, 8, 0, 8],
                },
                {
                  text: "FINAL GRADE :",
                  style: "studentInfoLabel",
                  margin: [8, 8, 0, 8],
                },
                {
                  text: calculateOverallGPA(subjects).gradePoint,
                  style: "studentInfoValue",
                  margin: [8, 8, 0, 8],
                },
              ],
            ],
          },
          margin: [0, 20, 0, 0], // Adding margin above and below the table
          layout: {
            hLineWidth: function (i) {
              return 0.5;
            },
            vLineWidth: function (i) {
              return 0.5;
            },
            hLineColor: function (i) {
              return "#E8EDF2";
            },
            vLineColor: function (i) {
              return "#E8EDF2";
            },
            fillColor: function (rowIndex) {
              return rowIndex % 2 === 0 ? "#F8FAFC" : null;
            },
          },
        },

        // school stamp and signature

        {
          style: "studentInfo",
          table: {
            widths: ["*", "*"], // Two columns of equal width
            body: [
              [
                {
                  border: [true, true, true, true], // Adding a border to form a box
                  text: "",
                  style: "studentInfoBox",
                  margin: [0, 0, 0, 80], // Spacing around the box
                },
                {
                  border: [true, true, true, true], // Adding a border to form a box
                  text: "",
                  style: "studentInfoBox",
                  margin: [0, 0, 0, 80], // Spacing around the box
                },
              ],
              [
                {
                  text: "School Stamp", // Box label for school stamp
                  style: "studentInfoLabel",
                  alignment: "center",
                  margin: [0, 10, 0, 10],
                },
                {
                  text: "Principal's Sign", // Box label for principal's sign
                  style: "studentInfoLabel",
                  alignment: "center",
                  margin: [0, 10, 0, 10],
                },
              ],
            ],
          },
          margin: [0, 0, 0, 20], // Adding margin above and below the table
          layout: {
            hLineWidth: function (i) {
              return 0.5;
            },
            vLineWidth: function (i) {
              return 0.5;
            },
            hLineColor: function (i) {
              return "#E8EDF2";
            },
            vLineColor: function (i) {
              return "#E8EDF2";
            },
            fillColor: function (rowIndex) {
              return rowIndex % 2 === 0 ? "#F8FAFC" : null;
            },
          },
        },

        // Page Break
        data.length === index + 1 ? "" : { text: "", pageBreak: "after" }
      );
    });

    pdfMake.createPdf(docDefinition).open();
  };


  if (generate) {
    generatePdf();
    closePrint();
  }


  return (
    <>
      {!generate && (
        <button
          className="bg-gray-500 text-white flex items-center space-x-2 py-2 border border-gray-500 rounded-lg hover:bg-gray-600 transition-colors duration-200 px-[60px]"
          onClick={generatePdf}
        >
          <i className="fas fa-print text-gray-600"></i>
          <span>Print PDF</span>
        </button>
      )}
    </>
  );
};

export default GeneratePDF;
