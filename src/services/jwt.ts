import jwt from "jsonwebtoken";

type payload = {
  id: string;
};

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not definded");
}

export function generateToken(data: payload) {
  const token = jwt.sign(data, JWT_SECRET as string, {
    expiresIn: "7d",
  });
  return token;
}

export function verifyToken(token: string) {
  try {
    const data = jwt.verify(token, JWT_SECRET as string);
    return data as payload;
  } catch (error) {
    return null;
  }
}
