import Head from "@/utils/head";
import Home from "./components/langing/Home";
import About from "./components/langing/About";
import Work from "./components/langing/Work";
import Testimonial from "./components/langing/Testimonial";
import Contact from "./components/langing/Contact";
import Footer from "./components/langing/Footer";


function Application() {
  return (
    <div className="App">
      <Head/>
      <Home />
      <About />
      <Work />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
}

export default Application;
