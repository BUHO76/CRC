import Box from '@mui/material/Box';
import Container, { type ContainerProps } from '@mui/material/Container';

interface PageContainerProps extends ContainerProps {
  center?: boolean;
}

export function PageContainer({ center = false, children, maxWidth = 'sm', sx, ...rest }: PageContainerProps) {
  if (center) {
    return (
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Container maxWidth={maxWidth} sx={{ py: { xs: 4, sm: 6 }, ...sx }} {...rest}>
          {children}
        </Container>
      </Box>
    );
  }

  return (
    <Container maxWidth={maxWidth} sx={{ py: { xs: 4, sm: 6 }, ...sx }} {...rest}>
      {children}
    </Container>
  );
}
