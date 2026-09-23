# gitchat reviewer notes

## Architecture
The `gitchat` codebase appears to be a chat application built with a focus on real-time messaging, potentially leveraging WebSockets given the real-time nature of chat applications. The repository's organization includes modular components that handle different parts of the application, such as user authentication and message exchanges, though specific file structure and organization details are not provided in the README or sampled files.

## Conventions
- **Naming Conventions**: Components, functions, and variable names must be clear and indicative of their purpose. For example, if there were files like `UserService.js`, the naming convention follows camelCase for file names and PascalCase for class names.
- **Message Formatting**: The application may have a specific format for incoming and outgoing messages. If message structures are defined within any of the JavaScript files, they should consistently follow a predefined schema (e.g., { username: string, message: string, timestamp: date }).

## Intentional non-standard choices
- **Use of Callbacks and Promises**: If the application uses traditional callback functions alongside Promises or async/await for asynchronous operations, this might seem inconsistent. The use of both may be intentional, allowing for flexibility in how asynchronous control flows are handled in different parts of the app.

## Watch out for
- **Lack of Input Validation**: Ensure that any user inputs (such as chat messages or usernames) are validated before processing. Failing to sanitize inputs can lead to security vulnerabilities like XSS (Cross-Site Scripting).
- **Missing Error Handling**: Pay close attention to error handling in asynchronous requests. If there’s no catch for Promises or try-catch blocks for async functions, it could lead to unhandled promise rejections, causing crashes in the application.
