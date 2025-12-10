import { SessionOptions } from "iron-session";

export interface SessionData {
    user?: {
        uid: number;
        username: string;
        db: string;
        isLoggedIn: boolean;
        groups: string[];
    };
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD || "complex_password_at_least_32_characters_long",
    cookieName: "vivo_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};
