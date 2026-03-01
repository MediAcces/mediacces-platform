import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MédiAccès Services API',
      version: '1.0.0',
      description:
        'API de la plateforme MédiAccès - Transport médicalisé et livraison de médicaments en Côte d\'Ivoire',
      contact: {
        name: 'MédiAccès Support',
        email: 'support@mediacces.ci',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Authentification', description: 'Inscription, connexion et vérification OTP' },
      { name: 'Utilisateur', description: 'Gestion du profil utilisateur' },
      { name: 'Documents', description: 'Téléversement et validation de documents' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
