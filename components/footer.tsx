import { Coffee, Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Coffee className="h-8 w-8" />
            <span className="text-2xl font-bold">Puesto Bar</span>
          </div>

          <div className="text-center md:text-left">
            <p className="mb-2">Av. Libertador Gral San Martín 30</p>
            <p>San Vicente, Buenos Aires, Argentina</p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://instagram.com/puesto.sanvicente"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a href="#" className="hover:text-amber-300 transition-colors" aria-label="Facebook">
              <Facebook size={24} />
            </a>
            <a href="#" className="hover:text-amber-300 transition-colors" aria-label="Twitter">
              <Twitter size={24} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-amber-800/50 text-center text-sm text-amber-200/70">
        
          <p className="">© {new Date().getFullYear()} Pablo&Pancho. Todos los derechos reservados.</p>
          
        </div>
      </div>
    </footer>
  )
}

