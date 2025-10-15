
---

# 🧾 4. `Feature_Specs.md`

```markdown
# 📘 Feature Specifications

## 1. Auth Module
- Google OAuth üzerinden giriş
- Sadece `@medex.com` domain kabul edilir
- Yeni kullanıcılar varsayılan olarak `role: employee`
- Admin flag Convex DB’de tutulur

## 2. Dashboard
- Günaydın mesajı
- Hızlı erişim kutuları (Documents, SOP, Forum, Feedback, Trainings)
- Duyurular listesi
- Yaklaşan etkinlikler
- Başarı hikayeleri
- Aramıza katılanlar

## 3. Admin Panel
- Duyuru oluşturma/düzenleme/silme
- Ticket yönetimi
- Kullanıcı yetkisi düzenleme
- Döküman linki ekleme (Drive)
- Dashboard preview

## 4. Ticket System
- Kullanıcı: ticket oluşturur
- Admin: ticket yanıtlar, durum değiştirir (`open`, `in_progress`, `closed`)
- Realtime update (Convex subscription)

## 5. Drive/Sheets Integration
- Drive API: döküman ekleme ve listeleme
- Sheets API: tablo embed gösterimi
- Convex DB’de `fileId` ve `sheetUrl` saklanır

## 6. Role Permissions
- Employee: Dashboard + Ticket Create
- Admin: Dashboard + Ticket Manage + Content Manage
- SuperAdmin: Tüm yetkiler

