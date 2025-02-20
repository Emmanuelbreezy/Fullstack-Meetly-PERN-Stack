import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../config/database.config";
import { LoginDTO, RegisterDTO } from "../database/dto/auth.dto";
import { User } from "../database/entities/user.entity";
import {
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { signJwtToken } from "../utils/jwt";

export const registerService = async (userData: RegisterDTO) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new NotFoundException("User already exists");
    }
    const username = await generateUsername(userData.name);
    const user = userRepository.create({
      ...userData,
      username: username,
    });
    await userRepository.save(user);

    return { user: user.omitPassword() };
  } catch (error) {
    throw new InternalServerException();
  }
};

export const loginService = async (userData: LoginDTO) => {
  try {
    const { email, password } = userData;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // Compare the provided password with the hashed password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email/Password not correct");
    }

    const accessToken = signJwtToken({ userId: user.id });
    return { user: user.omitPassword(), accessToken };
  } catch (error) {
    throw new InternalServerException();
  }
};

const generateUsername = async (name: string): Promise<string> => {
  // Clean the name to create a base username
  // Remove spaces and convert to lowercase
  const cleanName = name.replace(/\s+/g, "").toLowerCase();
  const baseUsername = cleanName;
  // Generate a UUID suffix (e.g., "a1b2c3d4")
  const uuidSuffix = uuidv4().split("-")[0]; // Use the first part of the UUID
  // Create the username with the UUID suffix
  let username = `${baseUsername}${uuidSuffix}`;
  // Check if the username already exists
  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOne({
    where: { username },
  });
  // If the username exists, generate a new one with a different UUID suffix
  if (existingUser) {
    username = `${baseUsername}${uuidv4().split("-")[0]}`;
  }
  return username;
};
