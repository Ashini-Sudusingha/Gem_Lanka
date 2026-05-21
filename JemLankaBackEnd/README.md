# ☕ JEM Lanka — Enterprise Java EE Backend Engine

This repository represents the strong, enterprise-grade backend system for **JEM Lanka**, a premium Sri Lankan Gemstone Marketplace. The engine is developed as a Java EE Web Application that exposes REST-like endpoints and processes transaction logic via Hibernate ORM.

> [!IMPORTANT]
> **Unified System Documentation**: For a comprehensive analysis of the entire platform, complete architectural diagrams, core features, frontend templates, bug fixes, and screenshots, please refer to the primary unified **[JEM Lanka System README](../jemLanka/README.md)** located in the frontend repository directory (`d:/XamppNewFolder/htdocs/jemLanka/README.md`).

---

## 🏗️ Backend Core Architecture

The backend is built around a robust servlet container model (compatible with Apache Tomcat or Glassfish), backed by a MySQL database and Hibernate ORM framework.

### 📁 Source Structure Breakdown
*   **`controller/`**: Handles transactional endpoints and API controllers.
    *   `SignIn.java` / `SingUp.java`: Identity and access management.
    *   `VerifyEmail.java`: Validates secure OTP tokens sent during customer registration.
    *   `SaveProduct.java`: Sanitizes product inputs and securely manages gemstone item additions.
    *   `AddToCart.java` / `CartIteamsLoad.java`: Coordinates product basket validations and states.
    *   `SearchProductsHere.java`: Formulates complex HQL criteria searches for high-speed gemstone discovery.
*   **`model/`**: Houses global filters, interceptors, and system utilities.
    *   `CrosFilter.java`: Handles cross-origin requests (CORS), explicitly mapping credential access.
    *   `SignInCheckFilter.java` / `SessionFilter.java`: Secure filters blocking unauthorized administration access.
    *   `Mail.java`: Generates and delivers premium HTML-styled transactional notifications and email OTPs.
    *   `Util.java`: Contains general utility routines and cryptography functions.
*   **`hibernate/`**: Contains relational mappings and database classes.
    *   `HibernateUtil.java`: Generates the session factory and maintains single active database instances.
    *   `User.java`, `Product.java`, `Store.java`, `Orders.java`: Java POJOs representing database rows.
    *   `Category.java`, `Shape.java`, `Color.java`, `Clarity.java`, `Treatment.java`: Mapped lookup tables.

---

## ⚙️ Core Libraries & Dependencies
*   **Hibernate 5.x ORM**: For transactional mappings and database abstraction.
*   **MySQL Connector Java**: Database driver linking our Hibernate transactions to MySQL.
*   **Google GSON**: High-performance, low-overhead Java library to convert Java POJOs directly into raw JSON outputs.
*   **JavaMail & Activation API**: Coordinates automated SMTP actions to deliver secure security emails to clients.

---

## 💾 Local Environment & Configuration

To set up the backend locally:
1.  Verify that an active **MySQL Database Server** is running on your environment.
2.  Import the database schema (expected schema name: `jemdb`).
3.  Configure database credentials inside the Hibernate config file located at:
    `src/java/hibernate.cfg.xml`
4.  Open the backend directory in your preferred Java IDE (such as **NetBeans IDE** or IntelliJ IDEA).
5.  Perform a clean and build using the provided `build.xml` Ant script.
6.  Deploy the built WAR file or run the project directly to launch the local web server.
