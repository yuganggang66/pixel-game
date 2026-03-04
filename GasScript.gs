/**
 * Google Apps Script (GAS) Backend Template
 * 
 * 部署步骤：
 * 1. 在您的 Google Sheet 中点击「扩充功能」->「Apps Script」
 * 2. 贴上并取代原本的程式码
 * 3. 点击「部署」->「新增部署作业」
 * 4. 选用类型：「网路应用程式」
 * 5. 执行身分：「我」
 * 6. 谁可以存取：「所有人」
 * 7. 部署后，将网路应用程式 URL 贴入专案的 .env 档
 */

const SHEET_NAME_QUESTIONS = '题目';
const SHEET_NAME_ANSWERS = '回答';

function doGet(e) {
  try {
    const count = parseInt(e.parameter.count) || 5;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_QUESTIONS);
    
    if (!sheet) {
      throw new Error(`找不到工作表: ${SHEET_NAME_QUESTIONS}`);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    // Get expected column indices
    const colId = headers.indexOf('题号');
    const colTitle = headers.indexOf('题目');
    const colA = headers.indexOf('A');
    const colB = headers.indexOf('B');
    const colC = headers.indexOf('C');
    const colD = headers.indexOf('D');
    const colAns = headers.indexOf('解答');

    // Filter out empty rows
    const validRows = rows.filter(row => row[colTitle] && row[colAns]);

    // Shuffle questions
    const shuffled = validRows.sort(() => 0.5 - Math.random());
    
    // Select requested count
    const selected = shuffled.slice(0, count).map(row => ({
      id: row[colId],
      question: row[colTitle],
      options: [
        { key: 'A', value: row[colA] },
        { key: 'B', value: row[colB] },
        { key: 'C', value: row[colC] },
        { key: 'D', value: row[colD] }
      ],
      answer: row[colAns]
    }));

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: selected
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { id, score, timestamp } = payload;
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ANSWERS);
    
    if (!sheet) {
      throw new Error(`找不到工作表: ${SHEET_NAME_ANSWERS}`);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const colId = headers.indexOf('ID');
    const colCount = headers.indexOf('闯关次数');
    const colTotalScore = headers.indexOf('总分');
    const colHighScore = headers.indexOf('最高分');
    const colFirstScore = headers.indexOf('第一次通关分数');
    const colAttemptsToPass = headers.indexOf('花了几次通关');
    const colLastPlayed = headers.indexOf('最近游玩时间');

    // Find if user already exists
    let userRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
        // loose equality to handle number/string ids
      if (data[i][colId] == id) {
        userRowIndex = i;
        break;
      }
    }

    const passThreshold = 3; // From your .env assumption
    const isPass = score >= passThreshold;

    if (userRowIndex > -1) {
      // Update existing user
      const currentRow = data[userRowIndex];
      const newCount = (currentRow[colCount] || 0) + 1;
      const newTotalScore = (currentRow[colTotalScore] || 0) + score;
      const newHighScore = Math.max((currentRow[colHighScore] || 0), score);
      
      let newFirstScore = currentRow[colFirstScore];
      let newAttemptsToPass = currentRow[colAttemptsToPass];
      
      // If passed for the first time
      if (isPass && !newFirstScore) {
         newFirstScore = score;
         newAttemptsToPass = newCount;
      }

      // Update cells (Sheet ranges are 1-indexed, and we skip header)
      const rangeRow = userRowIndex + 1;
      sheet.getRange(rangeRow, colCount + 1).setValue(newCount);
      sheet.getRange(rangeRow, colTotalScore + 1).setValue(newTotalScore);
      sheet.getRange(rangeRow, colHighScore + 1).setValue(newHighScore);
      if(isPass && !currentRow[colFirstScore]) {
         sheet.getRange(rangeRow, colFirstScore + 1).setValue(newFirstScore);
         sheet.getRange(rangeRow, colAttemptsToPass + 1).setValue(newAttemptsToPass);
      }
      sheet.getRange(rangeRow, colLastPlayed + 1).setValue(timestamp || new Date().toISOString());

    } else {
      // Create new user record
      const newRow = new Array(headers.length).fill('');
      newRow[colId] = id;
      newRow[colCount] = 1;
      newRow[colTotalScore] = score;
      newRow[colHighScore] = score;
      
      if (isPass) {
        newRow[colFirstScore] = score;
        newRow[colAttemptsToPass] = 1;
      }
      
      newRow[colLastPlayed] = timestamp || new Date().toISOString();
      sheet.appendRow(newRow);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: '成绩已记录'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }
}

// Handle preflight requests for CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
