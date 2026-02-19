import { ThemeProvider, CssBaseline, Container, Typography } from "@mui/material";
import { theme } from "./ui/theme";
import { ServiceLogsPage } from "./pages/ServiceLogsPage";

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    MediDrive – Service Logs
                </Typography>
                <ServiceLogsPage />
            </Container>
        </ThemeProvider>
    );
}
