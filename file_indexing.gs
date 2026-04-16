function generateDirectoryTree() {
  const folderId = '0AExd1AtGRyMQUk9PVA'; 
  const rootFolder = DriveApp.getFolderById(folderId);

  // Create the doc and get the body
  const doc = DocumentApp.create("GCA Folder Structure with Links");
  const body = doc.getBody();
  
  body.appendParagraph("Google Drive Directory Structure for GCA")
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  // Start the crawl - passing the 'body' is crucial!
  crawlFolders(rootFolder, body, 0);
  
  Logger.log("Document Created: " + doc.getUrl());
}

function crawlFolders(folder, body, level) {
  const indent = "  ".repeat(level);
  
  // 1. Add the Folder Name
  body.appendParagraph(indent + "📁 " + folder.getName()).setBold(true);
  
  // 2. List files in current folder
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const ownerObj = file.getOwner();
    const ownerName = ownerObj ? ownerObj.getName() : "Shared/External";
    
    // Create the two-line string with \n
    const fileInfo = indent + "    📄 " + file.getName() + "\n" + indent + "        👤 Owner: " + ownerName;
    
    // Append and link
    body.appendParagraph(fileInfo).setLinkUrl(fileUrl = file.getUrl());
  }
  
  // 3. Recursively visit subfolders
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    const subfolder = subfolders.next();
    // CRITICAL: You must pass 'body' here so the next level can use it
    crawlFolders(subfolder, body, level + 1);
  }
}
