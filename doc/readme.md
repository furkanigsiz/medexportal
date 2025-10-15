# Medex Intranet Portal (Next.js Edition)

Medex için modern, güvenli ve sade bir **şirket içi intranet portalı**.  
Google Sites üzerinde yapılmak istenen eski sistemin yerine, modern teknolojilerle geliştirilmiş bir çözüm sunar.

---

## 🚀 Tech Stack

- **Next.js 15 (App Router)**
- **Convex** – Real-time DB ve backend fonksiyonları
- **Clerk** – Authentication (yalnızca `@medex.com` e-postaları)
- **TailwindCSS + shadcn/ui** – UI kütüphanesi
- **Google Drive + Sheets API** – Döküman entegrasyonu
- **Vercel** – Deployment platformu

---

## 🧱 Özellikler

✅ Google ile `@medex.com` domainli giriş  
✅ Rol tabanlı yetkilendirme (Employee / Admin / SuperAdmin)  
✅ Duyurular, etkinlikler, başarı hikayeleri  
✅ Ticket (destek talebi) sistemi  
✅ Admin paneli (haber ekleme, kullanıcı yönetimi, döküman paylaşımı)  
✅ Google Drive & Sheets entegrasyonu  
✅ Gerçek zamanlı veri akışı (Convex)  
✅ Modern, responsive tasarım

---

## 📦 Kurulum

```bash
# Proje oluştur
npx create-next-app@latest medex-intranet --typescript --tailwind --app
cd medex-intranet

# Gerekli bağımlılıklar
npm install @clerk/nextjs convex lucide-react shadcn-ui

# Shadcn kurulum
npx shadcn-ui init
npx shadcn-ui add button card input textarea dialog table

# Convex başlat
npx convex dev
