import { render } from "@testing-library/preact";
import { UnheadProvider } from "@unhead/react/client";
import { createHead } from "@unhead/ssr";
import { LocationProvider, Router } from "preact-iso";

const AllTheProviders = ({ children }) => {
  const head = createHead();
  return (
    <UnheadProvider head={head}>
      <LocationProvider>
        <Router>{children}</Router>
      </LocationProvider>
    </UnheadProvider>
  );
};

const customRender = (ui, options?) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/preact";

export { customRender as render };
