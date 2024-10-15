import { gql, useQuery } from '@apollo/client';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Paper,
    ThemeProvider,
    createTheme,
    CssBaseline,
} from '@material-ui/core';
import { grey, blue } from '@material-ui/core/colors';

import PaymentMethods from './components/PaymentMethods/PaymentMethods';
import Invoices from './components/Invoices';

const theme = createTheme({
    palette: {
        primary: {
            main: 'hsla(265, 75%, 35%, 1)',
        },
    },
});

const GET_PARENT_PROFILE = gql`
    query GetParentProfile($parentId: Long!) {
        parentProfile(parentId: $parentId) {
            id
            name
            child
        }
    }
`;

const PARENT_ID = 1;

const App = () => {
    const { loading, data } = useQuery(GET_PARENT_PROFILE, {
        variables: { parentId: PARENT_ID },
    });

    if (loading) return <p>Loading...</p>;

    const parentProfile = data?.parentProfile;

    if (!parentProfile) return <p>Parent with ID={PARENT_ID} not found</p>;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" style={{ padding: 0 }}>
                <Toolbar>
                    <Typography variant="h6" style={{ color: 'white' }}>
                        Growth at Famly | Full stack technical challenge
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: '2rem' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper
                            style={{
                                padding: '1rem',
                                backgroundColor: grey[100],
                            }}
                        >
                            <Grid container spacing={3} alignItems="center">
                                <Grid item>
                                    <div
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                                            alt="Parent profile"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <Typography
                                        variant="h4"
                                        style={{
                                            color: blue[800],
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        {parentProfile.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        style={{ color: grey[700] }}
                                    >
                                        {parentProfile.child}'s parent
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Paper
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: grey[100],
                                    }}
                                    elevation={1}
                                >
                                    <PaymentMethods parentId={PARENT_ID} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Paper
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: grey[100],
                                    }}
                                    elevation={1}
                                >
                                    <Invoices parentId={PARENT_ID} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default App;
