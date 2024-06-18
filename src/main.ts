import * as Comlink from 'comlink';
import Worker from './worker?worker&inline';
import { SDK } from './worker';
import { Buffer } from 'buffer'




const LinkedSDK = Comlink.wrap<typeof SDK>(new Worker());

export class Tree {
  	workerApi: any;
	public hashFn: any;
	public leavesHashes: any[];
	public minID = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
	public maxID = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];


	constructor(hashFn){
		this.hashFn = hashFn;
		this.leavesHashes = [];
	}

  public async init() {
    this.workerApi = await new LinkedSDK();
    await this.workerApi.run();
  }

  async push(data) {

		let nId = data.slice(0, 29);
	
			if (nId < this.minID) {
				this.minID = nId;
			}
			if (nId > this.maxID) {
				this.maxID = nId;
			}
		

		this.leavesHashes.push(await this.hashLeaf(data));
	}

  async hashLeaf(data) {
		let h = this.hashFn(data);
		let d = Uint8Array.from(h);
		let ret =  await this.workerApi.hashToElement(d);
		return ret;
	}



	async getRoot() {
	
		if (this.leavesHashes.length === 0) {
			return await this.emptyRoot();
		}

		console.log("leaves num:", this.leavesHashes.length);

		let buf =  Buffer.from(this.leavesHashes[0])
		for (let i = 1; i < this.leavesHashes.length; i++) {
			buf = Buffer.concat([buf, Buffer.from(this.leavesHashes[i])]);
		}

		let left = (4096- this.leavesHashes.length) * 32;
		buf = Buffer.concat([buf, Buffer.alloc(left, 0)]);
		let em =  await this.workerApi.blobToKzgCommitment(buf);
		let root = [];
		for (let i =0; i < 29; i++ ){
			root.push(this.minID[i])
		}
		for (let i =0; i < 29; i++) {
			root.push(this.maxID[i])
		}

		for (let i = 0; i < em.byteLength; i++) {
			root.push(em[i]);
		}
		return root;
	}

  async emptyRoot() {
		let root = [];
		for (let i = 0; i < 29; i++) {
			root.push(0)
		}
		for (let i = 0; i < 29; i++) {
			root.push(0)
		}
		let em =  await this.workerApi.emptyG1();
		for (let i = 0; i < em.byteLength; i++) {
            root.push(em[i]);
        }
		return root;
	}
}
