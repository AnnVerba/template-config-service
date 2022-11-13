import { get, set, isArray, isString, isObject } from 'lodash';
import { objectToMap } from '../common';
import { compile } from 'handlebars';

export class ConfigStore {
    private _data: any = {};
    private readonly _map: { [key: string]: any } = {};

    public get data() {
        return this._data;
    }

    public set data(data: any) {
        this._data = data;
        if (isObject(this._data)) {
            for (const key in this._data) {
                if (this._data.hasOwnProperty(key)) {
                    this.compileWithEnv(key, this._data, this._data[key]);
                }
            }
        }
        this.updateConfigMap();
    }

    public update(path: string, value: any) {
        set(this._data, path, value);
        this.updateConfigMap();
    }



    public get<T extends any>(path: string, defaults?: T): T {
        return get(this._data, path, defaults);
    }


    private compileWithEnv(key: string | number, parent: any, config: any) {
        if (isString(config)) {
            const template = compile(config.replace(/\${{/g, '{{'));
            parent[key] = template({ ...this._data });
        } else if (isArray(config)) {
            config.forEach((item, index) => this.compileWithEnv(index, config, item));
        } else if (isObject(config)) {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    this.compileWithEnv(key, config, config[key]);
                }
            }
        }
    }

    private updateConfigMap() {
        const configMap = objectToMap(this._data);
        for (const key in configMap) {
            if (this._map[key] !== configMap[key]) {
                this._map[key] = configMap[key];
            }
        }
    }
}
