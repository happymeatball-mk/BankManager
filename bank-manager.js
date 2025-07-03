import { EventEmitter } from 'node:events'
import { v4 as uuidv4 } from 'uuid';

class Bank extends EventEmitter {
    constructor() {
        super();
        this.clientsBase = new Map();

        this.on('add', this.#add.bind(this));
        this.on('get', this.#get.bind(this));
        this.on('withdraw', this.#withdraw.bind(this));
        this.on('send', this.#send.bind(this));
        this.on('changeLimit', this.#changeLimit.bind(this))
    }

    #idCheck(id) {
        if (!id) {
            this.emit('error', new Error(`id does't exist`));
            return false;
        }
        return true;
    }
    
    register ({name, balance, limit}) {
        if (balance <= 0) {
            this.emit('error', new Error(`Wrong balance value`));
            return;
        }

        for (const client of this.clientsBase.values()) {
            if (client.name === name) {
                this.emit('error', new Error(`Client is already in the data base`));
                return;
            };
        }

        const id = uuidv4();
        this.clientsBase.set(id, {name, balance, limit});
        return id;
    }

    #add(id, amount) {
        if (amount <= 0) {
            this.emit('error', new Error(`Wrong amount value`));
            return;
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
            this.emit('error', new Error(`Wrong amount value`));
            return;
        }

        const client = this.clientsBase.get(id);
        this.#idCheck(client);

        if (client.balance < amount) {
            this.emit('error', new Error(`Not enough funds in the account`));
            return;
        } else {
            client.balance -= amount;
        }
    }

    #send(idSender, amount, idReceiver) {
        if (amount <= 0) {
            this.emit('error', new Error(`Wrong amount value`));
            return;
        }

        const Sender = this.clientsBase.get(idSender);
        this.#idCheck(Sender);

        const Receiver = this.clientsBase.get(idReceiver);
        this.#idCheck(Receiver);
        
        if (!Sender.limit(amount)) {
            this.emit('error', new Error('Limit error'));
            return;
        } else {
            if (Sender.balance < amount) {
                this.emit('error', new Error(`Not enough funds in the account`));
                return;
            } else {
                Sender.balance -= amount;
                Receiver.balance += amount;
            }
        }
    }

    #changeLimit(id, callback) {
        const client = this.clientsBase.get(id);
        this.#idCheck(client);
        client.limit = callback;
    }
}

export default Bank;