# Ecom-Frontend — Project Documentation

## Project Overview

A React 19 + Vite 7 single-page application serving as the frontend for a full e-commerce platform. Features product browsing, admin data tables, Stripe payment integration, and Redux-managed global state. Communicates with a separate backend API via Axios.

---

## SECTION 1: Configuration & Entry Files

### `index.html` — Application Entry Point

- The single HTML shell for the SPA. Vite uses this (not a JS file) as its entry point.
- `<div id="root"></div>` is the React mount target.
- `<script type="module" src="/src/main.jsx">` bootstraps the app using native ES modules, enabling Vite's fast unbundled dev serving.
- Title and favicon are still Vite defaults — should be updated for production.

### `vite.config.js` — Build Tool Configuration

- **`react()` plugin** — `@vitejs/plugin-react` enables JSX transform and React Fast Refresh (HMR).
- **`tailwindcss()` plugin** — `@tailwindcss/vite` (Tailwind v4 native Vite plugin, replaces PostCSS setup).
- **`server.port: 3000`** — Overrides Vite default (5173) to 3000.

### `eslint.config.js` — Linting (Flat Config Format)

- Ignores `/dist` build output.
- Extends: ESLint recommended, React Hooks rules, React Refresh/Vite compatibility.
- Browser globals declared to prevent false `no-undef` errors.
- `no-unused-vars` set to error, but ignores uppercase/underscore-prefixed names (components, intentional `_` vars).
- Linting is independent of the build pipeline (`npm run lint`).

### `package.json` — Project Manifest

- **`"type": "module"`** — ES modules throughout, no CommonJS.
- **`"private": true`** — prevents accidental npm publish.

**Scripts:**

| Script    | Command        | Purpose                              |
|-----------|----------------|--------------------------------------|
| `dev`     | `vite`         | Start dev server with HMR            |
| `build`   | `vite build`   | Production build via Rollup          |
| `lint`    | `eslint .`     | Run linter                           |
| `preview` | `vite preview` | Serve `/dist` locally for QA         |

**Dependency Map:**

| Category           | Packages                                                        |
|--------------------|-----------------------------------------------------------------|
| Core framework     | `react` 19.2, `react-dom` 19.2                                 |
| Routing            | `react-router-dom` 7.11                                        |
| State management   | `@reduxjs/toolkit` 2.11, `react-redux` 9.2                     |
| Styling            | `tailwindcss` 4.1, `@emotion/react`, `@emotion/styled`, `classnames` |
| UI components      | `@mui/material` 7.3, `@mui/x-data-grid` 8.25, `@headlessui/react` 2.2, `swiper` 12 |
| Forms              | `react-hook-form` 7.69                                         |
| HTTP client        | `axios` 1.13                                                   |
| Payments           | `@stripe/stripe-js`, `@stripe/react-stripe-js`                 |
| UX utilities       | `react-hot-toast`, `react-icons`, `react-loader-spinner`       |

**Architectural notes:**
- Two styling systems coexist: Tailwind (utility-first layouts) and MUI/Emotion (pre-built components like DataGrid). MUI requires Emotion as its styling engine.
- Axios indicates communication with a separate backend API.

---

## SECTION 2: Application Entry & Routing

### Application Bootstrap Flow

```
index.html
  └─ <script type="module" src="/src/main.jsx">
       └─ main.jsx
            ├─ imports index.css (global styles + Tailwind)
            ├─ wraps <App /> in Redux <Provider store={store}>
            └─ renders into #root via createRoot()
                 └─ App.jsx
                      ├─ <Router> (BrowserRouter)
                      ├─ <Navbar /> (persistent on every route)
                      ├─ <Routes> (route definitions)
                      └─ <Toaster /> (toast notifications, outside Router)
```

### `src/main.jsx` — React Bootstrap

- Uses `createRoot` (React 19 concurrent API) to mount into `#root`.
- Wraps the entire app in Redux `<Provider>` with the store from `./store/store.js`.
- Imports `index.css` — the global stylesheet and Tailwind entry point.
- `BrowserRouter` is intentionally placed in `App.jsx`, not here, keeping `main.jsx` focused on top-level providers only.

### `src/index.css` — Global Styles & Tailwind Entry

