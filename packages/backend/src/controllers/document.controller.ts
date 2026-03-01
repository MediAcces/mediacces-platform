import { Request, Response, NextFunction } from 'express';
import { DocumentService } from '../services/document.service';
import { DocumentType } from '../types/enums';
import { AppError } from '../utils/AppError';

export class DocumentController {
  static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('Aucun fichier fourni.', 400);
      }

      const userId = req.user!.userId;
      const documentType = req.body.type as DocumentType;

      const document = await DocumentService.uploadDocument({
        user_id: userId,
        type: documentType,
        file_url: `/uploads/${req.file.filename}`,
        original_filename: req.file.originalname,
      });

      return res.status(201).json({
        success: true,
        message: 'Document téléversé avec succès.',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const documents = await DocumentService.getUserDocuments(userId);
      return res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  }

  static async validateDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.userId;
      const { documentId } = req.params;
      const { status, rejection_reason } = req.body;

      const document = await DocumentService.validateDocument(
        documentId,
        adminId,
        status,
        rejection_reason
      );

      return res.status(200).json({
        success: true,
        message: `Document ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès.`,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }
}
