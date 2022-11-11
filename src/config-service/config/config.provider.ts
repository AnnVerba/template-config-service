import { get } from 'lodash';

import { Logger, OnModuleInit } from '@nestjs/common';
import { ConfigStore } from './config.store';

import { IConfig } from './interfaces/config.interface';
import { sleep } from '../sleep.util';

import * as fs from 'fs';
import { RequiredEnvVariablesEnum } from './config.enum';

export class ProviderConfig implements IConfig, OnModuleInit {
  private readonly retryInterval = 5000;
  private readonly logger = new Logger('ConfigModule');

  constructor(private readonly store: ConfigStore) {
    Object.values(RequiredEnvVariablesEnum).forEach((key) => {
      if (!process.env[key]) {
        throw new Error(`Key must be provided: ${key}`);
      }
    });
  }

  async onModuleInit() {
    let data;
    Object.values(RequiredEnvVariablesEnum).forEach((key) => {
      data += process.env[key];
    });
    return data;
  }

  get<T>(keys: object): T {
    let data;
    Object.values(keys).forEach((key) => {
      data += process.env[key];
    });
    return data;
  }

  async set(path: string, value: any): Promise<void> {
    this.store.update(path, value);
    const dataString = JSON.stringify(this.store.data);

    fs.appendFile('.env', dataString, (err) => {
      if (err) throw new Error(err.message + err.stack);
      console.log('The store were updated!');
    });
  }
  watch<T>(path: string, callback: (data: T) => void) {
    this.store.watch(path, callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private async createWatcher() {}
}
