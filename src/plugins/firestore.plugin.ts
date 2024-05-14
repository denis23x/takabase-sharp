/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { getFirestore, DocumentReference } from 'firebase-admin/firestore';

const firestorePlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('firestore', getFirestore(fastifyInstance.firebase()));

  fastifyInstance.decorate('firestorePlugin', {
    addDocument: (collectionPath: string, documentData: any): Promise<DocumentReference> => {
      return fastifyInstance.firestore.collection(collectionPath).add(documentData);
    },
    getDocumentReference: (documentPath: string): DocumentReference => {
      return fastifyInstance.firestore.doc(documentPath);
    }
  });
});

export default firestorePlugin;
