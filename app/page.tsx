import { Navbar } from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Menu from "@/components/menu"
import InstagramFeedStatic from "@/components/instagram-feed-static"
import Location from "@/components/location"
import Footer from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import MusicButton from "@/components/music-button"
import WelcomeScreen from "@/components/welcome-screen"
import StyleInitializer from "@/components/style-initializer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f5f0]">
      <StyleInitializer />
      <WelcomeScreen />
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <InstagramFeedStatic />
      <Location />
      <Footer />
      <ScrollToTop />
      <MusicButton />
    </main>
  )
}

