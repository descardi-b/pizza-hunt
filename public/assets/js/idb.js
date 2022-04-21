// create a variable to hold the db connection

const { request } = require("express");

let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1

const requrest = indexedDB.open('pizza_hunt', 1);

request.onupgradeneeded = function(event) {
    // save a ref to the database
    const db = event.target.result;
    // create an object store (table) called 'new_pizza' and set it to have an auto incrementing primary key
    db.createObjectStore('new_pizza', {autoIncrement: true})
}

// upon success
request.onsuccess = function(event) {
    db = event.target.result;

    // check if ap pis online
    if (navigator.onLine) {
        // uploadPizza();
    }
};

// error
request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new pizza and there's no internet
function saveRecord(record) {
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');
  
    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');
  
    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();
  
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
          fetch('/api/pizzas', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
              // open one more transaction
              const transaction = db.transaction(['new_pizza'], 'readwrite');
              // access the new_pizza object store
              const pizzaObjectStore = transaction.objectStore('new_pizza');
              // clear all items in your store
              pizzaObjectStore.clear();
    
              alert('All saved pizza has been submitted!');
            })
            .catch(err => {
              console.log(err);
            });
        }
    }
};

window.addEventListener('online', uploadPizza);