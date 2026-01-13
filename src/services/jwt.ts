import jwt from "jsonwebtoken";

type payload = {
  id: string;
  role: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export function generateToken(data: payload) {
  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
}

export function verifyToken(token: string) {
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return data as payload;
  } catch (error) {
    return null;
  }
}
