import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Formatter from "./formatter";

const container = document.getElementById("root");

if (!container) {
  throw new Error('Missing root element. Add <div id="root"></div> to the HTML page.');
}

createRoot(container).render(
  <StrictMode>
    <Formatter />
  </StrictMode>,
);
