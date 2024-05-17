/** @format */

// prettier-ignore
export const querystringUrlSchema: Record<string, any> = {
  $id: 'querystringUrlSchema',
  type: 'object',
  properties: {
    url: {
      type: 'string',
      default: 'https://placehold.co/512x512/png',
      format: 'uri',
      pattern: '^(https?:\\/\\/)?((([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,})|(([0-9]{1,3}\\.){3}[0-9]{1,3}))(:\\d+)?(\\/[-a-zA-Z0-9@:%._+~#=]*)*(\\?[;&amp;a-zA-Z0-9@:%_+.~#?&amp;//=]*)?(#[a-zA-Z0-9_@:%#?&amp;//=+-]*)?$'
    }
  },
  required: ['url'],
  additionalProperties: false
};
