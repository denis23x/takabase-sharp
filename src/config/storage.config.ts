/** @format */

import { config } from 'dotenv';

config({
  path: '.env.takabase-local',
  override: false
});

// https://cloud.google.com/storage/docs/introduction

const storageConfigList: Record<string, any> = {
  localhost: {
    projectId: 'takabase-local',
    bucket: 'takabase-local.appspot.com'
  },
  development: {
    projectId: 'takabase-dev',
    bucket: 'takabase-dev.appspot.com'
  },
  production: {
    projectId: 'takabase-prod',
    bucket: 'takabase-prod.appspot.com'
  }
};

export const storageConfig: Record<string, any> = storageConfigList[String(process.env.APP_NODE_ENV)];
