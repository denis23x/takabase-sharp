/** @format */

// prettier-ignore
export const partsFirebaseUrlStorageSchema: Record<string, any> = {
  $id: 'partsFirebaseUrlStorageSchema',
  type: 'string',
  example: 'https://firebasestorage.googleapis.com/v0/b/takabase-local.appspot.com/o/seed/1.webp',
  pattern: '^https:\\/(\\/)?firebasestorage\\.googleapis\\.com\\/v0\\/b\\/[a-zA-Z0-9-]+\\.appspot\\.com\\/o\\/.*$'
};
