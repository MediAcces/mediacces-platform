import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      return res.status(201).json({
        success: true,
        message: 'Inscription réussie. Bienvenue sur MédiAccès !',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return res.status(200).json({
        success: true,
        message: 'Connexion réussie.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.requestOtp(req.body.phone);
      return res.status(200).json({
        success: true,
        message: 'Code OTP envoyé par SMS.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.verifyOtp(req.body);
      return res.status(200).json({
        success: true,
        message: 'Numéro de téléphone vérifié avec succès.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
