# Project Overview: Building a Full-Stack Application with Next.js

This project aims to build a full-stack application using Next.js and other useful libraries. It incorporates various tools commonly used in real-world applications, ensuring scalability and performance.

## Inspiration and Concept: Creating an Auction App Inspired by a Friend and WoW

I got the idea for this project from a friend who is developing an auction app using Python. Inspired by this, I decided to create my own auction app using Next.js. The user interface(wire frame) for my auction app draws inspiration from the game World of Warcraft (WoW), aiming for an engaging and immersive user experience.

## Current Features Implemented

As of now, the auction app includes several essential functionalities to enhance user experience:

-   **Authentication**: Users can securely register and log in to their accounts, ensuring a safe environment for all transactions.
-   **Item Creation**: Sellers can create and manage their listings with ease, allowing them to showcase their items effectively.
-   **Email Confirmation**: A confirmation email system is in place to verify user accounts, adding an extra layer of security and trust.
-   **Static Pages**: Key information about the auction process, terms of service, and user guidelines are accessible through static pages, providing users with necessary context and support.

## Future Vision for Clover Auction

We envision Clover Auction as a comprehensive platform that will grow significantly over time. Our goal is to continuously upgrade and enhance the application by incorporating the best features and functionalities. This includes expanding our user experience, implementing advanced bidding options, and integrating more robust seller tools, ensuring that Clover Auction remains a leading choice in the online auction space.

## Key Features

-   **User-Driven Listings**: Users can easily sell items they want by creating listings, allowing for a dynamic marketplace.
-   **Search Functionality**: Users can search for items by name or category, making it easy to find specific products or explore different categories.
-   **Seller Reputation**: Users can view the reputation of sellers, helping them make informed decisions based on past transactions and feedback.
-   **Bidding System**: Users can place bids on items, allowing for competitive pricing and an engaging auction experience.
-   **Buyout Option**: Users can choose to buy items immediately using a buyout price, streamlining the purchasing process for those who want to secure items quickly.

## Technologies Used in the Auction App

-   **Next.js**: Framework for building the full-stack application.
-   **Crypto**: For session management and secure password hashing.
-   **Bcrypt**: For hashing passwords securely.
-   **Edge Template Engine**: Similar to Laravel's Blade, used for mail template rendering.
-   **Nodemailer**: For sending emails effectively.
-   **BullMQ**: For job management and background processing, enabling efficient task handling.
-   **Tailwind CSS**: For styling the user interface with a modern design.
-   **ShadCN**: Provides enhanced UI components built on top of Tailwind CSS for a more streamlined and customizable design experience..
-   **Prisma**: For database management and ORM, optimized for seamless performance on ARM architecture.
-   **Redis**: For caching and session management, improving performance and scalability.
-   **Zod**: A powerful library for data validation, ensuring correctness and reliability.
-   **Prisma**:Simplifies database migration, making it easy to use and accelerating development.
-   **Cloudinary**:: A cloud-based service for storing and managing images, providing easy integration for image uploads and optimization.  

## Environment Variables

To ensure the application runs smoothly, you need to set up the following environment variables in your `.env` file:

```plaintext
# Database prisma
DATABASE_URL=

# Session
JWE_PUBLIC_KEY=
JWE_PRIVATE_KEY=
SESSION_COOKIE_NAME=

# Mail
MAIL_SERVICE=
MAIL_HOST=
MAIL_USER=
MAIL_PASSWORD=

CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
```

## Acknowledgments

I would like to express my heartfelt gratitude to all my teachers for their invaluable support and guidance throughout this journey. Their knowledge and encouragement have been instrumental in helping me build this project.
