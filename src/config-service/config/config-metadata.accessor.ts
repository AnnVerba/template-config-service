import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
interface ConfigValueMetadata {
    property: string;
    name: string;
    defaults: any;
}
@Injectable()
export class ConfigMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getConfigValues(target: Function): ConfigValueMetadata[] | undefined {
        try {
            return this.reflector.get('PROVIDER', target);
        } catch (e) {
            return;
        }
    }
}
