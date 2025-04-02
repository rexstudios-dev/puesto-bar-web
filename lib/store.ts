// Archivo central para gestionar el estado de la aplicación

// Tipos para nuestro almacén de datos
export interface SiteConfig {
  // Configuración general
  siteName: string
  siteDescription: string
  contactEmail: string
  phoneNumber: string
  address: string
  googleMapsUrl: string
  timezone: string

  // Configuración multimedia
  enableBackgroundMusic: boolean
  showWelcomeScreen: boolean
  autoplayMusic: boolean
  musicUrl: string
  musicVolume: number
  enableInstagramFeed: boolean

  // Configuración de menú
  menuLastUpdated: string

  // Configuración de apariencia
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string

  // Configuración de contenido
  heroContent: {
    title: string
    subtitle: string
    buttonText: string
    buttonLink: string
    showStatusBadge: boolean
    backgroundImage: string
    overlayOpacity: number
    showScrollIndicator: boolean
  }
  aboutContent: {
    title: string
    description: string
    feature1Title: string
    feature1Description: string
    feature2Title: string
    feature2Description: string
    feature3Title: string
    feature3Description: string
  }
  locationContent: {
    title: string
    subtitle: string
    address: string
    hours: string
    instagram: string
  }

  // Configuración de Instagram
  instagramPosts: any[]
  instagramStories: any[]

  // Otras configuraciones
  lastUpdated: string
}

// Valores predeterminados
const defaultConfig: SiteConfig = {
  siteName: "Puesto Bar",
  siteDescription: "Café, comida y tragos en San Vicente, Buenos Aires",
  contactEmail: "info@puestobar.com",
  phoneNumber: "+54 11 1234-5678",
  address: "Av. Libertador Gral San Martín 30, San Vicente, Buenos Aires, Argentina",
  googleMapsUrl: "https://goo.gl/maps/example",
  timezone: "America/Argentina/Buenos_Aires",

  enableBackgroundMusic: true,
  showWelcomeScreen: true,
  autoplayMusic: false,
  musicUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3",
  musicVolume: 20,
  enableInstagramFeed: true,

  menuLastUpdated: "",

  primaryColor: "#B45309",
  secondaryColor: "#F59E0B",
  accentColor: "#D97706",
  backgroundColor: "#F9F5F0",
  textColor: "#1F2937",

  // Contenido predeterminado
  heroContent: {
    title: "Puesto Bar",
    subtitle: "Café, comida y tragos en San Vicente, Buenos Aires",
    buttonText: "Ver Menú",
    buttonLink: "#menu",
    showStatusBadge: true,
    backgroundImage: "/img/instagram/hero.jpg",
    overlayOpacity: 50,
    showScrollIndicator: true,
  },
  aboutContent: {
    title: "Bienvenidos a Puesto Bar",
    description:
      "En el corazón de San Vicente, Puesto Bar es un espacio donde la pasión por el café de especialidad se encuentra con la gastronomía de calidad. Desde nuestros desayunos artesanales hasta nuestros cócteles de autor, cada experiencia está pensada para deleitar tus sentidos.",
    feature1Title: "Café de Especialidad",
    feature1Description: "Seleccionamos los mejores granos para ofrecerte una experiencia única en cada taza.",
    feature2Title: "Cocina Artesanal",
    feature2Description: "Platos preparados con ingredientes frescos y técnicas que resaltan los sabores naturales.",
    feature3Title: "Tragos de Autor",
    feature3Description: "Nuestra barra ofrece creaciones únicas y clásicos reinventados para todos los gustos.",
  },
  locationContent: {
    title: "Ubicación",
    subtitle: "Visítanos y disfruta de la experiencia Puesto Bar",
    address: "Av. Libertador Gral San Martín 30, San Vicente, Buenos Aires, Argentina",
    hours: "Lunes a Jueves: 8:00 - 23:00\nViernes y Sábados: 8:00 - 01:00\nDomingos: 9:00 - 22:00",
    instagram: "@puesto.sanvicente",
  },

  // Instagram
  instagramPosts: [],
  instagramStories: [],

  lastUpdated: new Date().toISOString(),
}

