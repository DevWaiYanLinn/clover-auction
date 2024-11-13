export function GET() {
    return Response.redirect(
        `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID!}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL!}&response_type=code&scope=profile email`,
    );
}