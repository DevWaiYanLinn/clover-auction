const config = {
    session: {
        jwePublicKey: process.env.JWE_PUBLIC_KEY!,
        jwePrivateKey: process.env.JWE_PRIVATE_KEY!,
        cookieName: process.env.SESSION_COOKIE_NAME!,
        alg: process.env.JWE_ALG!,
        enc: process.env.JWE_ENC!,
    },
    mail: {
        service: process.env.MAIL_SERVICE!,
        host: process.env.MAIL_HOST!,
        port: Number(process.env.MAIL_PORT!),
        auth: {
            user: process.env.MAIL_USER!,
            pass: process.env.MAIL_PASSWORD!,
        },
        from: process.env.MAIL_FROM,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
    },
    redis: {
        port: Number(process.env.REDIS_PORT!),
        host: process.env.REDIS_HOST!,
        password: process.env.REDIS_PASSWORD!,
        url: process.env.REDIS_URL!,
    },
};

export default config;