- Imports Google Fonts (Montserrat, variable weight 100-900).
- `@import "tailwindcss"` — Tailwind v4 entry point (replaces v3 `@tailwind` directives).
- Custom `@theme` block defines project design tokens:
  - `--font-montserrat` — primary typeface.
  - Custom shadows: `--shadow-custom`, `--shadow-right`.
  - Brand colors: `--color-custom-blue`, four banner colors (gold, red, green, purple).
  - Three gradients: dark header, purple-to-red button, light neutral.
- Includes a Tailwind v3-to-v4 compatibility fix for `border-color` defaults.

### `src/App.jsx` — Routing & Page Composition

Sole routing authority. Uses `react-router-dom` v7 with `BrowserRouter` + declarative `<Routes>`.

**Persistent layout:** `<Navbar />` renders above all routes (inside `<Router>`, outside `<Routes>`). `<Toaster position="bottom-center" />` sits outside `<Router>` for global toast notifications.

**Route table:**

| Route | Component | Access |
|---|---|---|
| `/` | `Home` | Public |
| `/products` | `Products` | Public |
| `/about` | `About` | Public |
| `/contact` | `Contact` | Public |
| `/cart` | `Cart` | Public |
| `/checkout` | `Checkout` | Authenticated users only |
| `/order-confirm` | `PaymentConfirmation` | Authenticated users only |
| `/login` | `LogIn` | Guests only |
| `/register` | `Register` | Guests only |
| `/admin` | `AdminLayout > Dashboard` (index) | Admin / Seller |
| `/admin/products` | `AdminLayout > AdminProducts` | Admin / Seller |
| `/admin/sellers` | `AdminLayout > Sellers` | Admin only |
| `/admin/orders` | `AdminLayout > Orders` | Admin / Seller |
| `/admin/categories` | `AdminLayout > Category` | Admin only |

### `src/components/PrivateRoute.jsx` — Route Guard

A layout-route component using React Router's `<Outlet />` pattern to wrap child routes with access control. Reads `user` from the Redux `auth` slice.

**Props & behavior:**

| Prop | Default | Effect |
|---|---|---|
| `publicPage` | `false` | Inverts the guard — logged-in users redirect to `/`, guests see the page. Used for `/login` and `/register`. |
| `adminOnly` | `false` | Requires `ROLE_ADMIN` or `ROLE_SELLER`. Sellers restricted to `/admin/orders` and `/admin/products` only. |
| *(neither)* | — | Standard auth guard: unauthenticated users redirect to `/login`. |

**Authorization hierarchy:**
1. `ROLE_ADMIN` — full access to all `/admin/*` routes.
2. `ROLE_SELLER` — restricted admin access (orders and products only).
3. Authenticated user — checkout/order-confirm access, blocked from admin.
4. Guest — public pages and auth pages only.

All redirects use `replace` to avoid polluting browser history.

---

## SECTION 3: State Management

### Architecture Overview

Uses **Redux with `configureStore`** from `@reduxjs/toolkit`, but follows **traditional Redux patterns** — not RTK's `createSlice`/`createAsyncThunk`. Manual string action types, switch-case reducers, and thunk-style action creators in a single centralized file.

### `src/api/api.js` — Axios Instance

- Base URL: `${VITE_BACK_END_URL}/api` (environment variable).
- `withCredentials: true` — sends cookies with every request (cookie-based auth, no manual `Authorization` header).

### `src/store/store.js` — Store Configuration

8 reducer slices, with `preloadedState` hydrated from localStorage:

| Slice Key | Reducer | Preloaded From localStorage |
|---|---|---|
| `products` | `productReducer` | — |
| `errors` | `errorReducer` | — |
| `carts` | `cartReducer` | `cartItems` |
| `auth` | `authReducer` | `auth`, `CHECKOUT_ADDRESS` |
| `payment` | `paymentMethodReducer` | — |
| `admin` | `adminReducer` | — |
| `order` | `orderReducer` | — |
| `seller` | `sellerReducer` | — |

Persistence is manual — actions write back to localStorage directly (no `redux-persist`).

### Reducer Breakdown

#### 1. `authReducer` — Authentication & Checkout State

State: `user`, `address[]`, `clientSecret`, `selectedUserCheckoutAddress`.
Actions: `LOGIN_USER`, `LOG_OUT`, `USER_ADDRESS`, `SELECT_CHECKOUT_ADDRESS`, `REMOVE_CHECKOUT_ADDRESS`, `CLIENT_SECRET`, `REMOVE_CLIENT_SECRET_ADDRESS`.
Used by: `PrivateRoute`, `Navbar`, `LogIn`, `Register`, `Checkout`, admin views.

