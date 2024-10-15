import '@testing-library/jest-dom';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import PaymentMethods from './PaymentMethods';
import { GET_PAYMENT_METHODS } from '../../graphql/PaymentMethods/paymentMethods.queries';

import {
    ADD_PAYMENT_METHOD,
    DELETE_PAYMENT_METHOD,
    SET_ACTIVE_PAYMENT_METHOD,
} from '../../graphql/PaymentMethods/paymentMethods.mutations';

const baseMocks = [
    {
        request: {
            query: GET_PAYMENT_METHODS,
            variables: { parentId: 1 },
        },
        result: {
            data: {
                paymentMethods: [
                    { id: 1, method: 'Visa', isActive: true },
                    { id: 2, method: 'MasterCard', isActive: false },
                ],
            },
        },
    },
];

describe('PaymentMethods', () => {
    it('should display loading state initially', () => {
        render(
            <MockedProvider mocks={baseMocks}>
                <PaymentMethods parentId={1} />
            </MockedProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should add a payment method', async () => {
        const mocks = [
            ...baseMocks,
            {
                request: {
                    query: ADD_PAYMENT_METHOD,
                    variables: { parentId: 1, method: 'Amex' },
                },
                result: {
                    data: {
                        addPaymentMethod: {
                            id: 3,
                            method: 'Amex',
                            isActive: false,
                        },
                    },
                },
            },
            {
                request: {
                    query: GET_PAYMENT_METHODS,
                    variables: { parentId: 1 },
                },
                result: {
                    data: {
                        paymentMethods: [
                            { id: 1, method: 'Visa', isActive: true },
                            { id: 2, method: 'MasterCard', isActive: false },
                            { id: 3, method: 'Amex', isActive: false },
                        ],
                    },
                },
            },
        ];

        render(
            <MockedProvider mocks={mocks}>
                <PaymentMethods parentId={1} />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText('Add new payment method')
            ).toBeInTheDocument();
        });

        fireEvent.change(
            screen.getByPlaceholderText('Add new payment method'),
            {
                target: { value: 'Amex' },
            }
        );
        fireEvent.click(screen.getByText('Add Method'));

        await waitFor(() => {
            expect(screen.getByText('Amex')).toBeInTheDocument();
        });
    });

    it('should delete a payment method', async () => {
        const mocks = [
            ...baseMocks,
            {
                request: {
                    query: DELETE_PAYMENT_METHOD,
                    variables: { parentId: 1, method: 'MasterCard' },
                },
                result: {
                    data: {
                        deletePaymentMethod: {
                            id: 2,
                            method: 'MasterCard',
                            isActive: false,
                        },
                    },
                },
            },
            {
                request: {
                    query: GET_PAYMENT_METHODS,
                    variables: { parentId: 1 },
                },
                result: {
                    data: {
                        paymentMethods: [
                            { id: 1, method: 'Visa', isActive: true },
                        ],
                    },
                },
            },
        ];

        render(
            <MockedProvider mocks={mocks}>
                <PaymentMethods parentId={1} />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('MasterCard')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByTitle('delete')[1]);

        await waitFor(() => {
            expect(screen.queryByText('MasterCard')).not.toBeInTheDocument();
        });
    });

    it('should activate a payment method', async () => {
        const mocks = [
            ...baseMocks,
            {
                request: {
                    query: SET_ACTIVE_PAYMENT_METHOD,
                    variables: { parentId: 1, methodId: 2 },
                },
                result: {
                    data: {
                        setActivePaymentMethod: {
                            id: 2,
                            method: 'MasterCard',
                            isActive: true,
                        },
                    },
                },
            },
            {
                request: {
                    query: GET_PAYMENT_METHODS,
                    variables: { parentId: 1 },
                },
                result: {
                    data: {
                        paymentMethods: [
                            { id: 1, method: 'Visa', isActive: false },
                            { id: 2, method: 'MasterCard', isActive: true },
                        ],
                    },
                },
            },
        ];

        render(
            <MockedProvider mocks={mocks}>
                <PaymentMethods parentId={1} />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('MasterCard')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Activate'));

        await waitFor(() => {
            expect(screen.getByTestId('card-title-2').textContent).toBe(
                'MasterCardActive'
            );
        });
    });
});
