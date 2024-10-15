import { gql, useQuery } from '@apollo/client';

export const GET_PAYMENT_METHODS = gql`
    query GetPaymentMethods($parentId: Long!) {
        paymentMethods(parentId: $parentId) {
            id
            method
            isActive
        }
    }
`;

export const usePaymentMethodsQuery = (parentId: number) =>
    useQuery(GET_PAYMENT_METHODS, {
        variables: { parentId },
    });