#### 2. `productReducer` — Product & Category Catalog

State: `products[]`, `categories[]`, `pagination{}`.
Actions: `FETCH_PRODUCTS`, `FETCH_CATEGORIES`.
Note: Products and categories share one `pagination` object — last-fetched overwrites.
Used by: `Products`, `Home`, `AdminProducts`, `Category`.

#### 3. `cartReducer` — Shopping Cart

State: `cart[]`, `totalPrice`, `cartId`.
Actions: `ADD_CART`, `REMOVE_FROM_CART`, `GET_USER_CART_PRODUCTS`, `CLEAR_CART`.
Dual mode: local-only (guest, localStorage) and server-synced (authenticated, `/carts/users/cart`).
Used by: `Cart`, `Checkout`, `Navbar` (badge), product cards.

#### 4. `errorReducer` — Global Loading & Error State

State: `isLoading`, `errorMessage`, `categoryLoader`, `categoryError`, `btnLoader`.
Actions: `IS_FETCHING`, `IS_SUCCESS`, `IS_ERROR`, `BUTTON_LOADER`, `CATEGORY_LOADER`, `CATEGORY_SUCCESS`.
Used by: every component that fetches data.

#### 5. `paymentMethodReducer` — Payment Selection

State: `paymentMethod`.
Action: `ADD_PAYMENT_METHOD`.
Used by: `Checkout`.

#### 6. `adminReducer` — Dashboard Analytics

State: `analytics{}`.
Action: `FETCH_ANALYTICS` (from `/admin/app/analytics`).
Used by: `Dashboard`.

#### 7. `orderReducer` — Admin/Seller Orders

State: `adminOrder[]`, `pagination{}`.
Action: `GET_ADMIN_ORDERS`.
Used by: `Orders` (admin panel).

#### 8. `sellerReducer` — Seller Management

State: `sellers[]`, `pagination{}`.
Action: `GET_SELLERS`.
Used by: `Sellers` (admin panel).

### `src/store/actions/index.js` — Centralized Action Creators

All actions in one file. Pattern: `(params) => async (dispatch, getState) => { ... }`.

**Backend API endpoints:**

| Action | Method | Endpoint | Auth |
|---|---|---|---|
| `fetchProducts` | GET | `/public/products?{query}` | Public |
| `fetchCategories` | GET | `/public/categories` | Public |
| `authenticateSignInUser` | POST | `/auth/signin` | Public |
| `registerNewUser` | POST | `/auth/signup` | Public |
| `getUserAddresses` | GET | `/addresses` | User |
| `addUpdateUserAddress` | POST/PUT | `/addresses[/{id}]` | User |
| `deleteUserAddresses` | DELETE | `/addresses/{id}` | User |
| `createUserCart` | POST | `/cart/create` | User |
| `getUserCart` | GET | `/carts/users/cart` | User |
| `createStripePaymentSecret` | POST | `/order/stripe-client-secret` | User |
| `stripePaymentConfirmation` | POST | `/order/users/payments/online` | User |
| `analyticsAction` | GET | `/admin/app/analytics` | Admin |
| `getOrdersForDashboard` | GET | `/admin\|seller/orders` | Admin/Seller |
| `updateOrderStatusFromDashboard` | PUT | `/admin\|seller/orders/{id}/status` | Admin/Seller |
| `dashboardProductsAction` | GET | `/admin\|seller/products` | Admin/Seller |
| `addNewProductFromDashboard` | POST | `/admin\|seller/categories/{id}/product` | Admin/Seller |
| `updateProductFromDashboard` | PUT | `/admin\|seller/products/{id}` | Admin/Seller |
| `deleteProduct` | DELETE | `/admin\|seller/products/{id}` | Admin/Seller |
| `updateProductImageFromDashboard` | PUT | `/admin\|seller/products/{id}/image` | Admin/Seller |
| `getAllCategoriesDashboard` | GET | `/public/categories?{query}` | Admin |
| `createCategoryDashboardAction` | POST | `/admin/categories` | Admin |
| `updateCategoryDashboardAction` | PUT | `/admin/categories/{id}` | Admin |
| `deleteCategoryDashboardAction` | DELETE | `/admin/categories/{id}` | Admin |
| `getAllSellersDashboard` | GET | `/auth/sellers?{query}` | Admin |
| `addNewDashboardSeller` | POST | `/auth/signup` | Admin |

