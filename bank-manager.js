import EventEmitter from 'node:events'
import crypto from 'node:crypto';

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
        if (!this.clientsBase.has(id)) {
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

        const id = crypto.randomUUID();
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
        if (!this.#idCheck(id)) {
            return;
        }
        const client = this.clientsBase.get(id);
        balanceStatus(client.balance);
    }

    #withdraw(id, amount) {
        if (!this.#idCheck(id)) {
            return;
        }

        if (amount <= 0) {
            this.emit('error', new Error(`Wrong amount value`));
            return;
        }
        
        const client = this.clientsBase.get(id);
        
        const updatedBalance = client.balance - amount;
        if (!client.limit(amount, client.balance, updatedBalance)) {
            this.emit('error', new Error(`Limit conflict`));
            return;
        } 

        if (client.balance < amount) {
            this.emit('error', new Error(`Not enough funds in the account`));
            return;
        } 
        client.balance -= amount;
        
    }

    #send(idSender, amount, idReceiver) {
        if (amount <= 0) {
            this.emit('error', new Error(`Wrong amount value`));
            return;
        }

        if (!this.#idCheck(idSender)) {
            return;
        }
        const Sender = this.clientsBase.get(idSender);

        if (!this.#idCheck(idReceiver)) {
            return;
        }
        const Receiver = this.clientsBase.get(idReceiver);
        
        const updatedBalance = Sender.balance - amount;
        if (!Sender.limit(amount, Sender.balance, updatedBalance)) {
            this.emit('error', new Error(`Limit conflict`));
            return;
        } 

        if (Sender.balance < amount) {
            this.emit('error', new Error(`Not enough funds in the account`));
            return;
        } 

        Sender.balance -= amount;
        Receiver.balance += amount;
    }

    #changeLimit(id, callback) {
        if (!this.#idCheck(id)) {
            return;
        }
        const client = this.clientsBase.get(id);
        client.limit = callback;
    }
}

export default Bank;