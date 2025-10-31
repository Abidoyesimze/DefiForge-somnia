import "@rainbow-me/rainbowkit/styles.css";
import { AppProviders } from "~~/components/AppProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({ 
  title: "DeFiForge - DeFi Development Toolkit", 
  description: "Comprehensive DeFi development toolkit for building, testing, and deploying smart contracts" 
});

const DeFiForgeApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <AppProviders>{children}</AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default DeFiForgeApp;