**Data flow pattern:**

```
Component dispatches action(params)
  → dispatch("IS_FETCHING") → errorReducer sets isLoading
  → api.get/post/put/delete(endpoint)
  → Success: dispatch domain action + "IS_SUCCESS"
  → Failure: dispatch "IS_ERROR" with message
  → Side effects: toast, form reset, navigate, localStorage write
```

**Notable patterns:**
- Action creators accept UI callbacks directly (`toast`, `setLoader`, `reset`, `navigate`, `setOpen`) — side effects are handled in actions, not components.
- Admin/seller endpoints use an `isAdmin` flag to toggle between `/admin/` and `/seller/` URL prefixes.

---

## SECTION 4: Components & Pages

### Component Tree

```
src/components/
├── shared/              ← Reusable UI primitives
│   ├── Navbar.jsx         Persistent top bar, nav links, cart badge, UserMenu/Login
│   ├── ProductCard.jsx    Product card with image, price, add-to-cart, modal trigger
│   ├── ProductViewModal.jsx  Full product detail dialog
│   ├── Globalmodal.jsx    Slide-in side panel (800px), generic children container
│   ├── DeleteModal.jsx    Centered confirmation dialog for destructive actions
│   ├── InputField.jsx     react-hook-form input with label, validation, error display
│   ├── SelectTextField.jsx  HeadlessUI Listbox dropdown for category selection
│   ├── Paginations.jsx    MUI Pagination, URL-param driven
│   ├── Loader.jsx         Full-height RotatingLines spinner
│   ├── Spinners.jsx       Small inline SVG spinner for buttons
│   ├── Skeleton.jsx       Full-page animated placeholder
│   ├── ErrorPage.jsx      Warning icon + error message
│   ├── Status.jsx         Small pill badge (e.g. "In Stock")
│   └── Sidebar.jsx        Admin/Seller nav sidebar, role-aware
├── home/
│   ├── Home.jsx           Landing: HeroBanner + first 8 products
│   └── HeroBanner.jsx     Swiper carousel (3 slides, 4s autoplay)
├── products/
│   ├── Products.jsx       Filtered, paginated product grid
│   ├── Filter.jsx         Search (700ms debounce), category, sort, clear
│   └── ImageUploadForm.jsx  File upload with preview (admin)
├── auth/
│   ├── LogIn.jsx          Login form (react-hook-form)
│   └── Register.jsx       Register form (username, email, password)
├── carts/
│   ├── Cart.jsx           Cart page: item list, subtotal, checkout link
│   ├── CartEmpty.jsx      Empty cart placeholder
│   ├── ItemContent.jsx    Cart row: image, name, price, quantity, total, remove
│   └── SetQuantity.jsx    Stateless +/- button pair
├── checkout/
│   ├── Checkout.jsx       4-step MUI Stepper (Address → Payment → Summary → Pay)
│   ├── AddressInfo.jsx    Address list + add/edit/delete modals
│   ├── AddAddressForm.jsx 6-field address form (react-hook-form)
│   ├── AddressInfoModal.jsx  Centered dialog wrapper for address form
│   ├── DeleteModal.jsx    Address delete confirmation
│   ├── OrderSummary.jsx   Read-only review (address, items, totals)
│   ├── PaymentMethod.jsx  Stripe/PayPal radio, syncs cart to server
│   ├── PaymentForm.jsx    Stripe PaymentElement + confirm
│   ├── StripePayment.jsx  Creates payment intent, wraps Elements provider
│   └── PaypalPayment.jsx  Placeholder: "PayPal unavailable" alert
├── Admin/
│   ├── AdminLayout.jsx    Sidebar + Outlet, responsive slide-in on mobile
│   ├── UpdateOrderForm.jsx  MUI Select for order status update
│   ├── dashboard/
│   │   ├── Dashboard.jsx      3 analytics cards (products, orders, revenue)
│   │   └── DashboardOverview.jsx  Single metric card with K/M/B formatting
│   ├── orders/
│   │   ├── Orders.jsx        Order list with useOrderFilter hook
│   │   └── OrderTable.jsx    DataGrid + edit modal (UpdateOrderForm)
│   ├── products/
│   │   ├── AdminProducts.jsx  DataGrid + add/edit/delete/image modals
│   │   └── AddProductsForm.jsx  Dual-mode product form (add/update)
│   ├── categories/
│   │   ├── Category.jsx      DataGrid + add/edit/delete modals
│   │   └── AddCategoryForm.jsx  Category name form (add/update)
│   └── sellers/
│       ├── Sellers.jsx       Seller list + add modal
│       ├── SellerTable.jsx   DataGrid (ID, username, email)
│       ├── AddSellerForm.jsx Username/email/password, auto-assigns seller role
│       └── useSellerFilter.jsx  Custom hook for seller pagination
├── helper/
│   └── tableColumn.jsx   DataGrid column factories for products/orders/categories/sellers
├── About.jsx             Static about page + 4 hardcoded ProductCards
├── Contact.jsx           Static contact form + info (non-functional)
├── PaymentConfirmation.jsx  Post-Stripe redirect: confirms payment, clears cart
├── PrivateRoute.jsx      Route guard (documented in Section 2)
├── UserMenu.jsx          Avatar dropdown menu (profile, orders, admin, logout)
├── AddressList.jsx       Selectable address cards with edit/delete buttons
└── BackDrop.jsx          Semi-transparent overlay
```

