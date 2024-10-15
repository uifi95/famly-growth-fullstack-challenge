import { Logger } from './repository/logger';

export interface ParentProfile {
    id: number;
    name: string;
    child: string;
}

export interface PaymentMethod {
    id: number;
    parentId: number;
    method: string;
    isActive: boolean;
}

export interface Invoice {
    id: number;
    parentId: number;
    amount: number;
    date: string;
}

export const LOG_TYPES = {
    PAYMENT_METHOD: 'PaymentMethod',
    INVOICE: 'Invoice',
} as const;

export type LogType = (typeof LOG_TYPES)[keyof typeof LOG_TYPES];

export interface Log {
    id?: number;
    parentId: number;
    logType: LogType;
    message: string;
}

export class ParentProfileBackend {
    private readonly allParentProfiles: ParentProfile[];
    private readonly allInvoices: Invoice[];
    private readonly allPaymentMethods: PaymentMethod[];
    private readonly logger: Logger;

    constructor(
        parentProfiles: ParentProfile[],
        invoices: Invoice[],
        paymentMethods: PaymentMethod[],
        logger: Logger = new Logger()
    ) {
        this.allParentProfiles = parentProfiles;
        this.allInvoices = invoices;
        this.allPaymentMethods = paymentMethods;
        this.logger = logger;
    }

    parentProfile(parentId: number) {
        return (
            this.allParentProfiles.find(
                (parentProfile) => parentProfile.id === parentId
            ) ?? null
        );
    }

    createParentProfile(parent: string, child: string) {
        return new ParentProfileBackend(
            [
                ...this.allParentProfiles,
                { id: this.allParentProfiles.length + 1, name: parent, child },
            ],
            this.allInvoices,
            this.allPaymentMethods,
            this.logger
        );
    }

    invoices(parentId: number) {
        return this.allInvoices.filter(
            (invoice) => invoice.parentId === parentId
        );
    }

    createInvoice(parentId: number, amount: number, date: string) {
        return new ParentProfileBackend(
            this.allParentProfiles,
            [
                ...this.allInvoices,
                { id: this.allInvoices.length + 1, parentId, amount, date },
            ],
            this.allPaymentMethods,
            this.logger
        );
    }

    paymentMethods(parentId: number) {
        return this.allPaymentMethods.filter(
            (paymentMethod) => paymentMethod.parentId === parentId
        );
    }

    paymentMethod(paymentMethodId: number) {
        return this.allPaymentMethods.find(
            (paymentMethod) => paymentMethod.id === paymentMethodId
        );
    }

    createPaymentMethod(parentId: number, method: string, isActive: boolean) {
        const createdPaymentMethod = {
            id: this.allPaymentMethods.length + 1,
            parentId,
            method,
            isActive,
        };

        const newPaymentMethods = [
            ...this.allPaymentMethods,
            createdPaymentMethod,
        ];

        const backend = new ParentProfileBackend(
            this.allParentProfiles,
            this.allInvoices,
            newPaymentMethods,
            this.logger
        );

        this.logger.log({
            parentId,
            logType: LOG_TYPES.PAYMENT_METHOD,
            message: `Created payment method: ${this.logger.formatPaymentMethod(
                createdPaymentMethod
            )}`,
        });

        return backend;
    }

    deletePaymentMethod(parentId: number, methodId: number) {
        const newPaymentMethods = this.allPaymentMethods.filter(
            (paymentMethod) =>
                !(
                    paymentMethod.parentId === parentId &&
                    paymentMethod.id === methodId
                )
        );

        const deletedPaymentMethod = this.allPaymentMethods.find(
            (paymentMethod) =>
                paymentMethod.parentId === parentId &&
                paymentMethod.id === methodId
        );

        const backend = new ParentProfileBackend(
            this.allParentProfiles,
            this.allInvoices,
            newPaymentMethods,
            this.logger
        );

        if (!deletedPaymentMethod) {
            return backend;
        }

        this.logger.log({
            parentId,
            logType: LOG_TYPES.PAYMENT_METHOD,
            message: `Deleted payment method: ${this.logger.formatPaymentMethod(
                deletedPaymentMethod
            )}`,
        });

        return backend;
    }

    setActivePaymentMethod(parentId: number, paymentMethodId: number) {
        const newPaymentMethods = this.allPaymentMethods.map(
            (paymentMethod) => ({
                ...paymentMethod,
                isActive:
                    paymentMethod.parentId === parentId &&
                    paymentMethod.id === paymentMethodId,
            })
        );

        const backend = new ParentProfileBackend(
            this.allParentProfiles,
            this.allInvoices,
            newPaymentMethods,
            this.logger
        );

        const activatedPaymentMethod = newPaymentMethods.find(
            (paymentMethod) => paymentMethod.isActive
        );

        if (!activatedPaymentMethod) {
            return backend;
        }

        this.logger.log({
            parentId,
            logType: LOG_TYPES.PAYMENT_METHOD,
            message: `Activated payment method: ${this.logger.formatPaymentMethod(
                activatedPaymentMethod
            )}`,
        });

        return backend;
    }
}
