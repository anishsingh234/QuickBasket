import jwt from "jsonwebtoken";

type payload = {
  id: string;
  role: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be defined in production environment");
}

const SECRET = JWT_SECRET || "dev-secret-key-not-for-production";

export function generateToken(data: payload) {
  const token = jwt.sign(data, SECRET, {
    expiresIn: "7d",
  });
  return token;
}

export function verifyToken(token: string) {
  try {
    const data = jwt.verify(token, SECRET);
    return data as payload;
  } catch {
    return null;
  }
}
