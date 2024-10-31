# Project Overview: Building a Full-Stack Application with Next.js

This project aims to build a full-stack application using Next.js and other useful libraries. It incorporates various tools commonly used in real-world applications, ensuring scalability and performance.

## Inspiration and Concept: Creating an Auction App Inspired by a Friend and WoW

I got the idea for this project from a friend who is developing an auction app using Python. Inspired by this, I decided to create my own auction app using Next.js. The user interface for my auction app draws inspiration from the game World of Warcraft (WoW), aiming for an engaging and immersive user experience.

## Key Features

- **User-Driven Listings**: Users can easily sell items they want by creating listings, allowing for a dynamic marketplace.
- **Search Functionality**: Users can search for items by name or category, making it easy to find specific products or explore different categories.
- **Seller Reputation**: Users can view the reputation of sellers, helping them make informed decisions based on past transactions and feedback.
- **Bidding System**: Users can place bids on items, allowing for competitive pricing and an engaging auction experience.
- **Buyout Option**: Users can choose to buy items immediately using a buyout price, streamlining the purchasing process for those who want to secure items quickly.

## Technologies Used in the Auction App

- **Next.js**: Framework for building the full-stack application.
- **Crypto**: For session management and secure password hashing.
- **Bcrypt**: For hashing passwords securely.
- **Edge Template Engine**: Similar to Laravel's Blade, used for templating and rendering.
- **Nodemailer**: For sending emails effectively.
- **BullMQ**: For job management and background processing, enabling efficient task handling.
- **Tailwind CSS**: For styling the user interface with a modern design.
- **ShadCN**: For enhanced UI components, providing a polished look.
- **Prisma**: For database management and ORM, optimized for seamless performance on ARM architecture.
- **Redis**: For caching and session management, improving performance and scalability.

## Environment Variables

To ensure the application runs smoothly, you need to set up the following environment variables in your `.env` file:

```plaintext
DATABASE_URL='your_database_url'
SESSION_SECRET='your_session_secret'
SESSION_SECRET_IV='your_session_secret_iv'
ENCRYPTION_METHOD='aes-256-cbc'
SESSION_COOKIE_NAME='your_session_cookie_name'
MAILER_EMAIL='your_email'
MAILER_EMAIL_PASSWORD='your_email_password'
MAILER_EMAIL_FROM='your_email_from'
```

## Acknowledgments

I would like to express my heartfelt gratitude to all my teachers for their invaluable support and guidance throughout this journey. Their knowledge and encouragement have been instrumental in helping me build this project.
