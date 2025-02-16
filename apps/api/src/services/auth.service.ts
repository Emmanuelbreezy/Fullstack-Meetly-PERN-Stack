import { AppDataSource } from "../config/database.config";
import { RegisterDTO } from "../database/dto/register.dto";
import { User } from "../database/entities/user.entity";
import { InternalServerException, NotFoundException } from "../utils/app-error";

export const registerService = async (userData: RegisterDTO) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new NotFoundException("User already exists");
    }

    const user = userRepository.create({
      ...userData,
    });
    await userRepository.save(user);

    return { user: user.omitPassword() };
  } catch (error) {
    throw new InternalServerException();
  }
};
