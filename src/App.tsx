import { ThemeProvider, CssBaseline, Container, Typography } from "@mui/material";
import { theme } from "./ui/theme";

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    MediDrive – Service Logs
                </Typography>
            </Container>
        </ThemeProvider>
    );
}
