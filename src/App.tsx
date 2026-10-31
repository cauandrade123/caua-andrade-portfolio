import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollManager } from "./components/ScrollManager";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectCase from "./pages/ProjectCase";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme">
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects/:slug" element={<ProjectCase />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  </ThemeProvider>
);

export default App;
