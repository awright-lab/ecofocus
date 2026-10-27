import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

function context(userId, rawKey) {
 if(typeof userId!=='string'||!userId||userId.length>256||typeof rawKey!=='string'||!/^[a-f0-9]{64}$/i.test(rawKey))throw Error('Invalid viewer credential configuration');
 return {key:Buffer.from(rawKey,'hex'),aad:Buffer.from(`ecofocus:displayr-viewer:v1:${userId}`)};
}
export function encryptViewerCredential(userId, credential, rawKey) {
 const {key,aad}=context(userId,rawKey);
 if(!credential||typeof credential.email!=='string'||!credential.email.includes('@')||typeof credential.password!=='string'||credential.password.length<16)throw Error('Invalid viewer credential');
 const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(aad);
 const ciphertext=Buffer.concat([cipher.update(JSON.stringify(credential),'utf8'),cipher.final()]);
 return ['v1',iv.toString('base64url'),cipher.getAuthTag().toString('base64url'),ciphertext.toString('base64url')].join('.');
}
export function decryptViewerCredential(userId, sealed, rawKey) {
 try {
  const {key,aad}=context(userId,rawKey);
  const [version,iv,tag,data,extra]=sealed.split('.');
  if(version!=='v1'||!iv||!tag||!data||extra)throw Error();
  const decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(iv,'base64url'));
  decipher.setAAD(aad);decipher.setAuthTag(Buffer.from(tag,'base64url'));
  const value=JSON.parse(Buffer.concat([decipher.update(Buffer.from(data,'base64url')),decipher.final()]).toString('utf8'));
  if(typeof value.email!=='string'||typeof value.password!=='string')throw Error();
  return value;
 } catch {throw Error('Viewer credential unavailable');}
}

// Apply only a complete authenticated snapshot. The fetch/storage adapter must
// expose ready records only. Validate atomically before changing active mappings.
export function installViewerCredentials({viewers, viewerIds, broker, records, managedIds}) {
 if(!Array.isArray(records))throw Error('Invalid viewer credential snapshot');
 const next=new Map(), ids=new Map(), emails=new Set(), displayrIds=new Set();
 for(const record of records) {
  if(!record||typeof record.userId!=='string'||!record.userId||next.has(record.userId)||
     typeof record.email!=='string'||record.email!==record.email.trim().toLowerCase()||!record.email.includes('@')||
     typeof record.password!=='string'||!record.password||typeof record.displayrUserId!=='string'||!/^[1-9][0-9]{0,15}$/.test(record.displayrUserId)||emails.has(record.email)||displayrIds.has(record.displayrUserId))throw Error('Invalid viewer credential snapshot');
  if(viewers.has(record.userId)&&!managedIds.has(record.userId))throw Error('Legacy viewer must be migrated explicitly');
  for(const [userId,credential] of viewers)if(!managedIds.has(userId)&&credential.email===record.email)throw Error('Viewer identity already assigned');
  next.set(record.userId,{email:record.email,password:record.password});ids.set(record.userId,record.displayrUserId);emails.add(record.email);displayrIds.add(record.displayrUserId);
 }
 for(const userId of new Set([...managedIds,...next.keys()])) {
  const old=viewers.get(userId),value=next.get(userId);
  if(!value||old?.email!==value.email||old?.password!==value.password||viewerIds[userId]!==ids.get(userId))broker.invalidate(userId);
  if(value){viewers.set(userId,value);viewerIds[userId]=ids.get(userId);}else{viewers.delete(userId);delete viewerIds[userId];}
 }
 managedIds.clear();for(const id of next.keys())managedIds.add(id);
}
