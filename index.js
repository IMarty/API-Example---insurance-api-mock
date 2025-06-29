// server.js

// --- 1. Import necessary packages ---
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs
const cors = require('cors'); // To handle Cross-Origin Resource Sharing

// --- 2. Initialize the Express app ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- 3. Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable the express app to parse JSON formatted request bodies

// --- 4. In-Memory "Database" ---
// We'll use a simple array to store our contracts.
// It's pre-filled with some data to make GET requests work immediately.
let contracts = [
  {
    contractId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    customerId: 'cust_12345',
    policyType: 'Auto',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    premiumAmount: 599.99,
    status: 'active',
  },
  {
    contractId: 'a4b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d',
    customerId: 'cust_67890',
    policyType: 'Home',
    startDate: '2023-06-15',
    endDate: '2024-06-15',
    premiumAmount: 1200.50,
    status: 'expired',
  },
];

// --- 5. Define API Routes (Endpoints) ---

// A simple root message to confirm the server is running
app.get('/', (req, res) => {
  res.send('Insurance Contracts Mock API is running!');
});

/**
 * GET /contracts
 * List all contracts
 */
app.get('/contracts', (req, res) => {
  console.log('GET /contracts - Responding with all contracts');
  res.status(200).json(contracts);
});

/**
 * POST /contracts
 * Create a new contract
 */
app.post('/contracts', (req, res) => {
  const { customerId, policyType, startDate, endDate, premiumAmount } = req.body;

  // Basic validation
  if (!customerId || !policyType || !startDate || !premiumAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newContract = {
    contractId: uuidv4(), // Generate a new unique ID
    customerId,
    policyType,
    startDate,
    endDate,
    premiumAmount,
    status: 'pending_approval', // New contracts start as pending
  };

  contracts.push(newContract);
  console.log('POST /contracts - Created new contract:', newContract.contractId);
  res.status(201).json(newContract);
});

/**
 * GET /contracts/{contractId}
 * Get a specific contract by ID
 */
app.get('/contracts/:contractId', (req, res) => {
  const { contractId } = req.params;
  const contract = contracts.find((c) => c.contractId === contractId);

  if (contract) {
    console.log('GET /contracts/:contractId - Found contract:', contractId);
    res.status(200).json(contract);
  } else {
    console.log('GET /contracts/:contractId - Contract not found:', contractId);
    res.status(404).json({ message: 'Contract not found' });
  }
});

/**
 * PUT /contracts/{contractId}
 * Update an existing contract
 */
app.put('/contracts/:contractId', (req, res) => {
  const { contractId } = req.params;
  const contractIndex = contracts.findIndex((c) => c.contractId === contractId);

  if (contractIndex !== -1) {
    // Merge existing contract with updates from the request body
    const originalContract = contracts[contractIndex];
    const updatedContract = { ...originalContract, ...req.body };
    contracts[contractIndex] = updatedContract;

    console.log('PUT /contracts/:contractId - Updated contract:', contractId);
    res.status(200).json(updatedContract);
  } else {
    console.log('PUT /contracts/:contractId - Contract not found:', contractId);
    res.status(404).json({ message: 'Contract not found' });
  }
});

/**
 * DELETE /contracts/{contractId}
 * Cancel a contract (changes status to 'cancelled')
 */
app.delete('/contracts/:contractId', (req, res) => {
  const { contractId } = req.params;
  const contractIndex = contracts.findIndex((c) => c.contractId === contractId);

  if (contractIndex !== -1) {
    // In a real system, you might not delete. Let's change the status as per the spec comment.
    contracts[contractIndex].status = 'cancelled';
    console.log('DELETE /contracts/:contractId - Cancelled contract:', contractId);
    // Respond with 204 No Content, as is standard for DELETE
    res.status(204).send();
  } else {
    console.log('DELETE /contracts/:contractId - Contract not found:', contractId);
    res.status(404).json({ message: 'Contract not found' });
  }
});


// --- 6. Start the server ---
app.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
});