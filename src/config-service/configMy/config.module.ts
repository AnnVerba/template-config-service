
import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS_PROVIDER } from './config.constants';
import { ConfigFactory } from './config.factory';
import { DiscoveryModule } from '@nestjs/core';

import { NO_DEPS_MODULE_FOUND } from './config.messages';
import { ConfigOptions } from './interfaces/config-options.interface';
import { ConfigStore } from './config.store';
import {IConfig} from "./interfaces/new/config.interface";



@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [],
})
export class ConfigModule {
    private static CONFIG_PREFIX = 'config';

    public static forRootAsync(options: ConfigOptions = { name: '' }): DynamicModule {
        const inject = options.inject || [];

        const configProvider = {
            provide: 'CONFIG',
            useFactory: async (options: ConfigOptions, store: ConfigStore, ...params: any[]): Promise<IConfig> => {
                const factory = new ConfigFactory(store, options);
                const consul = params[inject.indexOf('CONSUL')];
                if (consul) {
                    return factory.create('CONSUL', consul);
                }

                const env = params[inject.indexOf('env')];
                if (env) {
                    return factory.create('env', env);
                }


            },
            inject: [CONFIG_OPTIONS_PROVIDER, ConfigStore, ...inject],
        };
        return {
            global: true,
            module: ConfigModule,
            providers: [ configProvider, ConfigStore],
            exports: [configProvider],
        };
    }
}
