import {en} from './en';


export const getString = (name:number): string =>{
    if(en[name]) return en[name];
    return '';
}