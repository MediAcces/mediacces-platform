import { AppDataSource } from '../config/database';
import { Document } from '../entities/Document';
import { AppError } from '../utils/AppError';
import { DocumentType, DocumentStatus } from '../types/enums';
import logger from '../utils/logger';

const documentRepository = () => AppDataSource.getRepository(Document);

export class DocumentService {
  static async uploadDocument(data: {
    user_id: string;
    type: DocumentType;
    file_url: string;
    original_filename: string;
  }): Promise<Document> {
    const repo = documentRepository();

    const document = repo.create({
      user_id: data.user_id,
      type: data.type,
      file_url: data.file_url,
      original_filename: data.original_filename,
      validation_status: DocumentStatus.PENDING,
    });

    const savedDoc = await repo.save(document);
    logger.info(`Document uploaded: ${savedDoc.id} by user ${data.user_id}`);
    return savedDoc;
  }

  static async getUserDocuments(userId: string): Promise<Document[]> {
    const repo = documentRepository();
    return repo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  static async validateDocument(
    documentId: string,
    adminId: string,
    status: DocumentStatus,
    rejectionReason?: string
  ): Promise<Document> {
    const repo = documentRepository();

    const document = await repo.findOne({ where: { id: documentId } });
    if (!document) {
      throw new AppError('Document non trouvé.', 404);
    }

    document.validation_status = status;
    document.validated_by = adminId;
    document.validated_at = new Date();

    if (status === DocumentStatus.REJECTED && rejectionReason) {
      document.rejection_reason = rejectionReason;
    }

    const updatedDoc = await repo.save(document);
    logger.info(`Document ${documentId} ${status} by admin ${adminId}`);
    return updatedDoc;
  }
}
