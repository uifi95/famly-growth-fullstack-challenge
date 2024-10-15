import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    TextField,
    IconButton,
} from '@material-ui/core';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import {
    GET_PAYMENT_METHODS,
    usePaymentMethodsQuery,
} from '../../graphql/PaymentMethods/paymentMethods.queries';
import {
    ADD_PAYMENT_METHOD,
    DELETE_PAYMENT_METHOD,
    SET_ACTIVE_PAYMENT_METHOD,
} from '../../graphql/PaymentMethods/paymentMethods.mutations';

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        width: '100%',
        maxWidth: 'none',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        margin: '12px 0',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    icon: {
        marginRight: '20px',
        fontSize: '28px',
        color: theme.palette.primary.main,
    },
    primaryText: {
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    activeText: {
        color: theme.palette.success.main,
    },
    inactiveText: {
        color: theme.palette.error.main,
    },
    button: {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
        padding: '6px 12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: theme.palette.action.selected,
        },
    },
    addMethodForm: {
        display: 'flex',
        marginBottom: '20px',
    },
    addMethodInput: {
        flexGrow: 1,
        marginRight: '10px',
        backgroundColor: 'white',
    },
    deleteButton: {
        color: theme.palette.error.main,
    },
}));

const PaymentMethods = ({ parentId }: { parentId: number }) => {
    const classes = useStyles();
    const [newMethod, setNewMethod] = useState('');
    const { loading, data } = usePaymentMethodsQuery(parentId);

    const refetchQueries = [
        {
            query: GET_PAYMENT_METHODS,
            variables: { parentId },
        },
    ];

    const [setActivePaymentMethod] = useMutation(SET_ACTIVE_PAYMENT_METHOD, {
        refetchQueries,
    });

    const [addPaymentMethod] = useMutation(ADD_PAYMENT_METHOD, {
        refetchQueries,
        awaitRefetchQueries: true,
    });

    const [deletePaymentMethod] = useMutation(DELETE_PAYMENT_METHOD, {
        refetchQueries,
    });

    if (loading) return <p>Loading...</p>;

    const handleActivate = (methodId: number) => {
        return setActivePaymentMethod({
            variables: { parentId, methodId },
        });
    };

    const handleAddMethod = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMethod.trim()) {
            await addPaymentMethod({
                variables: { parentId, method: newMethod.trim() },
            });
            setNewMethod('');
        }
    };

    const handleDeleteMethod = (method: string) => {
        return deletePaymentMethod({
            variables: { parentId, method },
        });
    };

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <div>
                    <Typography variant="h5">Payment Methods</Typography>
                    <Typography
                        variant="subtitle1"
                        style={{ color: grey[700] }}
                    >
                        Manage and select your preferred payment options
                    </Typography>
                </div>
            </div>
            <form onSubmit={handleAddMethod} className={classes.addMethodForm}>
                <TextField
                    className={classes.addMethodInput}
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value)}
                    placeholder="Add new payment method"
                    variant="outlined"
                    size="small"
                />
                <Button
                    type="submit"
                    variant="contained"
                    className={classes.button}
                    size="small"
                >
                    Add Method
                </Button>
            </form>
            <List>
                {data?.paymentMethods.map((method: any) => (
                    <ListItem key={method.id} className={classes.listItem}>
                        <ListItemIcon>
                            <CreditCardIcon />
                        </ListItemIcon>
                        <ListItemText
                            data-testid={`card-title-${method.id}`}
                            primary={method.method}
                            secondary={method.isActive ? 'Active' : 'Inactive'}
                            primaryTypographyProps={{
                                className: classes.primaryText,
                            }}
                            secondaryTypographyProps={{
                                className: method.isActive
                                    ? classes.activeText
                                    : classes.inactiveText,
                            }}
                        />
                        {!method.isActive && (
                            <Button
                                variant="contained"
                                className={classes.button}
                                onClick={() => handleActivate(method.id)}
                                size="small"
                            >
                                Activate
                            </Button>
                        )}
                        <IconButton
                            title="delete"
                            className={classes.deleteButton}
                            onClick={() => handleDeleteMethod(method.method)}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default PaymentMethods;
