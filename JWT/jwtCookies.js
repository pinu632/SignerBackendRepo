import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET

export const GenerateTokenandSetCookies = (userId, res) => {
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "15d"
    });

    return res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,
        sameSite: "None", // must be "None" for cross-site cookies
        secure: true, // true on Render
    });
}