import Bank from './bank-manager.js'

const bank = new Bank();

bank.on('error', (err) => {
    console.error('Error:', err.message);
});

const personId = bank.register({
    name: 'Pitter Black',
    balance: 100
});

const personId1 = bank.register({
    name: 'Simon Eastwood',
    balance: 1000,
    limit: amount => amount < 100
});

bank.emit('send', personId1, 100, personId)
bank.emit('get', personId1, (balance) => {
    console.log(`I have ${balance}₴`); 
});

bank.emit('get', personId, (balance) => {
    console.log(`I have ${balance}₴`); 
});

bank.emit('send', personId1, 100, 'personId')