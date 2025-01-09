function pushHtmlToGitHub() {
  // GitHub details
  const GITHUB_TOKEN = ''; // Replace with your GitHub token
  const REPO_OWNER = 'matthewthomas22'; // Replace with your GitHub username or organization
  const REPO_NAME = 'matthewthomas22.github.io'; // Replace with your repository name
  const FILE_PATH = 'testPage.html'; // Path in the repository
  const BRANCH = 'main'; // Branch name

  // The HTML content to push
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sample HTML</title>
    </head>
    <body>
      <h1>Hello, GitHub!</h1>
    </body>
    </html>
  `;

  // Encode the content in Base64
  const base64Content = Utilities.base64Encode(htmlContent);

  // GitHub API URL to get the file SHA (required for updates)
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  // Get the existing file SHA (if the file already exists)
  let sha = null;
  try {
    const response = UrlFetchApp.fetch(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const data = JSON.parse(response.getContentText());
    sha = data.sha;
  } catch (e) {
    Logger.log('File does not exist; creating a new one.');
  }

  // Create or update the file
  const payload = {
    message: `Commit message: Add or update ${FILE_PATH}`,
    content: base64Content,
    branch: BRANCH,
  };

  // Include the SHA if updating an existing file
  if (sha) {
    payload.sha = sha;
  }

  // Push the file
  const options = {
    method: 'put',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    payload: JSON.stringify(payload),
  };

  const result = UrlFetchApp.fetch(apiUrl, options);
  Logger.log(`Response: ${result.getContentText()}`);
}


// function createHTMLFileFromSheet() {
//   // Step 1: Open the Google Sheet
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   const data = sheet.getDataRange().getValues(); // Get all data from the sheet
  
//   // Step 2: Generate HTML Content
//   let htmlContent = `
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Form Responses</title>
// </head>
// <body>
//   <h1>Form Responses</h1>
//   <table border="1">
//     <thead>
//       <tr>
//         ${data[0].map(header => `<th>${header}</th>`).join('')} <!-- Table Headers -->
//       </tr>
//     </thead>
//     <tbody>
//       ${data.slice(1).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')} <!-- Table Data -->
//     </tbody>
//   </table>
// </body>
// </html>
//   `;

//   // Step 3: Save the HTML file to Google Drive
//   const folder = DriveApp.getFolderById("1-e4w9C2YdMRMhOjYY0FqD7DUNvt5FyeF"); // Replace with your Google Drive folder ID
//   const fileName = `FormResponses_${new Date().toISOString()}.html`;
//   folder.createFile(fileName, htmlContent, MimeType.HTML);

//   Logger.log(`HTML file created: ${fileName}`);
// }
