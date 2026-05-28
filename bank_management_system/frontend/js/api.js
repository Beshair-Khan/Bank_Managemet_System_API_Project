const BASE_URL = 'https://ideal-waffle-69566r5qqq9wfr5rw-3000.app.github.dev/api';

// Customers
export const getCustomers    = () => fetch(`${BASE_URL}/customers`).then(r => r.json());
export const getCustomerById = (id) => fetch(`${BASE_URL}/customers/${id}`).then(r => r.json());
export const createCustomer  = (data) => fetch(`${BASE_URL}/customers`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
}).then(r => r.json());
export const updateCustomer  = (id, data) => fetch(`${BASE_URL}/customers/${id}`, {
  method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
}).then(r => r.json());
export const deleteCustomer  = (id) => fetch(`${BASE_URL}/customers/${id}`, {
  method: 'DELETE'
}).then(r => r.json());

// Accounts
export const getAccounts     = () => fetch(`${BASE_URL}/accounts`).then(r => r.json());
export const getAccountById  = (id) => fetch(`${BASE_URL}/accounts/${id}`).then(r => r.json());

// Transactions
export const getTransactions = () => fetch(`${BASE_URL}/transactions`).then(r => r.json());

// Loans
export const getLoans        = () => fetch(`${BASE_URL}/loans`).then(r => r.json());
export const getActiveLoans  = () => fetch(`${BASE_URL}/loans/active`).then(r => r.json());

// Cards
export const getCards        = () => fetch(`${BASE_URL}/cards`).then(r => r.json());

// Branches
export const getBranches     = () => fetch(`${BASE_URL}/branches`).then(r => r.json());

// Notifications
export const getNotifications = () => fetch(`${BASE_URL}/notifications`).then(r => r.json());