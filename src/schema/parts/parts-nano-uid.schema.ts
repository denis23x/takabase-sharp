/** @format */

export const partsNanoUidSchema: Record<string, any> = {
  $id: 'partsNanoUidSchema',
  type: 'string',
  minLength: 12,
  pattern: '^[a-zA-Z0-9]{12,}\\.webp$'
};
