// import request from 'supertest';
// import app from '../app.js'; // Import the testable Express app instance

// // --- 1. MOCK EXTERNAL MODULES ---

// // 1.1 Mongoose Mocks (for transactions)
// // These mocks need to be defined outside so we can call their methods (like .commitTransaction)
// const mockSession = {
//     startTransaction: jest.fn(),
//     commitTransaction: jest.fn().mockResolvedValue(true),
//     abortTransaction: jest.fn().mockResolvedValue(true),
//     endSession: jest.fn(),
// };

// // Mock Mongoose: Jest allows referencing 'mockSession' because it's prefixed with 'mock'
// jest.mock('mongoose', () => ({
//     startSession: jest.fn(() => Promise.resolve(mockSession)),
// }));


// // 1.2 User Model Mocks (FIXED: Using 'mock' prefix for safe out-of-scope reference)
// // We define the mock functions here so the test suite can control them (e.g., mockResolvedValue)
// const mockUserFindOne = jest.fn();
// const mockUserCreate = jest.fn();
// // For login logic, we also need to mock a method on the *returned user object*
// const mockComparePassword = jest.fn();

// // Mock the User Model default export
// // The factory function is now self-contained, using the mock-prefixed variables
// jest.mock('../models/user.model.js', () => ({
//     __esModule: true,
//     default: {
//         findOne: mockUserFindOne,
//         create: mockUserCreate,
//         // We might also need to mock the User Model methods if they are used elsewhere
//     },
// }));


// // 1.3 Mock bcrypt (for password hashing)
// jest.mock('bcrypt', () => ({
//     genSalt: jest.fn().mockResolvedValue('mockedSalt'),
//     hash: jest.fn().mockResolvedValue('mockedHashedPassword'),
// }));

// // 1.4 Mock jsonwebtoken (for token signing)
// // No need to access this mock, just need it to return a deterministic value
// jest.mock('jsonwebtoken', () => ({
//     sign: jest.fn().mockReturnValue('mocked_jwt_token_12345'),
// }));


// // --- 2. DEFINE TEST SUITE ---

// describe('Auth Controllers Tests', () => {

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     const validSignupBody = {
//         name: 'Test User',
//         email: 'test@example.com',
//         password: 'Password123',
//         role: 'student',
//     };

//     const newUserId = '507f1f77bcf86cd799439011';
//     const mockCreatedUser = {
//         _id: newUserId,
//         name: validSignupBody.name,
//         email: validSignupBody.email,
//         role: validSignupBody.role,
//         // Include the mock method required for login tests later
//         comparePassword: mockComparePassword,
//     };
//     const mockCreatedUserArray = [mockCreatedUser];


//     // --- Sub-Suite: POST /api/v1/auth/signup/single ---
//     describe('POST /api/v1/auth/signup/single', () => {
//         it('should successfully create a new user and return a token (201)', async () => {
//             // Setup Mocks for success
//             mockUserFindOne.mockResolvedValue(null);
//             mockUserCreate.mockResolvedValue(mockCreatedUserArray);

//             // ACT: Make the HTTP request
//             const response = await request(app)
//                 .post('/api/v1/auth/signup/single')
//                 .send(validSignupBody)
//                 .expect(201);

//             // ASSERTIONS
//             expect(response.body.success).toBe(true);
//             expect(response.body.data.token).toBe('mocked_jwt_token_12345');
//             expect(mockUserFindOne).toHaveBeenCalledWith({ email: validSignupBody.email });
//             expect(mockUserCreate).toHaveBeenCalledTimes(1);
//             expect(mockSession.commitTransaction).toHaveBeenCalledTimes(1);
//             expect(mockSession.abortTransaction).not.toHaveBeenCalled();
//         });

//         it('should return a 409 error if user already exists', async () => {
//             // Setup Mocks for user existence
//             mockUserFindOne.mockResolvedValue(mockCreatedUser);

//             // ACT: Make the HTTP request
//             const response = await request(app)
//                 .post('/api/v1/auth/signup/single')
//                 .send(validSignupBody)
//                 .expect(409);

//             // ASSERTIONS
//             expect(response.body.message).toContain('User already exists');
//             expect(mockUserCreate).not.toHaveBeenCalled();
//             expect(mockSession.commitTransaction).not.toHaveBeenCalled();
//             expect(mockSession.abortTransaction).toHaveBeenCalledTimes(1); // Abort due to error in try block
//         });
//     });

//     // --- Sub-Suite: POST /api/v1/auth/login ---
//     describe('POST /api/v1/auth/login', () => {
//         const loginBody = { email: 'test@example.com', password: 'Password123' };

//         it('should successfully log in a user and return a token (200)', async () => {
//             // Setup Mocks: 1. User is found, 2. Password matches
//             mockUserFindOne.mockResolvedValue(mockCreatedUser);
//             mockComparePassword.mockResolvedValue(true);

//             // ACT: Make the HTTP request
//             const response = await request(app)
//                 .post('/api/v1/auth/login')
//                 .send(loginBody)
//                 .expect(200);

//             // ASSERTIONS
//             expect(response.body.success).toBe(true);
//             expect(response.body.message).toBe('Login Successful');
//             expect(response.body.data.token).toBe('mocked_jwt_token_12345');
//             expect(mockComparePassword).toHaveBeenCalledWith(loginBody.password);
//         });

//         it('should return 404 if user not found (Invalid credentails)', async () => {
//             // Setup Mock: User is NOT found
//             mockUserFindOne.mockResolvedValue(null);

//             // ACT: Make the HTTP request
//             const response = await request(app)
//                 .post('/api/v1/auth/login')
//                 .send(loginBody)
//                 .expect(404);

//             // ASSERTIONS
//             expect(response.body.message).toBe('Invalid credentails');
//             expect(mockComparePassword).not.toHaveBeenCalled();
//         });

//         it('should return 404 if password does not match (Incorrect password)', async () => {
//             // Setup Mocks: 1. User is found, 2. Password DOES NOT match
//             mockUserFindOne.mockResolvedValue(mockCreatedUser);
//             mockComparePassword.mockResolvedValue(false);

//             // ACT: Make the HTTP request
//             const response = await request(app)
//                 .post('/api/v1/auth/login')
//                 .send(loginBody)
//                 .expect(404);

//             // ASSERTIONS
//             expect(response.body.message).toBe('Incorrect password');
//             // Check that the token was not generated
//             expect(require('jsonwebtoken').sign).not.toHaveBeenCalled();
//         });
//     });

//     // --- Sub-Suite: POST /api/v1/auth/logout ---
//     describe('POST /api/v1/auth/logout', () => {
//         it('should successfully clear the cookie and return 200', async () => {
//             // ACT: Make the HTTP request
//             const response = await request(app)
//                 .post('/api/v1/auth/logout')
//                 .expect(200);

//             // ASSERTIONS
//             expect(response.body.message).toBe('Logout Successful');
//             // Supertest assertions for cookie clearance are tricky, but we can verify the status/body.
//             // We assume Express's res.clearCookie('token') is working correctly based on the controller logic.
//         });
//     });
// });
