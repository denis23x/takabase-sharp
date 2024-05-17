/** @format */

// prettier-ignore
export const querystringUrlFirebaseStorageSchema: Record<string, any> = {
  $id: 'querystringUrlFirebaseStorageSchema',
  type: 'object',
  properties: {
    url: {
      type: 'string',
      default: `https://firebasestorage.googleapis.com/v0/b/${JSON.parse(process.env.APP_SERVICE_ACCOUNT).project_id}.appspot.com/o/seed/1.webp`,
      format: 'uri',
      pattern: '^https:\\/\\/firebasestorage\\.googleapis\\.com(:\\d+)?(\\/[-a-zA-Z0-9@:%._+~#=]*)*(\\?[;&amp;a-zA-Z0-9@:%_+.~#?&amp;\\/=]*)?(#[a-zA-Z0-9_@:%#?&amp;\\/=+-]*)?$'
    }
  },
  required: ['url'],
  additionalProperties: false
};
