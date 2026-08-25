const projectImages = {
  "/projects/sallihogullari-hafriyat-cover.png": "/projects/optimized/sallihogullari-hafriyat-cover.avif",
} as const

const logoImages = {
  "/projects/salihogullari-hafriyat-logo.png": "/projects/optimized/salihogullari-hafriyat-logo.avif",
  "/projects/adakan-software-logo.png": "/projects/optimized/adakan-software-logo.avif",
  "/projects/adakan-hafriyat-insaat-logo.png": "/projects/optimized/adakan-hafriyat-insaat-logo.avif",
} as const

export function getOptimizedProjectImage(source: string) {
  return projectImages[source as keyof typeof projectImages] ?? source
}

export function getOptimizedLogoImage(source: string) {
  return logoImages[source as keyof typeof logoImages] ?? source
}
