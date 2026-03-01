import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const userRepository = () => AppDataSource.getRepository(User);

export class UserService {
  static async getProfile(userId: string): Promise<Omit<User, 'password_hash'>> {
    const repo = userRepository();

    const user = await repo.findOne({
      where: { id: userId },
      relations: ['vehicles', 'documents'],
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé.', 404);
    }

    return user;
  }

  static async updateProfile(
    userId: string,
    data: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      blood_group: string;
      allergies: string;
      treating_doctor: string;
      establishment_name: string;
      address: string;
      profile_photo_url: string;
      is_online: boolean;
      current_latitude: number;
      current_longitude: number;
      action_radius_km: number;
    }>
  ): Promise<Omit<User, 'password_hash'>> {
    const repo = userRepository();

    const user = await repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('Utilisateur non trouvé.', 404);
    }

    // Check email uniqueness if being updated
    if (data.email && data.email !== user.email) {
      const existingEmail = await repo.findOne({ where: { email: data.email } });
      if (existingEmail) {
        throw new AppError('Cet email est déjà utilisé.', 409);
      }
    }

    // Update allowed fields
    Object.assign(user, data);
    const updatedUser = await repo.save(user);

    logger.info(`User profile updated: ${userId}`);
    return updatedUser;
  }
}
