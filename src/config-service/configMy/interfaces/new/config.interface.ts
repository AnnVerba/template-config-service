export interface IConfig  {


 get<T extends any>(key:string,path?: string, defaults?): T;

 set(path: string, value: any): Promise<void>;
}