const SPREADSHEET_ID = '1elZBJPJLHgXgZbgj6DV5l3ZvqtYq8sRI2OwpNV7qAsE';

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Google Apps Script Web App is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No POST data received");
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const clientData = payload.client;
    const portalCredentials = payload.portalCredentials || [];
    const customFields = payload.customFields || [];

    if (!clientData || (!clientData.id && !clientData.clientId)) {
      throw new Error("Missing client data or client ID in payload");
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Auto-create sheets if missing
    const clientsSheet = getOrCreateSheet(ss, 'Clients', [
      'Client ID', 'Client Name', 'Trade Name', 'Entity Type', 'Mobile', 
      'WhatsApp', 'Email', 'GSTIN', 'PAN', 'CIN / LLPIN', 'FSSAI', 
      'Assigned Staff', 'Status', 'Notes'
    ]);
    
    const portalsSheet = getOrCreateSheet(ss, 'Portal_Credentials', [
      'Client ID', 'Portal Name', 'Portal Login URL', 'User ID', 'Password'
    ]);
    
    const customFieldsSheet = getOrCreateSheet(ss, 'Custom_Fields', [
      'Client ID', 'Field Name', 'Field Value'
    ]);

    const clientId = clientData.id || clientData.clientId;

    if (action === 'CREATE' || action === 'UPDATE') {
      // Upsert logic for Clients
      upsertClient(clientsSheet, clientId, clientData);
      
      // Replace related data (Portals)
      replaceClientRelatedData(portalsSheet, clientId, portalCredentials, function(pc) {
        const portalName = pc.portalName === 'Other' ? (pc.customPortalName || 'Other') : (pc.portalName || '');
        return [
          clientId, 
          portalName, 
          pc.portalUrl || '', 
          pc.userId || '', 
          pc.password || ''
        ];
      });
      
      // Replace related data (Custom Fields)
      replaceClientRelatedData(customFieldsSheet, clientId, customFields, function(cf) {
        return [
          clientId, 
          cf.fieldName || '', 
          cf.fieldValue || ''
        ];
      });
      
      Logger.log(`Successfully upserted client ${clientId}`);
    } else if (action === 'DELETE') {
      deleteClient(clientsSheet, clientId);
      deleteClientRelatedData(portalsSheet, clientId);
      deleteClientRelatedData(customFieldsSheet, clientId);
      Logger.log(`Successfully deleted client ${clientId}`);
    } else {
      throw new Error("Invalid action provided: " + action);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Data synced successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error processing request: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function upsertClient(sheet, clientId, clientData) {
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;

  // Duplicate detection - find existing row by Client ID
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === clientId) {
      rowIndex = i + 1;
      break;
    }
  }

  // Safely extract data handling potential missing/fallback fields
  const rowData = [
    clientId,
    clientData.name || '',
    clientData.tradeName || '',
    clientData.entityType || '',
    clientData.mobile || clientData.mobileNumber || '',
    clientData.whatsapp || clientData.whatsappNumber || '',
    clientData.email || clientData.emailAddress || '',
    clientData.gstin || '',
    clientData.pan || '',
    clientData.cinOrLlpin || clientData.cin || '',
    clientData.fssaiNumber || clientData.fssai || '',
    clientData.assignedStaffName || clientData.assignedStaffId || '',
    clientData.status || '',
    clientData.notes || ''
  ];

  if (rowIndex > -1) {
    // UPDATE existing row
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // CREATE new row
    sheet.appendRow(rowData);
  }
}

function deleteClient(sheet, clientId) {
  const data = sheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === clientId) {
      sheet.deleteRow(i + 1);
      break; // Unique ID, can break after first match
    }
  }
}

function replaceClientRelatedData(sheet, clientId, items, mapFn) {
  // DELETE all existing records for the client to handle updates cleanly
  deleteClientRelatedData(sheet, clientId);
  
  // INSERT new records
  if (items && items.length > 0) {
    const rows = items.map(mapFn);
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, rows[0].length).setValues(rows);
  }
}

function deleteClientRelatedData(sheet, clientId) {
  const data = sheet.getDataRange().getValues();
  // Iterate backwards to safely delete multiple rows without shifting issues
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === clientId) {
      sheet.deleteRow(i + 1);
    }
  }
}