### Custom Hooks

| Hook | File | Used By | Behavior |
|---|---|---|---|
| `useProductFilter` | `hooks/useProductFilter.js` | `Products` | URL params (page, sortby, category, keyword) → query string → `fetchProducts` |
| `useDashboardProductFilter` | `hooks/useProductFilter.js` | `AdminProducts` | Page param → `dashboardProductsAction(query, isAdmin)` |
| `useOrderFilter` | `hooks/useOrderFilter.js` | `Orders` | Page param → `getOrdersForDashboard(query, isAdmin)` |
| `useCategoryFilter` | `hooks/useCategoryFilter.jsx` | `Category` | Page param → `fetchCategories(query)` |
| `useSellerFilter` | `sellers/useSellerFilter.jsx` | `Sellers` | Page param → `getAllSellersDashboard(query)` |

All hooks: read `searchParams` → build 0-indexed API query → dispatch fetch. URL is the single source of truth.

### Utility Modules

| File | Exports | Purpose |
|---|---|---|
| `utils/constant.js` | `bannerImageOne/Two/Three`, `aboutUsImage` | Static image imports |
| `utils/index.js` | `bannerLists`, `adminNavigation`, `sellerNavigation` | Banner data, sidebar nav config (admin: 5, seller: 2) |
| `utils/formatPrice.js` | `formatPrice`, `formatPriceCalculation`, `formatRevenue` | USD Intl formatting, safe qty×price, K/M/B abbreviation |
| `utils/truncateText.js` | `truncateText(text, charLimit=90)` | Ellipsis truncation |

### DataGrid Column Definitions (`helper/tableColumn.jsx`)

| Export | Actions |
|---|---|
| `adminProductTableColumn(handleEdit, handleDelete, handleImageUpload, handleProductView)` | Image / Edit / Delete / View |
| `adminOrderTableColumn(handleEdit)` | Edit |
| `categoryTableColumns(handleEdit, handleDelete)` | Edit / Delete |
| `sellerTableColumns` (static) | None |

### Interaction Patterns

1. **URL-driven filtering/pagination** — All list views store filter state in URL search params. Custom hooks watch params → dispatch fetch. Enables back/forward and shareable URLs.
2. **Modal CRUD** — `Globalmodal` (slide-in) for create/edit, `DeleteModal` (centered) for destructive. Pattern: table action → set selected item → open modal → form dispatches action → API call → re-fetch list → close modal.
3. **Form handling** — All forms use `react-hook-form` with `mode: "onTouched"`. `InputField` provides consistent label/validation/error UI.
4. **Loading states** — `Loader` (full-page), `Spinners` (inline button), `Skeleton` (full-page placeholder).
5. **Toast notifications** — `react-hot-toast` throughout. Toast instance passed into Redux action creators for success/error feedback.

---

## SECTION 5: Utilities & Helpers

### Overview

Six files comprise the utility/helper layer: one API client, two formatting modules, one static-data barrel, one image-asset barrel, and one DataGrid column-definition factory. All received JSDoc-style annotations describing their purpose, parameters, return values, and consuming components.

