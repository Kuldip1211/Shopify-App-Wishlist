import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { RecoilRoot } from "recoil";
import { CustomerCountLoader } from "../app/routes/CustomerCountLoader";
import { ActiveCustomerCountLoader } from "../app/routes/ActiveCustomerCount";
import { CustomerListLoader } from "../app/routes/jbjbjkbkjbjFetchs/CustomerList";
// import { MostListProduct } from "../app/routes/Fetchs/MostListProduct";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <RecoilRoot>
          {/* <CustomerCountLoader />
          <ActiveCustomerCountLoader /> */}
          {/* <CustomerListLoader />                                                                                              */}
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </RecoilRoot>
      </body>
    </html>
  );
}
