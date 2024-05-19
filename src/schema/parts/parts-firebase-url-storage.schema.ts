/** @format */

// prettier-ignore
export const partsFirebaseUrlStorageSchema: Record<string, any> = {
  $id: 'partsFirebaseUrlStorageSchema',
  type: 'string',
  example: `https://firebasestorage.googleapis.com/v0/b/${JSON.parse(process.env.APP_SERVICE_ACCOUNT).project_id}.appspot.com/o/seed/1.webp`,
  pattern: '^https:\\/\\/firebasestorage\\.googleapis\\.com(:\\d+)?(\\/[-a-zA-Z0-9@:%._+~#=]*)*(\\?[;&amp;a-zA-Z0-9@:%_+.~#?&amp;\\/=]*)?(#[a-zA-Z0-9_@:%#?&amp;\\/=+-]*)?$'
};
