import { Address, TonClient4 } from "@ton/ton";
import { Buffer } from "buffer";
import { CHAIN } from "@tonconnect/ui-react";

class TonApiService {
  client: TonClient4;

  static create(client: string | TonClient4): TonApiService {
    // Добавим этот код для автоматического определения сети
    if (typeof client === 'string' && client.startsWith('test')) {
      client = CHAIN.TESTNET;
    } else if (typeof client === 'string' && client.startsWith('main')) {
      client = CHAIN.MAINNET;
    }

    if (client === CHAIN.MAINNET) {
      client = new TonClient4({
        endpoint: 'https://mainnet-v4.tonhubapi.com'
      });
    } else if (client === CHAIN.TESTNET) {
      client = new TonClient4({
        endpoint: 'https://testnet-v4.tonhubapi.com'
      });
    }
    return new TonApiService(client as TonClient4);
  }

  constructor(client: TonClient4) {
    this.client = client;
  }

  async getWalletPublicKey(address: string): Promise<Buffer> {
    const masterAt = await this.client.getLastBlock();
    const result = await this.client.runMethod(
      masterAt.last.seqno, Address.parse(address), 'get_public_key', []
    );
    return Buffer.from(result.reader.readBigNumber().toString(16).padStart(64, '0'), 'hex');
  }

  async getAccountInfo(address: string): Promise<any> {
    const masterAt = await this.client.getLastBlock();
    return await this.client.getAccount(masterAt.last.seqno, Address.parse(address));
  }
}

export default TonApiService;
