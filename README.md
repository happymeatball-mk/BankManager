# bank-mager

## Description

A simple application for managing a bank account: crediting and debiting funds to the account, displaying the current account balance.

## Quickstart

bank.register() - Registration of a new client
bank.emit('add', personId, "amount-to-be-credited") - crediting funds to the account
bank.emit('withdraw', personId, "amount-to-be-withdrawn") - debiting funds to the account
bank.emit('get', personId, (balance) => { console.log(`I have ${balance}₴`)}) - displaying the current account balance
