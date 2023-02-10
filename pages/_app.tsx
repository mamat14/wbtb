import 'styles/globals.css'
import {AppPropsType} from "next/dist/shared/lib/utils";

export default function App({ Component, pageProps }: AppPropsType) {
  return (<Component {...pageProps}></Component>);
}
