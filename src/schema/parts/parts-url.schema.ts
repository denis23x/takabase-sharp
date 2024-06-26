/** @format */

// prettier-ignore
export const partsUrlSchema: Record<string, any> = {
  $id: 'partsUrlSchema',
  type: 'string',
  example: 'https://placehold.co/512x512/png',
  pattern: '^https:\\/(\\/)?[a-zA-Z0-9\\-\\.]+\\.[a-zA-Z]{2,}(\\/\\S*)?$'
};
