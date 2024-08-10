/** @format */

import fp from 'fastify-plugin';
import { getFirestore } from 'firebase-admin/firestore';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { DocumentReference, Firestore } from 'firebase-admin/firestore';

const firestorePlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  const firestore: Firestore = getFirestore(fastifyInstance.firebase());

  fastifyInstance.decorate('firestore', firestore);

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
