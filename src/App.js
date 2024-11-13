import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/toastProvider";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import Hero from "./pages/home";

function App() {
  return (
    <TonConnectUIProvider manifestUrl="../tonconnect-manifest.json">
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Hero />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </TonConnectUIProvider>
  );
}

export default App;
