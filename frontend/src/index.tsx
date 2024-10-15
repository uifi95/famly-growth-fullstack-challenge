import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>
);
