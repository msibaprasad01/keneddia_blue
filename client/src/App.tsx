import { ThemeProvider } from "@/modules/website/components/ThemeProvider";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/modules/website/pages/not-found";
import Home from "@/modules/website/pages/Home";
import Hotels from "@/modules/website/pages/Hotels";
import Cafes from "@/modules/website/pages/Cafes";
import Bars from "@/modules/website/pages/Bars";
import About from "@/modules/website/pages/About";
import Events from "@/modules/website/pages/Events";
import Entertainment from "@/modules/website/pages/Entertainment";
import Reviews from "@/modules/website/pages/Reviews";

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/hotels" component={Hotels} />
        <Route path="/cafes" component={Cafes} />
        <Route path="/bars" component={Bars} />
        <Route path="/events" component={Events} />
        <Route path="/entertainment" component={Entertainment} />
        <Route path="/about" component={About} />
        <Route path="/reviews" component={Reviews} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
