import * as Comlink from 'comlink';
import './wasm_exec.js';
import initWasm from './element.wasm?init';

declare const Go: any;

export class SDK {

  async run() {
    const go = new Go();
    go.run( await initWasm(go.importObject));
  }

  async emptyG1() : Promise<Uint8Array> {
    return await emptyG1();
  }

  async hashToElement(data: Uint8Array) : Promise<Uint8Array> {
	return await hashToElement(data);
  }
}

declare function emptyG1(): Promise<Uint8Array>;
declare function hashToElement(data: Uint8Array): Promise<Uint8Array>;

Comlink.expose(SDK);


