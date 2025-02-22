import { User } from "../database/entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      dto?: any;
    }
    interface User {
      id: string;
    }
  }
}
