export type ViewerCredential = {email:string;password:string};
export function encryptViewerCredential(userId:string, credential:ViewerCredential, rawKey:string):string;
export function decryptViewerCredential(userId:string, sealed:string, rawKey:string):ViewerCredential;
export function installViewerCredentials(input:unknown):void;
