import { ConsulConfig } from './config.consul';

import {EnvConfig} from './config.env';
import { NO_DEPS_MODULE_FOUND } from './config.messages';

import { ConfigOptions } from './interfaces/config-options.interface';
import { ConfigStore } from './config.store';

export class ConfigFactory {
    constructor(
        private readonly store: ConfigStore,
        private readonly options: ConfigOptions,
    ) {
    }

    async create(backend: string, ref: any) {
        let client;
        switch (backend) {
            case 'CONSUL':
                client = new ConsulConfig(this.store, ref, this.options.name);
                break;
            default:
                client = new EnvConfig(this.store, ref, this.options.name);
        }

        try {
            await client.onModuleInit();
        } catch (e) {
        }
        return client;
    }
}
