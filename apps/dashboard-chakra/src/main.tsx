import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { chakraSystem } from "./theme/chakraTheme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={chakraSystem}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
