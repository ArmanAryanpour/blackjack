import "../src/styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  pageProps: any;
}>) {
  {
    /* 
      Our data providers are nested in the order of their dependencies.
      The GameProvider is at the lowest level because it depends on the other providers.
      The DeckProvider is at the top level because it does not depend on any other provider.
      The PlayerProvider is in the middle because it will interact with the DeckProvider and BankProvider, but does not depend on the DealerProvider.
      The DealerProvider depends on the DeckProvider, BankProvider and the PlayerProvider (specifically to make decisions related to how many cards to draw).
      */
  }
  if (typeof window == "undefined") {
    return null;
  }
  return <Component {...pageProps} />;
}

export default MyApp;
