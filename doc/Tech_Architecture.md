
---

# 🧩 2. `Tech_Architecture.md`

```markdown
# ⚙️ System Architecture

## Overview

Medex Intranet Portal; **Next.js frontend**, **Convex backend** ve **Clerk authentication** üzerine kuruludur.

---

## 🔗 Data Flow

1. Kullanıcı `Clerk` üzerinden Google hesabıyla giriş yapar.
2. `Convex` backend kullanıcı bilgisini kontrol eder (sadece `@medex.com` domain kabul edilir).
3. Kullanıcı dashboard’a yönlendirilir.
4. Convex üzerinden duyurular, etkinlikler, ticket’lar gibi veriler çekilir.
5. Admin paneli `role=admin` kullanıcılarına özel görünür.
6. Drive / Sheets API entegrasyonu dosya ve tablo bağlantılarını sağlar.

---

## 🧠 Core Modules

| Modül | Açıklama | Kaynak |
|--------|-----------|--------|
| Auth | Clerk ile domain kontrollü giriş | Clerk |
| DB | Convex Schema ve Realtime Queries | Convex |
| UI | Tailwind + shadcn komponentleri | Frontend |
| File Storage | Google Drive API | Backend |
| Ticket System | Convex DB + Admin UI | Fullstack |
| Admin Panel | Yönetim modülü | Next.js + Convex |

---

## 🧰 System Diagram

[Clerk Auth] ---> [Next.js App Router] ---> [Convex Backend]
| | |
[Google Login] [UI: Tailwind/Shadcn] [Drive/Sheets API]