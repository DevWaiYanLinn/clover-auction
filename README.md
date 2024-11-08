# Project Overview: Building a Full-Stack Application with Next.js

This project aims to build a full-stack application using Next.js and other useful libraries. It incorporates various tools commonly used in real-world applications, ensuring scalability and performance.

## Concept: Creating an Auction App Inspired by WoW

The user interface(wire frame) for my auction app draws inspiration from the game World of Warcraft (WoW), aiming for an engaging and immersive user experience.

# Current Features Implemented

As of now, the auction app includes several essential functionalities to enhance user experience:

- **Authentication**: Users can securely register and log in to their accounts, ensuring a safe environment for all transactions.
- **Item Creation**: Sellers can create and manage their listings with ease, allowing them to showcase their items effectively.
- **Email Confirmation**: A confirmation email system is in place to verify user accounts, adding an extra layer of security and trust.
- **Static Pages**: Key information about the auction process, terms of service, and user guidelines are accessible through static pages, providing users with necessary context and support.
- **Auction Creation**: Sellers can create auction listings with detailed item descriptions, starting bids, and auction end times.
- **Bidding**: Users can place bids on auctions, and the system updates the highest bid in real time.

---

# Upcoming Features to Add

## 1. **Real-Time Bidding Updates**
- **Real-time Updates**: When a bid is placed, all participants will see the updated bid amount and bidder information instantly.
- **WebSockets** or **Server-Sent Events (SSE)** will be used to broadcast bid updates to all connected clients in real-time, ensuring all users are seeing the same auction status without refreshing the page.
  
### Key Points:
- Show the current bid, last bidder, and any changes in real-time.
- Display notifications when a user is **outbid**.
- Allow real-time updates for **multiple auctions** being viewed by the user.

## 2. **Auction Countdown Timer (Remain Time)**
- Add a **countdown timer** to display how much time is left until the auction ends.
- When the timer reaches 0, the auction should automatically close, and the **final bid** will be determined as the winning bid.
  
### Key Points:
- **Live timer** updates in real-time so users know exactly how much time remains.
- Extend the auction time if a new bid is placed within the last 2 minutes (if desired).
- When time expires, automatically **close the auction** and notify the winner.

## 3. **Payment Processing for Winning Bids**
- Once an auction ends and the winning bid is determined, the **winning bidder** will be prompted to make the payment.
- Payment will be processed through **Stripe**, **PayPal**, or another integrated payment gateway.
  
### Key Points:
- After the auction closes, the system will display a **payment page** for the winning bidder.
- **Payment confirmation**: Once the payment is processed, the seller will receive a notification to ship the item.
- Allow the winning bidder to **view their payment history** and track shipping details.


## Technologies Used in the Auction App

-   **Next.js**: Framework for building the full-stack application.
-   **Crypto**: For session management and secure password hashing.
-   **Bcrypt**: For hashing passwords securely.
-   **Edge Template Engine**: Similar to Laravel's Blade, used for mail template rendering.
-   **Nodemailer**: For sending emails effectively.
-   **BullMQ**: For job management and background processing, enabling efficient task handling.
-   **Tailwind CSS**: For styling the user interface with a modern design.
-   **ShadCN**: Provides enhanced UI components built on top of Tailwind CSS for a more streamlined and customizable design experience..
-   **Prisma**: For database management and ORM
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
