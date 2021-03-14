import "../../styles/globals.css";
import axios from "axios";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

axios.defaults.baseURL = "http://localhost:3000"; // the prefix of the URL

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  return pathname === "/auth" ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  );
}

export default MyApp;
