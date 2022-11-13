import {IConfig} from "./configMy/interfaces/new/config.interface";


export class AdapterProvider implements IConfig {
     private adaptee:any;
    constructor(adaptee: any) {

       this.adaptee = adaptee;

    }

    watch<T extends any>(path?: string, callback: (data: T) => void = () => void 0) {
        this.adaptee.watch(path, callback);
    }


    get<T extends any>(key:string,path?: string, defaults?): T {
      return this.adaptee.get(key,path,defaults)
    }

    async set(path: string, value: any): Promise<void> {
      return this.adaptee.set(path,value)
    }
}