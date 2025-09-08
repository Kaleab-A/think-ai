import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../config/app.config";

export type AccessTPayload = {
  userId: string;
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: "1d",
  secret: config.JWT_SECRET,
};

export const signJwtToken = (
  payload: AccessTPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  const token = jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });

  const decodedToken = jwt.decode(token) as JwtPayload | null;
  const expiresAt = decodedToken?.exp ? decodedToken.exp * 1000 : null;

  return {
    token,
    expiresAt,
  };
};
