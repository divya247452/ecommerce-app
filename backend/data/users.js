const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('Pass@123', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    password: bcrypt.hashSync('Pass@123', 10),
  },
  {
    name: 'Jane Doe',
    email: 'jane@email.com',
    password: bcrypt.hashSync('Pass@123', 10),
  },
  {
    name: 'Divya Pratap',
    email: 'Divya@email.com',
    password: bcrypt.hashSync('Pass@123', 10),
  },
];

module.exports = users;
