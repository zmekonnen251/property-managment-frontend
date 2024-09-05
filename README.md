# Property Management Website Client

This project is the **frontend** part of a comprehensive Property Management System, designed to streamline and optimize property management operations. Built with React.js and a rich ecosystem of tools and libraries, this client application provides features such as room reservations, property management, reporting, and more, with a user-friendly interface.

## Features

- **Room Reservations**: Book and manage room reservations efficiently.
- **Multiple Property Management**: Manage multiple properties from a single platform.
- **Comprehensive Reporting**: Generate detailed reports on property operations, reservations, and more.
- **Role-Based Authentication**: Ensure security with role-specific access to different features.
- **Scheduling**: Schedule and manage tasks for property management seamlessly.
- **Responsive Design**: Built with Material-UI to ensure a modern and responsive user experience.
- **Data-Driven Insights**: Leverage data to make informed decisions through integrated charts and graphs.

## Tech Stack

- **React.js**: Main frontend library.
- **Material-UI**: For responsive UI components and styling.
- **Redux Toolkit**: For state management.
- **Axios**: For handling API requests.
- **Framer Motion**: For smooth animations.
- **React Hook Form & Yup**: For form management and validation.
- **ApexCharts**: For interactive charts and reporting.
- **JS PDF & AutoTable**: For generating PDF reports and invoices.

## Installation

To run this project locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/Property-managment-website-client.git
    ```
2. **Navigate to the project directory**:

   ```bash
   cd Property-managment-website-client
   ```
3. **Install the dependencies**:

   ```bash
    npm install
    ```
4. **Start the development server**:

   ```bash
   npm start
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.**

## Available Scripts

- `npm start`: Starts the development server.
- `npm build`: Builds the app for production.
- `npm test`: Runs the test suite.
- `npm lint`: Lints the codebase and fixes any issues using ESLint.

## Folder Structure

```bash
Property-managment-website-client/
├── public/                 # Public assets like index.html
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Different page views (e.g., Dashboard, Reservations)
│   ├── services/           # API services (Axios requests)
│   ├── state/              # Redux store, slices, and actions
│   ├── utils/              # Helper functions and utilities
│   └── App.js              # Main application component
└── package.json            # Project dependencies and scripts
```

## Key Dependencies

- **React.js**: ^18.2.0
- **Material-UI**: ^5.14.0
- **React Router DOM**: ^6.14.1
- **Redux Toolkit**: ^1.9.5
- **Axios**: ^1.4.0
- **Framer Motion**: ^6.3.16
- **ApexCharts**: ^3.35.3
- **JS PDF & AutoTable**: For generating PDFs.

## Testing

This project uses React Testing Library for unit and component tests. To run tests:

```bash
npm test
```

## Code Quality

- **ESLint**: Linting is enforced with ESLint using Airbnb's style guide.
- **Prettier**: Code formatting is handled by Prettier for consistent style.

To run lint checks:

```bash
npm run lint
```

## License

This project is licensed under the MIT [License](LICENSE).

