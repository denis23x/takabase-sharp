/** @format */

export const partsFirebaseUidSchema: Record<string, any> = {
  $id: 'partsFirebaseUidSchema',
  type: 'string',
  minLength: 20,
  pattern: '^[a-zA-Z0-9_-]{20,}$'
};
