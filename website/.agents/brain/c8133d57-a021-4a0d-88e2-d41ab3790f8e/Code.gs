// ============================================================
//  AV Academy — Google Apps Script Backend (Code.gs)
//  Handles: Live Violations | Leaderboards | Automated Emails
// ============================================================

var SHEET_NAME = "Results";
var HEADERS = [
  "Timestamp", "Email", "First Name", "Last Name",
  "State", "Age", "Score", "Total Marks", "Correct",
  "Wrong", "Unattempted", "Time Taken (s)", "Attempt #",
  "Violations", "Status", "Answers (JSON)"
];

function getSheet() {
  // 1. Target the Spreadsheet using its ID
  var ss = SpreadsheetApp.openById("11tJOE1k_C2v7kHOps7d-dmmMrhkiUA864B4Og9KnK_w");
  
  // 2. Target the specific TAB inside that spreadsheet (usually called "Results")
  var sheet = ss.getSheetByName("Results");
  
  if (!sheet) {
    sheet = ss.insertSheet("Results");
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function corsResponse(output) {
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var sheet = getSheet();
    var allData = sheet.getDataRange().getValues();

    // ── Update Violations (Live Sync) ──
    if (action === "updateViolations") {
      for (var i = allData.length - 1; i >= 1; i--) {
        if (allData[i][1] === data.email && allData[i][14] === "in-progress") {
          sheet.getRange(i + 1, 14).setValue(data.violations); // Column N (14)
          if (data.violations >= 3) {
            sheet.getRange(i + 1, 15).setValue("terminated"); // Column O (15)
          }
          return corsResponse({ ok: true, synced: true });
        }
      }
      // If no in-progress row, create one
      sheet.appendRow([
        new Date().toISOString(), data.email, "", "", "", "", 
        0, 0, 0, 0, 0, 0, 1, data.violations, "in-progress", "{}"
      ]);
      return corsResponse({ ok: true, synced: true });
    }

    // ── Start Quiz ──
    if (action === "startQuiz") {
      sheet.appendRow([
        new Date().toISOString(), data.email, data.firstName || "", data.lastName || "",
        data.state || "", data.age || "", 0, 0, 0, 0, 0, 0, 
        data.attemptNumber || 1, 0, "in-progress", "{}"
      ]);
      return corsResponse({ ok: true });
    }

    // ── Submit Quiz ──
    if (action === "submitQuiz") {
      var answers = data.answers || {};

      // Calculate score regardless of admin status so UI works normally
      var correct = data.correctCount || 0;
      var totalMarks = data.totalMarks || 200;
      var totalQuestions = Math.round(totalMarks / 5);
      var score = (data.score !== undefined && data.score !== null) ? Number(data.score) : 0;
      var wrong = Math.round((correct * 5 - score) / 6);
      var unattempted = totalQuestions - correct - wrong;
      if (unattempted < 0) unattempted = 0;
      
      var finalStatus = data.status || "submitted";
      if (finalStatus === "submitted" && (data.timeTaken || 0) < 1500) { // 25 minutes = 1500s
        finalStatus = "unfair";
      }

      // Check if admin is attempting — Skip saving and emailing
      var isAdmin = false;
      var checkEmail = (data.email || "").toLowerCase();
      if (checkEmail.indexOf("avanisehgal") !== -1 || 
          checkEmail.indexOf("nsehgal") !== -1 || 
          checkEmail.indexOf("admin") !== -1) {
        isAdmin = true;
      }

      var rowData = [
        data.timestamp || new Date().toISOString(),
        data.email, data.firstName || "", data.lastName || "",
        data.state || "", data.age || "", score, totalMarks,
        correct, wrong, unattempted, data.timeTaken || 0,
        data.attemptNumber || 1, data.violations || 0, finalStatus,
        JSON.stringify(answers)
      ];

      // Only record to spreadsheet if NOT an admin
      if (!isAdmin) {
        var rowIndex = -1;
        for (var i = allData.length - 1; i >= 1; i--) {
          if (allData[i][1] === data.email && allData[i][14] === "in-progress") {
            rowIndex = i + 1;
            break;
          }
        }

        if (rowIndex > -1) {
          if (!data.firstName) rowData[2] = allData[rowIndex-1][2];
          if (!data.lastName) rowData[3] = allData[rowIndex-1][3];
          sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([rowData]);
        } else {
          sheet.appendRow(rowData);
        }
      }

      // Calculate Rank safely for Email — deduplicate by email first (same logic as leaderboard)
      var currentStanding = "N/A";
      try {
        var freshData = sheet.getDataRange().getValues();
        
        // Step 1: Build a map of best result per email (latest submitted row wins, same as leaderboard)
        var bestByEmail = {};
        for (var k = 1; k < freshData.length; k++) {
          if (freshData[k][14] === "submitted") {
            var rowEmail = freshData[k][1];
            var rowScore = Number(freshData[k][6]);
            var rowTime  = Number(freshData[k][11]);
            // Keep the entry with the highest score; on tie, keep the fastest time
            if (!bestByEmail[rowEmail] ||
                rowScore > bestByEmail[rowEmail].s ||
                (rowScore === bestByEmail[rowEmail].s && rowTime < bestByEmail[rowEmail].t)) {
              bestByEmail[rowEmail] = { s: rowScore, t: rowTime, email: rowEmail };
            }
          }
        }
        
        // Step 2: Convert to array and sort
        var scoresList = Object.keys(bestByEmail).map(function(em) { return bestByEmail[em]; });
        scoresList.sort(function(a, b) {
          if (b.s !== a.s) return b.s - a.s; // High score first
          return a.t - b.t;                   // Low time first (tiebreak)
        });
        
        // Step 3: Find this user's rank (match by email for accuracy)
        var rank = scoresList.length; // default to last if not found
        for (var j = 0; j < scoresList.length; j++) {
          if (scoresList[j].email === data.email) {
            rank = j + 1;
            break;
          }
        }
        currentStanding = rank + " out of " + scoresList.length;
      } catch (e) {}

      // Send Email using external function only if not admin
      if (!isAdmin) {
        sendResultEmail(data, score, totalMarks, currentStanding, finalStatus);
      }

      return corsResponse({ ok: true, score: score, totalMarks: totalMarks });
    }

    return corsResponse({ ok: false, error: "Unknown action" });
  } catch (err) {
    return corsResponse({ ok: false, error: err.message });
  }
}

function doGet(e) {
  try {
    var action = e.parameter && e.parameter.action;
    var sheet = getSheet();
    var data = sheet.getDataRange().getValues();

    if (action === "getUser") {
      var email = e.parameter.email;
      var result = null;
      for (var i = data.length - 1; i >= 1; i--) {
        if (data[i][1] === email) {
          result = {
            timestamp: data[i][0], email: data[i][1], firstName: data[i][2], lastName: data[i][3],
            state: data[i][4], age: data[i][5], score: data[i][6], totalMarks: data[i][7],
            correct: data[i][8], wrong: data[i][9], unattempted: data[i][10],
            timeTaken: data[i][11], attempt: data[i][12], violations: data[i][13], status: data[i][14]
          };
          break;
        }
      }
      return corsResponse({ ok: true, result: result });
    }

    if (action === "getLeaderboard") {
      // Deduplicate by email — last submitted row per user wins (latest attempt)
      var latestByEmail = {};
      for (var i = 1; i < data.length; i++) {
        if (data[i][14] === "submitted") {
          var rowEmail = data[i][1];
          // Skip admins
          var checkEmail = (rowEmail || "").toLowerCase();
          if (checkEmail.indexOf("avanisehgal") !== -1 || checkEmail.indexOf("nsehgal") !== -1 || checkEmail.indexOf("admin") !== -1) {
            continue;
          }
          latestByEmail[rowEmail] = {
            name: (data[i][2] + " " + data[i][3]).trim(),
            score: Number(data[i][6]),
            timeTaken: Number(data[i][11]),
            state: data[i][4],
            violations: data[i][13]
          };
        }
      }

      var results = Object.keys(latestByEmail).map(function(k) { return latestByEmail[k]; });

      // Sort by score DESC, then time ASC
      results.sort(function(a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      return corsResponse({ ok: true, data: results });
    }

    return corsResponse({ ok: false, error: "Missing or invalid action" });
  } catch (err) {
    return corsResponse({ ok: false, error: err.message });
  }
}

/**
 * sendResultEmail(data, score, totalMarks, currentStanding, finalStatus)
 * Formats and dispatches a customized HTML email based on the student's ending state.
 */
function sendResultEmail(data, score, totalMarks, currentStanding, finalStatus) {
  var htmlBody;
  var emailSubject;
  var websiteLink = "https://avacademy.vercel.app";
  
  // Base CSS for professional, centered aesthetic
  var styleBlock = "style='font-family: system-ui, -apple-system, sans-serif; max-width: 500px; margin: 30px auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #1f2937; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'";
  var btnStyle = "display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 15px;";
  var name = data.firstName ? data.firstName : "Student";
  
  var chapterNames = {
    relations_functions: "Relations and Functions",
    inverse_trigonometry: "Inverse Trigonometry",
    matrices: "Matrices",
    determinants: "Determinants",
    continuity_differentiability: "Continuity & Differentiability",
    applications_of_derivative: "Applications of Derivative",
    integrals: "Integrals",
    applications_of_integrals: "Applications of Integrals",
    differential_equations: "Differential Equations",
    vectors: "Vectors",
    "3_dimensional_geometry": "3 Dimensional Geometry",
    lpp: "Linear Programming",
    probability: "Probability"
  };
  var chapterName = data.testId ? (chapterNames[data.testId] || data.testId.replace(/_/g, " ")) : "Mock Exam";
  var attemptTxt = data.attemptNumber ? (" (Attempt #" + data.attemptNumber + ")") : "";
  
  if (data.violations >= 3 || finalStatus === "terminated") {
    // Branch 1: Terminated (3 Violations)
    emailSubject = "Important: AV Academy Test Terminated - " + chapterName;
    htmlBody = "<div " + styleBlock + ">" +
      "<div style='text-align: center; margin-bottom: 20px;'><h2 style='color: #dc2626; margin: 0;'>Test Terminated</h2></div>" +
      "<p style='font-size: 16px;'>Hi " + name + ",</p>" +
      "<p style='font-size: 16px; line-height: 1.5;'>Your recent test session for <strong>" + chapterName + attemptTxt + "</strong> on AV Academy has been flagged and terminated by our automated proctoring system.</p>" +
      "<p style='font-size: 16px; line-height: 1.5;'>Our records show <strong>" + data.violations + " separate instances</strong> of window switching or tab unfocusing. Due to our strict academic integrity policy, your results have been withheld and will not be recorded on the global leaderboard.</p>" +
      "<p style='font-size: 16px; line-height: 1.5;'>Please ensure you remain in the active test window for any future attempts.</p>" +
      "<div style='text-align: center; margin-top: 30px;'>" +
      "<a href='" + websiteLink + "' style='" + btnStyle + "'>Return to AV Academy</a>" +
      "</div></div>";
      
  } else if (finalStatus === "unfair") {
    // Branch 2: Unfair Means (Finished under 25 minutes)
    emailSubject = "⚠️ Unfair Means Detected - " + chapterName;
    htmlBody = "<div " + styleBlock + ">" +
      "<div style='text-align: center; margin-bottom: 20px;'><h2 style='color: #ea580c; margin: 0;'>Submission Flagged</h2></div>" +
      "<p style='font-size: 16px;'>Hi " + name + ",</p>" +
      "<p style='font-size: 16px; line-height: 1.5;'>Our system has flagged your recent submission for <strong>" + chapterName + attemptTxt + "</strong> due to suspiciously rapid completion. You submitted a comprehensive test in just <strong>" + Math.floor((data.timeTaken||0)/60) + " minutes</strong>.</p>" +
      "<p style='font-size: 16px; line-height: 1.5;'>To ensure fairness on the global leaderboard, <strong>your score and rank have been voided and not recorded</strong>.</p>" +
      "<p style='font-size: 16px; line-height: 1.5;'>You are required to log back in and retake the test fairly.</p>" +
      "<div style='text-align: center; margin-top: 30px;'>" +
      "<a href='" + websiteLink + "' style='" + btnStyle + "'>Retake Test</a>" +
      "</div></div>";
      
  } else {
    // Branch 3: Standard Success Email
    emailSubject = "Rank & Results: " + chapterName + " (" + score + "/" + totalMarks + ")";
    var verdict = score >= 140 ? "Great work! You are on track for a top-percentile finish." : "Needs Revision. Let's hit the books and practice!";
    
    htmlBody = "<div " + styleBlock + ">" +
      "<div style='text-align: center; margin-bottom: 25px;'>" +
      "<h2 style='color: #0f172a; margin: 0;'>AV Academy Test Results</h2>" +
      "<p style='color: #6b7280; font-size: 14px; margin-top: 5px;'>" + chapterName + attemptTxt + "</p>" +
      "</div>" +
      "<p style='font-size: 16px;'>Congratulations " + name + ",</p>" +
      "<p style='font-size: 16px; line-height: 1.5;'>Your test has been successfully processed and verified. Here is your final performance breakdown:</p>" +
      "<div style='background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0;'>" +
        "<table style='width: 100%; font-size: 16px;'>" +
          "<tr><td style='padding: 6px 0; color: #64748b;'><strong>Score</strong></td><td style='text-align: right; font-weight: 700; color: #0f172a;'>" + score + " / " + totalMarks + "</td></tr>" +
          "<tr><td style='padding: 6px 0; color: #64748b;'><strong>Correct</strong></td><td style='text-align: right; font-weight: 700; color: #16a34a;'>" + (data.correctCount || 0) + "</td></tr>" +
          "<tr><td style='padding: 6px 0; color: #64748b;'><strong>Time Taken</strong></td><td style='text-align: right; font-weight: 700; color: #0f172a;'>" + Math.floor((data.timeTaken||0)/60) + "m " + ((data.timeTaken||0)%60) + "s</td></tr>" +
          "<tr><td style='padding: 6px 0; color: #64748b;'><strong>Global Rank</strong></td><td style='text-align: right; font-weight: 700; color: #0f172a;'>" + currentStanding + "</td></tr>" +
        "</table>" +
      "</div>" +
      "<p style='font-size: 16px; line-height: 1.5;'><strong>Verdict:</strong> " + verdict + "</p>" +
      "<div style='text-align: center; margin-top: 30px;'>" +
      "<a href='" + websiteLink + "' style='" + btnStyle + "'>Review Your Answers</a>" +
      "</div></div>";
  }

  // Active logging inside Execution Logs via try/catch
  try {
    MailApp.sendEmail({
      to: data.email,
      subject: emailSubject,
      htmlBody: htmlBody,
      name: "AV Academy"
    });
    console.log("Email successfully dispatched to: " + data.email);
  } catch (error) {
    console.error("FATAL ERROR: Failed to dispatch email to " + data.email + ". Reason: " + error.message);
  }
}
