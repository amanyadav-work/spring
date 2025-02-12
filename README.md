# Spring - Full Stack E-commerce Marketplace

Spring is a fully functional, scalable e-commerce marketplace built with modern technologies. It allows multiple sellers to list their products under various categories, while customers can browse, place orders, manage their wishlist, and more. The platform also offers dynamic stock management, real-time order tracking, and visual dashboards for both sellers and customers. 

This project is a demonstration of a full-stack e-commerce application showcasing React.js for the frontend, Supabase for data management, Clerk for user authentication, and Chart.js for data visualization.
You can view the live platform at [https://springshop.vercel.app/](https://springshop.vercel.app/).

---

## Screenshots

Here are some screenshots of the platform:

![Spring Screenshot 1](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgO933AHnIXwyerGFMPaXP1fNYCAr6AF46z8h66qG_pRrK3QLrBrPaaIdcOlBU2Lcwq-XkyL37uAlCESuOGPIKlQ0bVEnHU7qSJdVek5QyG_n6i52oz0xceFguim3GClRQHA7EfbDEDvdcHLDMlUDyu-6_BFMvSVU6dPlXtgzrFXYejH3xKThDKN0kIrlQ/s1920/Spring.__6_.png)

![Spring Screenshot 2](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi050T0XqfQvhbF6ZKW0zUI9EuPURNaKdgu035xcKVSHbq-CEz2wbjeXvkWO3En-lW7preOu08FiKh-1QYArNODyVr-tDp4t2FC-PvHwKlMT2TY1E52PueWZ3mIAFDRIg00VYdrY1JZtoam88L-Tk8QadtoKGH7P1-ZyMC9I8OORNluKNJA5a4uYxR_9Go/s1920/Capture.PNG)

![Spring Screenshot 3](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgYPl9WHKOmmCpyphxPPwhGBXZ6B4H_8PzZfXGsP5m1Wbaejjnaqh69pXI9W_QtKz2cD0ubWYdkBTY7FLhpfk-mzbXQ1JKEf3ZM_QxkZ2N4_JuB8ONVCsjAcxJg7J8JDzCnspEum_eHitjiWVClK04abQauJvlOdDcO4k4oOmtBEaWme44IzdTWcqZ69hI/s1920/Capture1.PNG)

![Spring Screenshot 4](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjoSPD60h0niKpKLq4K58DnmToyIMSmlXVnPTHM_0vZtXG664QDpsSM7E6klYv6El1bQhFljyRaT7AnrIjgwA1PdQjwkPGw4Wph1C7gbzf9J5KpFH4D7y9WLBX2pa9C1imQSWj-Wuddeihgk0Pc-ATKaNtY352A7fQ6uVDGIz7MioExXqplAzgyFu2BNIE/s1918/Capture2.PNG)

![Spring Screenshot 5](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDNf4RNO1f28bHECTkWoKdlFnpExnMqgOQeH34XUhI9uvQ_1URj-lwOW2HiDR9Q9-FwL09iUD6imTUkl0X_EaN8ogpGPu9IeA-05f39e8mpWd07y0p3XCQ6hAOUUntG6mN9mURDm8PxLOhYiStj8am74oz6s16sVewfOsJ3QZYhYIrsG1G31_LLnY4uTM/s1920/Capture3.PNG)

![Spring Screenshot 6](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiX7E5bFBQpg56nZlB4rS2Hl2vMiJyGAdZ5KRDv2uKzwR9qPenjMQyDbi_Ai8tWCPQ0nh0YTLw5kY4nwjX766GyYrzF4qxgVeXK6eU6T9D0CuIQOa8aiIXjedVgxPraIhKGXkEcZJIEg9KmpxXxD-h4T6IEGetgBXXmQkagYiezOvDFw106pI3FNJBT0Nw/s1920/Capture4.PNG)

![Spring Screenshot 7](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDljCRvfo67fRNKg7SaVxK2fY_uWZ-pqP2GpRB5Etu5p21AYTJox3pwcZ6x-2wVuRrVx3gVQimqWX9p_lLo_8NqJdPwakTaj13eyqmCJelFEbsx_eW-XC3kgFWlx-qmnCC-H7HvfxJRfwJYVUNaQMb0j8UQCwWbUmoIFGyUlyWPmded13iwvvAe7ljodM/s1920/Capture5.PNG)

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Platform Functionality](#platform-functionality)
  - [Seller Features](#seller-features)
  - [Customer Features](#customer-features)
  - [Dynamic Product Stock Management](#dynamic-product-stock-management)
  - [Order Management](#order-management)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Key Features

- **Multi-Seller Marketplace**: The platform supports multiple sellers, each of whom can create accounts, list their products under various categories, and manage orders.
  
- **Dynamic Stock Management**: Products have dynamic stock counts, which are updated automatically based on the order quantity. Products cannot be added to cart if their stock reaches zero, and stock is incremented when an order is cancelled.
  
- **Customizable Product Attributes**: Sellers can add dynamic attributes like size, color, and more. They can also specify attribute names and values according to their needs.

- **Wishlist and Cart Functionality**: Customers can easily add products to their wishlist or cart. The cart updates dynamically based on stock availability and product attributes.

- **Real-Time Order Tracking**: Customers can track their orders, while sellers can update order statuses (Pending, Shipped, Delivered, Canceled). Users also receive detailed stats on their orders.

- **Seller Dashboard with Statistics**: The platform provides sellers with a dashboard that includes real-time charts and statistics using **Chart.js**, showing data like pending orders, canceled orders, delivered orders, and more.

- **Search, Filters, and Pagination**: Customers can search products by name, filter products by category or attribute, and sort them by popularity or price. Pagination limits the number of products rendered, improving performance.

---

## Tech Stack

- **Frontend**: 
  - **React.js**: A JavaScript library for building user interfaces, used for creating dynamic and interactive UI components.
  - **Tailwind CSS**: A utility-first CSS framework for building custom designs without writing custom CSS.
  - **ShadCN UI**: A modern UI component library that provides reusable and customizable components for building the frontend.

- **Backend**: 
  - **Supabase**: An open-source backend-as-a-service that provides an instant API and PostgreSQL database for managing application data (products, orders, users, etc.).
  - **Supabase Storage**: Used for storing and serving images, such as product images uploaded by sellers.

- **User Authentication**: 
  - **Clerk**: A service for user authentication that provides features like sign-up, sign-in, and session management with support for social logins.

- **Data Visualization**: 
  - **Chart.js**: A JavaScript charting library used for visualizing order statistics (e.g., pending, canceled, delivered orders) in the seller dashboard.

---

## Platform Functionality

### Seller Features

- **Product Listing and Management**: Sellers can easily list products, upload images, and provide detailed descriptions. Each product can have multiple attributes (e.g., size, color), and sellers can customize these attributes.
  
- **Dynamic Attributes for Products**: Sellers can add attributes such as size (S, M, L, XL, etc.) or color to their products. Each attribute can have multiple values, which are dynamically rendered based on the seller's selection.

- **Product Stock Management**: Sellers can view and manage the stock of each product. When an order is placed, the stock decreases accordingly. If an order is canceled, the stock is updated again, ensuring accurate inventory management.

- **Order Management**: Sellers can view all orders related to their products, mark orders as shipped or delivered, and cancel orders if necessary. The order status is updated in real-time for customers.

- **Dashboard and Statistics**: Sellers have access to a dashboard displaying charts and data on their products and orders. Using **Chart.js**, sellers can track metrics like pending orders, canceled orders, and delivered orders, giving them an overview of their sales performance.

### Customer Features

- **Product Browsing**: Customers can browse products from various categories such as apparel, accessories, stationery, wall art, and more. Products can be filtered by attributes (e.g., size, color) and sorted by different criteria (e.g., popularity, price).

- **Wishlist**: Customers can save products they are interested in to their wishlist for future purchase. This helps them keep track of their favorite items.

- **Cart Management**: Customers can add multiple products to their cart, view product details, and adjust quantities. The cart updates dynamically based on stock availability, ensuring that products out of stock cannot be purchased.

- **Order Placement**: After adding products to their cart, customers can proceed to checkout, provide shipping details, and place their orders. They can track the status of their orders directly from the "My Orders" page.

- **Order Tracking**: Customers can monitor the status of their orders in real-time, including whether an order is pending, shipped, or delivered. Customers also have the option to cancel their orders before they are shipped.

### Dynamic Product Stock Management

Spring’s platform features dynamic stock management, ensuring accurate tracking of inventory:

- **Stock Deduction on Orders**: When a customer places an order, the stock of each product in the cart is automatically reduced by the quantity ordered.
- **Out-of-Stock Handling**: If a product runs out of stock, it will not be allowed to be added to the cart, preventing customers from ordering unavailable items.
- **Stock Restoration on Cancellations**: If an order is canceled by the customer or the seller, the stock for each affected product is automatically restored, maintaining the correct inventory levels.

### Order Management

- **Order Lifecycle**: Orders go through several stages: **Pending**, **Shipped**, **Delivered**, and **Canceled**. Customers and sellers can track the progress of orders in real-time.
- **Customer Actions**: Customers can cancel orders that have not yet been shipped. Once an order is shipped or delivered, it can no longer be canceled.
- **Seller Actions**: Sellers can change the order status to indicate its progress, such as marking an order as shipped, or canceling it if required.

---

## Frontend Overview

The frontend of Spring is built using **React.js**, providing a dynamic and responsive user experience. The UI is styled using **Tailwind CSS**, which allows for a highly customizable design. **ShadCN UI** provides reusable components to speed up development.

- **Responsive Design**: The application is fully responsive, ensuring that users can seamlessly interact with the platform on devices of any size.
- **User Interface**: The interface is intuitive and easy to navigate, with separate views for sellers and customers. Sellers can manage their products and orders, while customers can browse products, place orders, and manage their wishlists.
- **Product Pages**: Each product has its own page displaying detailed information, including images, descriptions, attributes, and available stock.
- **Cart and Checkout**: The cart dynamically updates as products are added or removed, and customers can proceed to checkout with an easy-to-follow flow.

---

## Backend Overview

The backend of the platform is powered by **Supabase**, which provides a real-time, scalable PostgreSQL database to manage tables such as products, orders, sellers, and customers.

- **Relational Database**: The platform uses relational tables with foreign keys to link data such as orders, products, and customers, ensuring data integrity.
- **Real-time Data**: Supabase’s real-time capabilities ensure that data such as product stock and order statuses are updated instantly across all connected clients.
- **User Authentication**: Authentication is handled by **Clerk**, which provides secure and scalable user management with support for social logins.

---

## Data Models

The following data models are implemented in the backend:

- **Users**: Represents both customers and sellers. Contains information like name, email, and role (customer or seller).
- **Products**: Represents products listed by sellers. Includes attributes like name, description, price, stock count, and related categories.
- **Orders**: Represents customer orders, including order status, product details, and customer information.
- **Categories**: Defines the categories and subcategories for products.
- **Wishlists**: Stores products that customers have saved for later purchase.

---

## Environment Variables

To run this project, you'll need to configure the following environment variables. You can find an example configuration in the `.env.sample` file.

- `VITE_SUPABASE_URL`: Your Supabase URL (get it from your Supabase project settings)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key (also available in Supabase project settings)
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk frontend API key (from your Clerk dashboard)

Make sure to create a `.env` file in the root of your project and set these variables.

Example `.env` configuration:

```env
VITE_SUPABASE_URL="https://your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
