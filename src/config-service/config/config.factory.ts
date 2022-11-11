import { ProviderConfig } from './config.provider';

import { ConfigStore } from './config.store';
import {ConfigurationService} from "./configuration.service";
import {ConfigOptions} from "./interfaces/config-options.interface";
import {AdapterProvider} from "../adapter.provider";

import {Inject} from "@nestjs/common";

export class ConfigFactory {

    constructor(
        private readonly store: ConfigStore,
        private readonly options: ConfigOptions,

    ) {
    }

    async create(backend: string, ref: any) {
        let client;
        switch (backend) {
            case 'PROVIDER':
                client = new AdapterProvider(ProviderConfig);
                break;

            default:
                client = new ProviderConfig(this.store);
                break;
        }

        try {
            await client.onModuleInit();
        } catch (e) {
        }
        return client;
    }
}
