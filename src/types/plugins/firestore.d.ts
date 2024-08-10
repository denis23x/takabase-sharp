/** @format */

import type { Firestore } from 'firebase-admin/firestore';
import type { DocumentReference } from 'firebase-admin/lib/firestore';

declare module 'fastify' {
  interface FastifyInstance {
    firestore: Firestore;
    firestorePlugin: {
      addDocument: (collectionPath: string, documentData: any) => Promise<DocumentReference>;
      getDocumentReference: (documentPath: string) => DocumentReference;
    };
  }
}

export {};
