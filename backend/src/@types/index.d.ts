import { User } from "../database/entities/user.entity";
declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}