### `src/api/api.js` — Centralized Axios Instance

- Creates a single `axios.create()` instance shared by every Redux action creator.
- **Base URL**: `${VITE_BACK_END_URL}/api` — environment-driven, no hardcoded host.
- **`withCredentials: true`**: Ensures HTTP-only cookies (session/JWT) are attached to every request automatically. No manual `Authorization` header management.
- Imported exclusively by `store/actions/index.js`; all 26 action creators route through this instance.

### `src/utils/formatPrice.js` — Price Formatting Utilities

Three named exports:

| Export | Signature | Returns | Used By |
|---|---|---|---|
| `formatPrice` | `(amount) → string` | USD string via `Intl.NumberFormat` (e.g. `"$1,234.56"`) | `Cart.jsx`, `ItemContent.jsx` |
| `formatPriceCalculation` | `(quantity, price) → string` | `(qty × price).toFixed(2)`, returns `"0.00"` if either input is not finite | `OrderSummary.jsx` |
| `formatRevenue` | `(value) → string\|number` | Abbreviates: `≥1B → "1.2B"`, `≥1M → "3.4M"`, `≥1K → "5.6K"`, else raw value | `DashboardOverview.jsx` |

**Design note**: `formatPriceCalculation` guards against `NaN`/`undefined` by checking `Number.isFinite()` on both inputs before multiplying.

### `src/utils/truncateText.js` — Text Truncation

- **`truncateText(text, charLimit = 90)`** — Returns the original string if within `charLimit`, otherwise slices and appends `"..."`.
- Uses optional chaining (`text?.length`) to safely handle `null`/`undefined`.
- **Used by**: `ProductCard.jsx` (50-char name, 80-char description), `ItemContent.jsx` (cart item names).

### `src/utils/constant.js` — Static Image Asset Barrel

Centralizes all slider/banner image imports:

| Export | Asset |
|---|---|
| `bannerImageOne` | `assets/sliders/flat-lay.jpg` |
| `bannerImageTwo` | `assets/sliders/people.jpg` |
| `bannerImageThree` | `assets/sliders/natural-cosmetic.jpg` |
| `aboutUsImage` | `assets/sliders/team-business.jpg` |

Consumed by `utils/index.js` (banner data) and `About.jsx` (hero background).

### `src/utils/index.js` — Application Static Data

Re-exports images from `constant.js` and defines three data structures:

| Export | Type | Description |
|---|---|---|
| `bannerLists` | `Array<{id, image, title, subtitle, description}>` | 3 hero carousel slides for `HeroBanner.jsx` |
| `adminNavigation` | `Array<{name, href, icon, current?}>` | 5 sidebar links: Dashboard, Orders, Products, Categories, Seller |
| `sellerNavigation` | `Array<{name, href, icon}>` | 2 sidebar links: Orders, Products (subset of admin) |
| `aboutUsImage` | Re-export | Passed through from `constant.js` |

**Used by**: `HeroBanner.jsx` (banner slides), `Sidebar.jsx` (role-based navigation), `About.jsx` (image).

### `src/components/helper/tableColumn.jsx` — DataGrid Column Factories

Defines MUI DataGrid column arrays for all four admin panel tables. Three are factory functions (accepting action callbacks), one is a static array.

| Export | Params | Columns | Action Buttons |
|---|---|---|---|
| `adminProductTableColumn` | `handleEdit, handleDelete, handleImageUpload, handleProductView` | 9 data + 1 action | Image, Edit, Delete, View |
| `adminOrderTableColumn` | `handleEdit` | 5 data + 1 action | Edit |
| `categoryTableColumns` | `handleEdit, handleDelete` | 2 data + 1 action | Edit, Delete |
| `sellerTableColumns` | *(none — static)* | 3 data | *(none)* |

**Common column config**: All columns disable the column menu (`disableColumnMenu: true`), use custom `renderHeader` for display names, and apply consistent Tailwind classes (`text-black font-semibold border` for headers, `text-slate-700 font-normal border` for cells).

**Callback pattern**: Parent components pass handler functions that receive `params.row` — the full row data object — enabling the parent to control modal state and dispatch CRUD actions.

**Note**: The file contains ~290 lines of commented-out earlier iterations of `adminOrderTableColumn` (lines 1–289). These are legacy drafts preserved during development; only the active code (line 292 onward) is in use.
