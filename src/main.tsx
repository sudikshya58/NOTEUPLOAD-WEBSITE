import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./global.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
<Router>
<Toaster
        position="top-right"
        toastOptions={{
          style: {
            marginTop: "60px",
          },
        }}
      />
<App />
</Router>
);
