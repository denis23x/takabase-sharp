/** @format */

export const metadataSchema: Record<string, any> = {
  $id: 'metadataSchema',
  type: 'object',
  properties: {
    format: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    width: {
      type: 'number'
    },
    height: {
      type: 'number'
    },
    space: {
      type: 'string'
    },
    channels: {
      type: 'number'
    },
    depth: {
      type: 'string'
    },
    density: {
      type: 'number'
    },
    isProgressive: {
      type: 'boolean'
    },
    paletteBitDepth: {
      type: 'number'
    },
    hasProfile: {
      type: 'boolean'
    },
    hasAlpha: {
      type: 'boolean'
    }
  }
};
