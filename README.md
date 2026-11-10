# MediaInvoices

Application full-stack de dématérialisation de factures, développée dans le cadre d'un PFE chez MediaSoft Tunisie.

## Fonctionnalités
- Upload de factures (PDF/image) avec extraction OCR (Tesseract + ImageSharp)
- Analyse par pipeline IA LangGraph : extraction → validation → classification → antifraude → stockage
- Prise en charge de plusieurs formats de factures (Divalto, Mediasoft)
- Synchronisation avec les ERP Sage et Divalto
- Chatbot RAG local (Ollama : nomic-embed-text + llama3.2) pour interroger les factures
- Scan mobile par QR code
- Notifications temps réel (SignalR)
- Gestion des utilisateurs et des rôles (administrateur / utilisateur), export PDF

## Stack technique
- **Frontend** : Angular
- **Backend** : ASP.NET Core, Entity Framework, SQL Server
- **IA** : LangGraph (Node.js/Express), Ollama
- **OCR** : Tesseract, SixLabors.ImageSharp
- **Auth** : BCrypt
