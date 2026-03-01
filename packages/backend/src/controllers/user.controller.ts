import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await UserService.getProfile(userId);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await UserService.updateProfile(userId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès.',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
