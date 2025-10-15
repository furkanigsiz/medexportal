
---

# 🔗 6. `API_Integration_Guide.md`

```markdown
# 🔗 Google API Integration Guide

## Google Cloud Setup

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Yeni bir proje oluştur: `medex-intranet`
3. API’leri etkinleştir:
   - Google Drive API
   - Google Sheets API
4. OAuth Client oluştur (Web App)
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback`

---

## Drive API Kullanımı

### Döküman Ekleme
```ts
import { google } from "googleapis";

const drive = google.drive({ version: "v3", auth });
const fileMetadata = { name: "example.pdf" };
const media = { mimeType: "application/pdf", body: fs.createReadStream("example.pdf") };
const file = await drive.files.create({ resource: fileMetadata, media, fields: "id" });

### Döküman Listeleme

const res = await drive.files.list({
  q: "'root' in parents and mimeType != 'application/vnd.google-apps.folder'",
  fields: "files(id, name, webViewLink)",
});

### Sheets API Embed

<iframe
  src="https://docs.google.com/spreadsheets/d/{sheetId}/edit?usp=sharing"
  width="100%"
  height="600"
></iframe>

## Güvenlik Notları

Sadece @medex.com domaini erişim izni ver.

API anahtarlarını .env.local içinde sakla.

Convex üzerinden erişim kontrolü uygula.