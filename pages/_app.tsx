import type { AppProps } from "next/app";
import LayoutContainer from "../src/components/Layouts/SiteLayout";
import UseWalletProviderWrapper from "@providers/UseWalletProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useSetDocumentTitle } from "@hooks/useSetDocumentTitle";
import "../styles/globals.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-tooltip/dist/react-tooltip.css";
import SWRWrapper from "@providers/SWR";
import { ApiClient, ApiProvider } from "jsonapi-react";
import NFTContextProvider from "src/contexts/NFTContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

const client = new ApiClient({ url: "/api/v1", schema: {} });
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useSetDocumentTitle();
  useEffect(() => {
    const loadWeglotScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://cdn.weglot.com/weglot.min.js";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        const weglotInitScript = document.createElement("script");
        weglotInitScript.type = "text/javascript";
        weglotInitScript.innerHTML = `Weglot.initialize({"api_key": 'wg_d3277c802cea587cd01cf627316890e01'})`;
        document.head.appendChild(weglotInitScript);
      };
    };
    loadWeglotScript();
  }, [router.pathname]);

  return (
    <UseWalletProviderWrapper>
      <ApiProvider client={client}>
        <NFTContextProvider>
          <SWRWrapper>
            <ToastContainer />
            <LayoutContainer>
              <Head>
                <title>Bipzy | IDO Launchpad & Algo Trading</title>
                <link rel="shortcut icon" href="/bipzy-favicon.png" />
              </Head>
              <Component {...pageProps} />
            </LayoutContainer>
          </SWRWrapper>
        </NFTContextProvider>
      </ApiProvider>
    </UseWalletProviderWrapper>
  );
}

export default MyApp;
