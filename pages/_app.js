import '@/styles/globals.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { ThemeProvider } from "@material-tailwind/react";

export default function App({ Component, pageProps }) {
  return   <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
  // return <Component {...pageProps} />
}
