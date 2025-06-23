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
        const id = uuidv4();
        this.clientsBase.set(id, {name, balance});
        return id;
    }

    #add(id, amount) {
        const client = this.clientsBase.get(id);
        client.balance += amount;
    }

    #get(id, balanceStatus) {
        const client = this.clientsBase.get(id);
        balanceStatus(client.balance);
    }

    #withdraw(id, amount) {
        const client = this.clientsBase.get(id);
        client.balance -= amount;
    }
    
}



export default Bank;