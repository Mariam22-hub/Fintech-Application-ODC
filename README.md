# Fintech Web Application

## Technologies Used

- **Node.js**: A JavaScript runtime environment for building the server-side of applications.
- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MongoDB**: A NoSQL database used to store application data.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **bcrypt**: A library for hashing passwords.
- **crypto**: A module that provides cryptographic functionality.
- **dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **validator**: A library of string validators and sanitizers.
- **cors**: A node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- **body-parser**: Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:

   ```bash
   git clone [Your-Repository-URL]
   cd [Your-Repository-Directory]

2. Create a .env file in the root directory and add the necessary environment variables:
```
PORT=3000
URL=mongodb://_mongodb_uri
```
3. Running the Application
After setting up the project, you can start the server with:

```bash
npm start
```

## Features

### User Management
- Registration, login, and password management for users.
- User profile includes personal details, balance, and credit card information.
- Password reset functionality with secure token generation.

### Credit Card Operations
- Credit card generation with unique numbers and CVV.
- CVV encryption for security.
- Credit card association with user accounts.

### Financial Activities
- Record and manage various financial operations.
- Support for basic transaction activities like payments.
- Activity records are linked to user and child accounts.

### Product Handling
- Management of financial products.
- CRUD (Create, Read, Update, Delete) operations for products.
- Products can be associated with child accounts.

### Child Accounts
- Creation and management of child accounts under a main user.
- Child accounts include personal details and operations.
- Balance and credit card information specific to each child account.

### Security and Middleware
- Implementation of CORS for secure cross-origin requests.
- Use of middleware for route protection and user authentication.

## API Endpoints

### User Routes
- `GET /api/user`: Fetch all users.
- `POST /api/user`: Create a new user.
- `GET /api/user/:id`: Get a specific user.
- `PUT /api/user/:id`: Update a user.
- `DELETE /api/user/:id`: Delete a user.
- `POST /api/user/signup`: User signup.
- `POST /api/user/login`: User login.
- `POST /api/user/transfer`: Transfer money.

### Credit Card Routes
- `GET /api/credit`: Fetch all credit cards.
- `GET /api/credit/:id`: Get a specific credit card.
- `POST /api/credit`: Create a new credit card.
- `PUT /api/credit/:id`: Update a credit card.
- `DELETE /api/credit/:id`: Delete a credit card.

### Operation Routes
- `GET /api/operations`: Fetch all operations.
- `POST /api/operations`: Record a new operation.
- `GET /api/operations/:id`: Get a specific operation.
- `PUT /api/operations/:id`: Update an operation.
- `DELETE /api/operations/:id`: Delete an operation.

### Product Routes
- `GET /api/products`: Fetch all products.
- `POST /api/products`: Create a new product.
- `GET /api/products/:id`: Get a specific product.
- `PUT /api/products/:id`: Update a product.
- `DELETE /api/products/:id`: Delete a product.

### Child Routes
- `GET /api/child`: Fetch all child accounts.
- `POST /api/child`: Create a new child account.
- `GET /api/child/:id`: Get a specific child account.
- `PUT /api/child/:id`: Update a child account.
- `DELETE /api/child/:id`: Delete a child account.
- `POST /api/child/:id/signup`: Signup for a child account.
- `POST /api/child/login`: Login for a child account.
