import { EventEmitter } from 'node:events'
import { v4 as uuidv4 } from 'uuid';

class Bank extends EventEmitter {
    constructor() {
        super();
        this.clientsBase = new Map();

        this.on('add', this.#add.bind(this));

        this.on('get', this.#get.bind(this));

        this.on('withdraw', this.#withdraw.bind(this));
    }

    register ( {name, balance} ) {
        if (balance <= 0) {
                throw new Error(`Wrong balance value`)
            }

        for (const client of this.clientsBase.values()) {
            if (client.name === name) {
                throw new Error(`Client is already in the data base`)
            };
        }

        const id = uuidv4();
        this.clientsBase.set(id, {name, balance});
        return id;
    }

    #idCheck(id) {
        if (!id) {
            this.emit('error', new Error(`id does't exist`));
            return
        }
    }

    #add(id, amount) {
        if (amount <= 0) {
            throw new Error(`Wrong amount value`);
        }

        const client = this.clientsBase.get(id);
        this.#idCheck(client);
        client.balance += amount;
    }

    #get(id, balanceStatus) {
        const client = this.clientsBase.get(id);
        this.#idCheck(client);
        balanceStatus(client.balance);
    }

    #withdraw(id, amount) {
        if (amount <= 0) {
            throw new Error(`Wrong amount value`);
        }

        const client = this.clientsBase.get(id);
        this.#idCheck(client);

        if (client.balance < amount) {
            throw new Error(`Not enough funds in the account`);
        } else {
            client.balance -= amount;
        }
    }
}

export default Bank;