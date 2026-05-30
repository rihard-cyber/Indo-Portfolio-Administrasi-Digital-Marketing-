/**
 * GOOGLE APPS SCRIPT — Auto-Populate Google Form Dropdown from Google Sheets
 * 
 * Project: Otomatisasi Pengisian Form Data Karyawan
 * Fungsi:  Mengisi dropdown NIP/Nama anggota secara otomatis dari database Sheet
 *          
 * Cara Pakai:
 *   1. Buka Google Sheets → Extensions → Apps Script
 *   2. Paste script ini → Simpan
 *   3. Atur trigger (jam atau saat form dibuka)
 *   4. Dropdown di Google Form akan terisi otomatis
 *
 * © Richard Patung Landu Meha — Contoh Portfolio Data Entry
 */

// ============================================================
// KONFIGURASI — Sesuaikan dengan Sheet & Form kamu
// ============================================================

var SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // ID Sheet database karyawan
var SHEET_NAME = 'Database Karyawan';        // Nama Sheet (tab)
var FORM_ID = 'YOUR_GOOGLE_FORM_ID_HERE';    // ID Google Form tujuan

// ============================================================
// FUNGSI UTAMA — Panggil manual atau via Trigger
// ============================================================

function updateFormDropdown() {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  
  // Asumsi kolom: NIP (A), Nama (B), Jabatan (C)
  var items = [];
  for (var i = 1; i < data.length; i++) { // Skip header baris 1
    var nip = data[i][0];
    var nama = data[i][1];
    if (nip && nama) {
      items.push(nip + ' - ' + nama); // Format: "701083 - INDRA BUDI"
    }
  }
  
  var form = FormApp.openById(FORM_ID);
  
  // Cari item form yang bertipe DROPDOWN (LIST)
  var formItems = form.getItems();
  for (var j = 0; j < formItems.length; j++) {
    var item = formItems[j];
    if (item.getType() === FormApp.ItemType.LIST) {
      var listItem = item.asListItem();
      listItem.setChoiceValues(items);
      Logger.log('Dropdown "' + listItem.getTitle() + '" diupdate dengan ' + items.length + ' item');
    }
  }
}

// ============================================================
// FUNGSI TAMBAHAN — Export data dari Sheet ke format lain
// ============================================================

function exportToCSV() {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  
  var csv = '';
  data.forEach(function(row) {
    csv += row.join(',') + '\n';
  });
  
  // Buat file CSV di Drive
  var blob = Utilities.newBlob(csv, 'text/csv', 'Export Database ' + new Date().toISOString().slice(0,10) + '.csv');
  DriveApp.createFile(blob);
  
  Logger.log('CSV exported successfully');
}

function sendReminderEmail() {
  /**
   * Kirim reminder ke anggota yang belum mengisi form
   * (Digunakan untuk form update NPWP, seragam, dll)
   */
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Response Tracker');
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    var nama = data[i][0];
    var email = data[i][1];
    var sudahMengisi = data[i][2];
    
    if (!sudahMengisi && email) {
      GmailApp.sendEmail(email, 
        'Pengingat: Update Data - Kementerian Perdagangan',
        'Yth. ' + nama + ',\n\n' +
        'Mohon segera mengisi form update data berikut:\n' +
        'Link: https://forms.google.com/...\n\n' +
        'Terima kasih.\n\n' +
        'Admin Security - Kemendag'
      );
      Logger.log('Email reminder terkirim ke: ' + email);
    }
  }
}
