import { gql } from '@apollo/client';

export const SET_ACTIVE_PAYMENT_METHOD = gql`
    mutation SetActivePaymentMethod($parentId: Long!, $methodId: Long!) {
        setActivePaymentMethod(parentId: $parentId, methodId: $methodId) {
            id
            method
            isActive
        }
    }
`;

export const ADD_PAYMENT_METHOD = gql`
    mutation AddPaymentMethod($parentId: Long!, $method: String!) {
        addPaymentMethod(parentId: $parentId, method: $method) {
            id
            method
            isActive
        }
    }
`;

export const DELETE_PAYMENT_METHOD = gql`
    mutation DeletePaymentMethod($parentId: Long!, $method: String!) {
        deletePaymentMethod(parentId: $parentId, method: $method)
    }
`;
