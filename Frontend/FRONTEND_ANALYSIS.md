# FRONTEND ANALYSIS: Pro Cafe (PM.Cafe)

This document provides a detailed structural analysis of the existing frontend codebase for **Pro Cafe**, outlining existing pages, components, data models, state management, and the requirements for the MERN full-stack integration.

---

## 1. Existing Pages & Routing Structure

The current frontend routing is managed in `src/App.jsx` using `react-router-dom` (v6). The application layout includes a persistent `Header` (navigation bar), `Footer`, and `CartDrawer` (sliding shopping cart).

### Existing Pages:
1. **Home (`/`)**: Main landing page rendering the interactive `HeroCanvas` and the bento-grid `DeliverySection`.
2. **Menu Page (`/menu`)**: Dynamic showcase of available dishes. Features category-based filtering (Pizza, Burgers, Pasta, Beverages, Desserts, Combos) and adding items to the cart.
3. **Offers Page (`/offers`)**: Displays BOGO and special event offers.
4. **Events Page (`/events`)**: Lists opening hours, venue details, and group booking information.
5. **Contact Page (`/contact`)**: Renders contact details and the Reservation/Table booking form.

---

## 2. Components Overview

* **Header (`src/components/Header.jsx`)**: Responsive navigation bar with links to Home, Menu, Offers, Events, and Contact. Includes a cart trigger button showing the active item count.
* **Footer (`src/components/Footer.jsx`)**: Timings, address, and quick links.
* **HeroCanvas (`src/components/HeroCanvas.jsx`)**: Kinetic canvas utilizing GSAP for 3D mouse parallax and scroll/intro animations.
* **DeliverySection (`src/components/DeliverySection.jsx`)**: Bento-grid layout describing food delivery statistics and thermal packaging features.
* **CartDrawer (`src/components/CartDrawer.jsx`)**: Sliding shopping cart panel. Lists added items, handles quantity updates, item removal, and shows subtotals, tax (5%), and free delivery indicator. Contains a simulated checkout flow (`handleCheckout`).

---

## 3. Existing Forms

* **Table Reservation Form (`src/pages/ContactPage.jsx`)**:
  * **Fields**: Name (`name`), Phone Number (`phone`), Number of Guests (`guests`, default "2"), Date/Time (`date`), Special Message (`message`).
  * **Validation**: Checks for presence of `name`, `phone`, and `date`.
  * **Status**: Simulated frontend success/error timeouts.

---

## 4. Existing State Management

* **Cart State (`src/context/CartContext.jsx`)**:
  * Managed via standard React Context API (`CartProvider` / `useCart`).
  * **State**: `cart` (array of items with quantity), `isCartOpen` (boolean drawer status).
  * **Persistence**: Synchronized automatically with `localStorage` (key: `procafe_cart`).
  * **Methods**:
    * `addToCart(product)`: Appends product with quantity 1 or increments existing item quantity. Opens cart drawer.
    * `updateQuantity(id, newQuantity)`: Updates quantity. Removes item if quantity <= 0.
    * `removeFromCart(id)`: Filters out the selected item.
    * `clearCart()`: Empties the cart.
  * **Derived State**:
    * `totalItems`: Sum of all item quantities.
    * `totalPrice`: Sum of `price * quantity` for all items.

---

## 5. Frontend Data Requirements

### Food Item Structure (`src/data/menuData.js`):
* `id` (Number)
* `name` (String)
* `category` (String)
* `description` (String)
* `price` (Number)
* `image` (String, unsplash image links)
* `isSpecial` (Boolean, chef's pick)
* `isBOGOEligible` (Boolean)

### Offers Structure (`src/data/offersData.js`):
* `id` (Number)
* `title` (String)
* `description` (String)
* `type` (String: "bogo", "flat", "event")

---

## 6. Required REST API Endpoints

To support full-stack functionality, the following endpoints will be implemented:

### Authentication & User Profile
* `POST /api/auth/register` - Create customer/admin accounts
* `POST /api/auth/login` - Authenticate users & return Access/Refresh JWT tokens
* `POST /api/auth/logout` - Invalidate tokens/clear sessions
* `GET /api/auth/profile` - Get currently logged-in user profile (Protected)
* `PUT /api/auth/profile` - Update user address, profile details, etc. (Protected)

### Foods & Menu Management
* `GET /api/foods` - Fetch all food items (supports filtering by category)
* `GET /api/foods/:id` - Fetch single food details
* `POST /api/foods` - Create new food item (Admin Only)
* `PUT /api/foods/:id` - Update food details, stock, or status (Admin Only)
* `DELETE /api/foods/:id` - Remove food item (Admin Only)

### Categories
* `GET /api/categories` - Fetch all food categories
* `POST /api/categories` - Add category (Admin Only)
* `PUT /api/categories/:id` - Update category (Admin Only)
* `DELETE /api/categories/:id` - Remove category (Admin Only)

### Cart Synchronization
* `GET /api/cart` - Fetch user's persistent cart from database (Protected)
* `POST /api/cart/add` - Add/Sync item to database cart (Protected)
* `PUT /api/cart/update` - Update quantities in database (Protected)
* `DELETE /api/cart/remove/:id` - Remove item from database (Protected)
* `DELETE /api/cart/clear` - Empty database cart (Protected)

### Orders
* `POST /api/orders` - Place new order (creates pending order database entry) (Protected)
* `GET /api/orders` - Fetch orders of the logged-in user (Protected)
* `GET /api/orders/:id` - Fetch details of a specific order (Protected)
* `PUT /api/orders/:id/status` - Update order stage (Pending -> Confirmed -> Preparing -> Out for Delivery -> Delivered -> Cancelled) (Admin Only)
* `DELETE /api/orders/:id` - Cancel/Remove order (Admin/Owner)

---

## 7. Database Entities (MongoDB Schemas)

1. **User Schema**: Store registration credentials, phone, address, profile image, and role (`customer` vs `admin`).
2. **Food Schema**: Store menu items with details including stock, category reference, price, rating, ingredients, and availability.
3. **Category Schema**: Organize dishes by categories.
4. **Cart Schema**: Persistent cart matching users to selected foods and quantities.
5. **Order Schema**: Store order history, status, delivery addresses, transaction summaries, and payment status.

---

## 8. Missing Frontend Pages to Generate

To support authentication, checkout, and profile/order administration, we need to create the following pages on the frontend:
1. **Login Page (`/login`)**: Secure user sign-in.
2. **Signup Page (`/signup`)**: Detailed sign-up form matching registration API criteria.
3. **Profile Page (`/profile`)**: Manage personal details, default delivery address, and view account roles.
4. **My Orders Page (`/orders`)**: View active and historical orders, order status tracking, and details.
5. **Cart Page (`/cart`)**: Responsive full-page cart view as an alternative to the Cart Drawer.
6. **Checkout Page (`/checkout`)**: Finalize order details, specify delivery address, choose payment method, and confirm orders.
