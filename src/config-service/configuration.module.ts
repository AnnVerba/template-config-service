import {DynamicModule, Module} from '@nestjs/common';

import {DiscoveryModule} from "@nestjs/core";
import {ConfigMetadataAccessor} from "./config/config-metadata.accessor";
import {ConfigOrchestrator} from "./config/config.orchestrator";
import {ConfigOptions} from "./configMy/interfaces/new/config-options.interface";
import {ConfigStore} from "./config/config.store";
import {ConfigFactory} from "./config/config.factory";
import {ConfigExplorer} from "./config/config.explorer";
import {IConfig} from "./configMy/interfaces/new/config.interface";

@Module({
  imports: [DiscoveryModule],
  providers: [ConfigMetadataAccessor, ConfigOrchestrator],
})
export class ConfigurationModule { private static CONFIG_PREFIX = 'config';

  public static forRootAsync(options: ConfigOptions= { name: '' }): DynamicModule {
    const inject = options.inject || [];

    const configProvider = {
      provide: 'CONFIG',
      useFactory: async (options: ConfigOptions, store: ConfigStore, ...params: any[]): Promise<IConfig> => {
        const factory = new ConfigFactory(store, options);
        const provider = params[inject.indexOf('PROVIDER')];
        try {
          return factory.create('PROVIDER', provider);
        }catch (e) {
          throw new Error(e.message)
        }
      },

      inject: ['CONFIG_OPTIONS_PROVIDER', ConfigStore, ...inject],
    };
    return {
      global: true,
      module: ConfigurationModule,
      providers: [ configProvider, ConfigStore, ConfigExplorer],
      exports: [configProvider],
    };
  }}
