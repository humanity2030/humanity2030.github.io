import { LocationProvider, ErrorBoundary, Router, Route } from "preact-iso";
import { createHead, Unhead, UnheadProvider } from "@unhead/react/client";
import { pageComponents } from "@/utils/page-components";
import { Home } from "@/Home";
import { Layout } from "@/Layout";
import { Support } from "@/Support";
import { Articles } from "@/Articles";

export const App = (props: { head: Unhead }) => {
  return (
    <UnheadProvider head={props.head}>
      <LocationProvider>
        <ErrorBoundary
          onError={(error) => {
            console.error(error);
          }}
        >
          <Layout>
            <Router>
              <Route path="/" component={Home} />
              <Route path="/support.html" component={Support} />
              <Route path="/articles/" component={Articles} />
              <Route path="/articles/index.html" component={Articles} />
              {Object.entries(pageComponents).map(([path, Component]) => (
                <Route key={path} path={`/${path}`} component={Component} />
              ))}
            </Router>
          </Layout>
        </ErrorBoundary>
      </LocationProvider>
    </UnheadProvider>
  );
};
