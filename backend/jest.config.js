/**
 * Jest configuration for an ES Module project (type: "module")
 */
export default {
    // Disable the default transform process.
    // This allows Jest to directly process the ES Module syntax (import/export).
    // Jest automatically infers ES Modules from package.json type: "module" for .js files.
    transform: {},

    // This setting helps resolve imports that use relative paths (like '../*.js')
    // in an ES Module context, preventing 'Cannot find module' errors.
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    
    // Set the test environment
    testEnvironment: 'node',
    
    // Optional: Set up the path to your test files if they are not in the root
    testMatch: ['<rootDir>/tests/**/*.test.js'],
};
