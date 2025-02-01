import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <SpeedInsights />
      <App />
    </ChakraProvider>
  </StrictMode>
);
