# Home Smile - Enterprise API Engine

## 1. Project Overview
The **Home Smile Backend** is a production-grade, enterprise API engine designed to handle high-concurrency e-commerce operations. Built on a modular monolithic architecture, it serves as the secure data orchestration layer for both the consumer storefront (Next.js) and the administrative command center (React). It manages complex product taxonomies, multi-step order lifecycles, and diverse financial transaction protocols.

## 2. Tech Stack
*   **Core Logic:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
*   **Persistence Layer:** [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
*   **Security & Auth:** [JWT](https://jwt.io/), [Bcrypt.js](https://www.npmjs.com/package/bcryptjs), [Helmet](https://helmetjs.github.io/)
*   **Payment Ecosystem:** [Stripe](https://stripe.com/), [PayPal SDK](https://developer.paypal.com/), [Razorpay](https://razorpay.com/)
*   **Media Orchestration:** [Cloudinary API](https://cloudinary.com/) with [Multer](https://github.com/expressjs/multer)
*   **Real-time Communication:** [Socket.io](https://socket.io/)
*   **Utilities:** [Nodemailer](https://nodemailer.com/), [Day.js](https://day.js.org/), [Csv-parser](https://csv.js.org/parser/)

## 3. Folder Structure Explanation
```text
backend/
├── api/                # Production entry point (Vercel compatible)
│   └── index.js        # Server bootstrap and middleware orchestration
├── config/             # Environment-specific service configurations
│   ├── db.js           # Database connection and event listeners
│   └── keys.js         # External API keys and secrets management
├── controller/         # Business logic layer (Request handlers)
│   ├── productController.js
│   └── orderController.js
├── models/             # Mongoose Schemas (The "Source of Truth")
│   ├── Product.js      # Complex variants and attribute schemas
│   └── Order.js        # Finite state machine for order tracking
├── routes/             # RESTful route definitions
│   ├── adminRoutes.js  # Secured staff/admin endpoints
│   └── customerRoutes.js # Consumer-facing endpoints
├── middleware/         # Security and pre-processing hooks
│   └── jwtMiddleware.js # Token extraction and permission validation
├── script/             # Database seeding and migration utilities
└── utils/              # Pure functions and global constants
```

## 4. Features & Functionality
*   **Hierarchical Product Engine:** Supports multi-level categories, dynamic attributes (size, color), and inventory variants with individual tracking.
*   **Order Finite State Machine (FSM):** Orders transition through strict states (Pending → Processing → Delivered → Cancelled), ensuring data integrity.
*   **Multi-Gateway Payment Orchestration:** A centralized service to handle webhooks and payment confirmations across Stripe, PayPal, and Razorpay.
*   **RBAC (Role-Based Access Control):** Granular permission system distinguishing between Super Admins, Staff, and Customers.
*   **Internalization (i18n) Backend:** Dynamic schema support for storing content in multiple languages (English, Arabic, etc.).
*   **Batch Operations:** High-speed CSV parsing for bulk product imports and category nesting.

## 5. Workflow / Architecture
### Request Architecture:
1.  **Ingress:** Client request enters via SSL-secured endpoint.
2.  **Security Layer:** `Helmet` sets secure headers; `CORS` validates origin.
3.  **Authentication:** `jwtMiddleware` verifies the Bearer token and hydrates `req.user`.
4.  **Route Dispatcher:** The request is mapped to a specific controller action.
5.  **Service/Logic:** The controller interacts with Mongoose models, performing ACID-compliant operations where necessary.
6.  **Egress:** A standardized JSON response is returned with appropriate HTTP status codes.

## 6. Setup Instructions
### Environment Configuration
1.  Clone the repository and enter the `/backend` directory.
2.  Create a `.env` file with the following variables:
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/homesmile
    JWT_SECRET=your_ultra_secure_random_string
    CLOUDINARY_NAME=your_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    STRIPE_SECRET_KEY=sk_test_...
    ```
### Initialization
```bash
# Install production and development dependencies
npm install

# Seed the database with initial products and categories
npm run data:import

# Launch the development server with Hot Module Replacement (HMR)
npm run dev
```

## 7. API Details (Core Endpoints)
| Entity | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/admin/login` | Staff/Admin authentication |
| **Auth** | `POST` | `/api/customer/register` | Customer signup |
| **Products** | `GET` | `/api/products` | Paginated catalog browsing |
| **Orders** | `POST` | `/api/order/add` | Order placement with payment intent |
| **Staff** | `GET` | `/api/staff` | (Admin Only) List all managed users |

## 8. Integration Details
*   **Consumer Handshake:** The Frontend communicates via JSON over HTTPS, utilizing NextAuth for session persistence.
*   **Admin Handshake:** The Admin Dashboard utilizes a higher-privilege JWT scope to access management controllers.
*   **Persistence:** MongoDB handles unstructured product metadata while maintaining strict constraints via Mongoose schemas.
*   **Media:** Image binary streams are intercepted by Multer and offloaded to Cloudinary for CDN-based delivery.

## 9. Best Practices / Notes
*   **Validation:** Use Mongoose pre-save hooks for data normalization (e.g., slug generation).
*   **Error Handling:** Never expose stack traces in production; use the centralized error-handling middleware.
*   **Pagination:** All "List" endpoints must implement `limit` and `page` parameters to prevent memory overflows.
*   **Statelessness:** The API remains strictly stateless; all session data is kept in the JWT or the client.

## 10. Future Improvements
*   **GraphQL Integration:** Transition over-fetched endpoints to GraphQL to reduce payload sizes.
*   **Redis Caching:** Implement a caching layer for the product catalog to reduce DB load for read-heavy operations.
*   **Microservices:** Decouple the payment orchestration logic into a separate microservice for higher fault tolerance.