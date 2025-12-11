import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Hotels from "@/pages/Hotels";
import Cafes from "@/pages/Cafes";
import Bars from "@/pages/Bars";
import About from "@/pages/About";
import Events from "@/pages/Events";
import Reviews from "@/pages/Reviews";

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
        <Route path="/about" component={About} />
        <Route path="/events" component={Events} />
        <Route path="/reviews" component={Reviews} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
