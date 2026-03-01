export enum UserRole {
  PATIENT = 'patient',
  CHAUFFEUR = 'chauffeur',
  COURSIER = 'coursier',
  HOPITAL = 'hopital',
  PHARMACIE = 'pharmacie',
  ADMIN = 'admin',
}

export enum VehicleType {
  AMBULANCE = 'ambulance',
  VSL = 'vsl',
  MOTO = 'moto',
  VELO = 'velo',
}

export enum ServiceType {
  TRANSPORT_URGENCE = 'transport_urgence',
  TRANSPORT_PROGRAMME = 'transport_programme',
  LIVRAISON_MEDICAMENTS = 'livraison_medicaments',
}

export enum TripStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EN_ROUTE_PICKUP = 'en_route_pickup',
  ARRIVED_PICKUP = 'arrived_pickup',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMode {
  ORANGE_MONEY = 'orange_money',
  MTN_MONEY = 'mtn_money',
  CARTE_BANCAIRE = 'carte_bancaire',
  ESPECES = 'especes',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum DocumentType {
  PERMIS = 'permis',
  CARTE_GRISE = 'carte_grise',
  ASSURANCE = 'assurance',
  AGREMENT_AMBULANCE = 'agrement_ambulance',
  CARTE_COURSIER = 'carte_coursier',
  LICENCE_PHARMACIE = 'licence_pharmacie',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum NotificationType {
  TRIP_REQUEST = 'trip_request',
  TRIP_ACCEPTED = 'trip_accepted',
  TRIP_STARTED = 'trip_started',
  TRIP_COMPLETED = 'trip_completed',
  TRIP_CANCELLED = 'trip_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  DOCUMENT_APPROVED = 'document_approved',
  DOCUMENT_REJECTED = 'document_rejected',
  GENERAL = 'general',
}
