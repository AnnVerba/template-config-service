import { get } from 'lodash';

import * as YAML from 'yamljs';
import { Logger, OnModuleInit } from '@nestjs/common';
import { ConfigStore } from './config.store';
import { ConfigSyncException } from './exceptions/config-sync.exception';
import { NO_NAME_PROVIDE } from './config.messages';
import dotenv from 'dotenv'

import {IConfig} from "./interfaces/new/config.interface";
import {sleep} from "../sleep.util";

export class EnvConfig implements IConfig, OnModuleInit {
    private readonly retryInterval = 5000;
    private readonly logger = new Logger('ConfigModule');

    constructor(
        private readonly store: ConfigStore,
        private readonly client,
        private readonly name: string,

    ) {
    }

    async onModuleInit() {
        dotenv.config()
        if (!this.name) {
            throw new Error(NO_NAME_PROVIDE);
        }
        while (true) {
            try {
                const result = process.env;
                const data = get(result, this.name,  'Env five dont have sach key');
                try {
                    this.store.data = data;
                } catch (e) {
                    this.logger.error('parse config data error', e);
                    this.store.data = {};
                }
                this.logger.log('ConfigModule initialized');
                break;
            } catch (e) {
                this.logger.error('Unable to initial ConfigModule, retrying...', e);
                await sleep(this.retryInterval);
            }
        }
    }

    get<T extends any>(path?: string, defaults?): T {
        if (!path) {
            return this.store.data;
        }
        return get(this.store.data, path, defaults);
    }

    async set(path: string, value: any): Promise<void> {
      // can i use fs to write to env file?
    }


}
