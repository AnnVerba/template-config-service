export interface IConfig  {
 watch<T extends any>(path: string, callback: (data: T) => void): void;

 getOptions?(): any;

 get<T extends any>(key:string,path?: string, defaults?): T;

 set(path: string, value: any): Promise<void>;
}