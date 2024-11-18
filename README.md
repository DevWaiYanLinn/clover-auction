# Project Overview: Building a Full-Stack Application with Next.js

This project aims to build a full-stack application using Next.js and other useful libraries. It incorporates various tools commonly used in real-world applications, ensuring scalability and performance.

## Auction
![image](https://github.com/user-attachments/assets/893d03d5-c0de-40b5-b2cf-eb2b058d0389)
## Bid Ranking
![image](https://github.com/user-attachments/assets/c45ee69a-1bb6-45f6-b779-1e9ac2bb0fd6)
## Item list
![image](https://github.com/user-attachments/assets/dbb2212d-ce72-4dc0-a1c3-b0bbc3279c02)
## Create Item
![image](https://github.com/user-attachments/assets/03e5aab8-8203-4d99-bd32-dbff7e6d21a4)
## Create Auction
![image](https://github.com/user-attachments/assets/1d323c46-b6cd-4029-ace3-f5926c040afd)


## Important

-   Currently **Clover Auction** is not stable and keep developing.
-   You can meet dependencies conflict when "npm install" because of "Shadcn".Don't worry you can fix it using "npm --legacy-peer-deps install".
-   You have to read prisma documentation to migrate database.
-   Real time bidding and mail service will not workling if you don't setup redis server
-   Before cloning and setting up this project, you must first set up and run the [Socket Server](https://github.com/DevWaiYanLinn/clover-auction-socket-server)
    .

## Concept: Creating an Auction App Inspired by WoW

The user interface of auction for my auction app draws inspiration from the game World of Warcraft (WoW), aiming for an engaging and immersive user experience.

## Current Features Implemented

As of now, the auction app includes several essential functionalities to enhance user experience:

-   **Authentication**: Users can securely register and log in to their accounts, ensuring a safe environment for all transactions.
-   **Item Creation**: Sellers can create and manage their listings with ease, allowing them to showcase their items effectively.
-   **Email Confirmation**: A confirmation email system is in place to verify user accounts, adding an extra layer of security and trust.
-   **Static Pages**: Key information about the auction process, terms of service, and user guidelines are accessible through static pages, providing users with necessary context and support.
-   **Auction Creation**: Sellers can create auction listings with detailed item descriptions, starting bids, and auction end times.
-   **Bidding**: Users can place bids on auctions, and the system updates the highest bid in real time.

---
## Need to fix
-   **Remove Server Actions for performance reason**

## Upcoming Features to Add
-   **Admin Dashboard & User Dashboard**
-   **Payment Processing for Winning Bids**

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
    development.
-   **Cloudinary**:: A cloud-based service for storing and managing images, providing easy integration for image uploads and optimization.

## Environment Variables

To ensure the application runs smoothly, you need to set up the following environment variables in your `.env` file:

```env
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
TEST_MAIL=

# Cloudinary
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=

# IoRedis (you dont need to set url in dev mode)
REDIS_URL=


# Google Auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
GOOGLE_USER_INFO_URL=
GOOGLE_OAUTH_URL=
```

## Conclusion

This project was an important milestone in my journey as a full-stack developer, built before my move to Japan. It allowed me to refine my skills in both backend and frontend technologies, while also deepening my understanding of web development practices.

## Acknowledgments

I would like to express my heartfelt gratitude to all my teachers for their invaluable support and guidance throughout this journey. Their knowledge and encouragement have been instrumental in helping me build this project.

## LICENSE

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
