# 🧩 Convex Schema Documentation

## users
```ts
id: string
name: string
email: string
role: "employee" | "admin" | "superadmin"
createdAt: number

news

id: string
title: string
content: string
authorId: string
createdAt: number

events

id: string
title: string
date: string
location: string
createdBy: string

tickets

id: string
userId: string
title: string
description: string
status: "open" | "in_progress" | "closed"
createdAt: number
updatedAt: number
reply?: string

documents

id: string
title: string
driveFileId: string
addedBy: string
createdAt: number

Convex Functions
Fonksiyon	Açıklama
createNews	Yeni duyuru ekler
getNews	Duyuruları çeker
createTicket	Yeni destek talebi oluşturur
updateTicketStatus	Ticket durumunu değiştirir
addDocument	Google Drive dokümanı ekler
listDocuments	Döküman listesini döner