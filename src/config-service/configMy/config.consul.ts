import { Consul } from 'consul';
import { get } from 'lodash';
import * as YAML from 'yamljs';
import { Logger, OnModuleInit } from '@nestjs/common';

import { ConfigStore } from './config.store';
import { ConfigSyncException } from './exceptions/config-sync.exception';

import { NO_NAME_PROVIDE } from './config.messages';
import {IConfig} from "./interfaces/new/config.interface";
import {sleep} from "../sleep.util";


export class ConsulConfig implements IConfig, OnModuleInit {
    private readonly retryInterval: 5000;

    private readonly logger = new Logger('ConfigModule');

    constructor(
        private readonly store: ConfigStore,
        private readonly consul: Consul,
        private readonly name: string,
    ) {
    }

    async onModuleInit() {
        if (!this.name) {
            throw new Error(NO_NAME_PROVIDE);
        }
        while (true) {
            try {
                const result = await this.consul.kv.get(this.name);
                this.store.data = result ? YAML.parse(result.Value) : {};

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

    async set(path: string, value: any) {
        this.store.update(path, value);
        const yamlString = YAML.stringify(this.store.data);
        try {
            await this.consul.kv.set(this.name, yamlString);
        } catch (e) {
            throw new ConfigSyncException(e.message, e.stack);
        }
    }

}