// Función para obtener la configuración actual
export function getSiteConfig(): SiteConfig {
  if (typeof window === "undefined") {
    return defaultConfig
  }

  try {
    const savedConfig = localStorage.getItem("puestoBarConfig")
    if (savedConfig) {
      return JSON.parse(savedConfig)
    }
  } catch (error) {
    console.error("Error loading site configuration:", error)
  }

  return defaultConfig
}

// Función para guardar la configuración
export function saveSiteConfig(config: Partial<SiteConfig>): SiteConfig {
  if (typeof window === "undefined") {
    return defaultConfig
  }

  try {
    const currentConfig = getSiteConfig()
    const newConfig = {
      ...currentConfig,
      ...config,
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem("puestoBarConfig", JSON.stringify(newConfig))

    // Aplicar cambios inmediatamente
    applyConfigChanges(newConfig)

    return newConfig
  } catch (error) {
    console.error("Error saving site configuration:", error)
    return getSiteConfig()
  }
}

// Función para restablecer la configuración predeterminada
export function resetSiteConfig(): SiteConfig {
  if (typeof window === "undefined") {
    return defaultConfig
  }

  try {
    localStorage.setItem("puestoBarConfig", JSON.stringify(defaultConfig))

    // Aplicar cambios inmediatamente
    applyConfigChanges(defaultConfig)

    return defaultConfig
  } catch (error) {
    console.error("Error resetting site configuration:", error)
    return getSiteConfig()
  }
}

// Función para aplicar cambios de configuración inmediatamente
function applyConfigChanges(config: SiteConfig): void {
  if (typeof window === "undefined") {
    return
  }

  // Aplicar música
  const audioElement = document.getElementById("background-music") as HTMLAudioElement
  if (audioElement) {
    audioElement.src = config.musicUrl
    audioElement.volume = config.musicVolume / 100
  }

  // Aplicar estilos a través de un elemento de estilo
  let styleEl = document.getElementById("theme-styles")
  if (!styleEl) {
    styleEl = document.createElement("style")
    styleEl.id = "theme-styles"
    document.head.appendChild(styleEl)
  }

  styleEl.textContent = `
    :root {
      --primary-color: ${config.primaryColor};
      --secondary-color: ${config.secondaryColor};
      --accent-color: ${config.accentColor};
      --background-color: ${config.backgroundColor};
      --text-color: ${config.textColor};
    }
  `

  // Disparar evento para notificar a los componentes
  window.dispatchEvent(new CustomEvent("siteConfigChanged", { detail: config }))
}

// Función para conectar con MongoDB (simulada)
export async function syncWithDatabase() {
  if (typeof window === "undefined") {
    return { success: false, message: "No se puede sincronizar en el servidor" }
  }

  console.log("Simulando sincronización con MongoDB...")

  try {
    // Obtener todos los datos que queremos sincronizar
    const config = getSiteConfig()
    const menuData = localStorage.getItem("puestoBarDashboardMenu")
    const instagramPosts = localStorage.getItem("puestoBarInstagramPosts")
    const instagramStories = localStorage.getItem("puestoBarInstagramStories")

    // En una implementación real, aquí enviaríamos estos datos a MongoDB
    // a través de una API REST o GraphQL

    // Simulación de conexión exitosa
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Guardar un registro de la sincronización
    localStorage.setItem("lastSyncWithMongoDB", new Date().toISOString())

    return {
      success: true,
      message: "Datos sincronizados con MongoDB correctamente",
      syncTime: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error en la sincronización:", error)
    return {
      success: false,
      message: "Error al sincronizar con MongoDB",
    }
  }
}

// Inicializar la configuración al cargar (solo en el cliente)
if (typeof window !== "undefined") {
  // Ejecutar en un setTimeout para asegurar que se ejecute después de la hidratación
  setTimeout(() => {
    // Cargar configuración al iniciar
    const config = getSiteConfig()

    // Aplicar configuración
    applyConfigChanges(config)

    // Escuchar cambios de almacenamiento de otras pestañas
    window.addEventListener("storage", (event) => {
      if (event.key === "puestoBarConfig") {
        try {
          const newConfig = JSON.parse(event.newValue || "{}")
          applyConfigChanges(newConfig)
        } catch (error) {
          console.error("Error processing storage event:", error)
        }
      }
    })

    console.log("Configuración del sitio inicializada")
  }, 0)
}

