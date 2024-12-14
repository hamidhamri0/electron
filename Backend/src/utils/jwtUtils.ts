import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const token = jwt.sign({ id: userId }, "process.env.JWT_SECRET" as string, {
    expiresIn: "1h",
  });
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, "process.env.JWT_SECRET" as string);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const createRefreshToken = (userId: string) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
  return refreshToken;
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    return decoded;
  } catch (error) {
    return null;
  }
};
