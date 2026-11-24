# 💎 Gem Lanka — Unified System Repository

Welcome to the unified repository for the **JEM Lanka** gemstone marketplace platform. This repository contains both the premium frontend interface and the enterprise Java EE backend engine.

---

## 📁 Repository Structure

* **`jemLanka/`**: The complete frontend application built using static HTML5, Tailwind CSS, Alpine.js, FontAwesome, and Vanilla JavaScript.
* **`JemLankaBackEnd/`**: The secure Java EE servlet engine utilizing Hibernate 5 ORM, GSON, and MySQL `jemdb`.
* **`database_update.sql`**: Database migration script containing all table upgrades (store verification, gemstone attributes, and seed corrections).

---

## 🚀 Key Features & Capabilities

- **💎 Authentic Ceylon Gemstone Marketplace:** Direct sourcing of Ceylon sapphires, rubies, and rare natural gemstones.
- **🏛️ Merchant Store Onboarding Wizard:** 4-step verified seller onboarding including National Gem & Jewellery Authority (NGJA) license validation, BRC registration, and bank payout configuration.
- **⚖️ Advanced Gem Listing & Per-Carat Calculator:** Comprehensive gemstone cataloging with origin tracing, cut style, dimensions (mm), lab certifications (GIA, NGJA), and real-time price-per-carat calculation.
- **🛡️ 100% Certified Trust Highlights:** Integrated trust indicators, secure seller verification, and insured worldwide delivery.
- **👤 Luxury Customer Dashboard & Profile:** Silk Ivory (`#FAF5EE`) aesthetic, monogram avatars, masked credentials, and responsive mobile navigation drawer.

---

## 🛠️ Database Setup & Migration

To configure the latest schema updates on MySQL:

```sql
mysql -u root -p jemdb < database_update.sql
```

This updates the `store` and `product` entities with NGJA accreditation, origin tracing, dimensional data, and corrected classifications.

---

## 💻 Tech Stack

- **Frontend:** HTML5, CSS3, Tailwind CSS, FontAwesome 6, JavaScript (ES6+), Alpine.js
- **Backend:** Java EE Servlets, Hibernate 5 ORM, GlassFish / Tomcat, GSON
- **Database:** MySQL 8.x (`jemdb`)
- **Web Server:** Apache (XAMPP)

---

## 📜 License
Developed for Gem Lanka Marketplace. All rights reserved.
