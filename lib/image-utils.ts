/**
 * =============================================================================
 * IMAGE UTILS - UTILITÁRIOS PARA OTIMIZAÇÃO DE IMAGENS
 * =============================================================================
 * 
 * Funções para comprimir e redimensionar imagens antes do upload.
 * Garante que as imagens fiquem em um tamanho e qualidade adequados.
 * 
 * CONFIGURAÇÕES:
 * - MAX_WIDTH: Largura máxima da imagem (1200px)
 * - MAX_HEIGHT: Altura máxima da imagem (1200px)
 * - QUALITY: Qualidade da compressão (0.85 = 85%)
 * - MAX_SIZE_MB: Tamanho máximo do arquivo (2MB)
 * =============================================================================
 */

// Configurações de otimização - ALTERE AQUI SE NECESSÁRIO
const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const QUALITY = 0.85
const MAX_SIZE_MB = 2

/**
 * Comprime e redimensiona uma imagem mantendo a proporção.
 * Converte para JPEG para melhor compressão.
 * 
 * @param file - Arquivo de imagem original
 * @returns Promise com o arquivo otimizado
 */
export async function optimizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    // Se não for imagem, retorna o arquivo original
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      
      img.onload = () => {
        // Calcula as novas dimensões mantendo proporção
        let { width, height } = img
        
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width
          width = MAX_WIDTH
        }
        
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height
          height = MAX_HEIGHT
        }
        
        // Cria canvas para redimensionar
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Erro ao criar contexto do canvas'))
          return
        }
        
        // Aplica suavização para melhor qualidade
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        // Desenha a imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height)
        
        // Converte para blob JPEG com compressão
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erro ao converter imagem'))
              return
            }
            
            // Verifica se o tamanho está dentro do limite
            const sizeMB = blob.size / (1024 * 1024)
            if (sizeMB > MAX_SIZE_MB) {
              // Tenta comprimir mais se ainda estiver grande
              canvas.toBlob(
                (smallerBlob) => {
                  if (!smallerBlob) {
                    reject(new Error('Erro ao comprimir imagem'))
                    return
                  }
                  
                  const optimizedFile = new File(
                    [smallerBlob],
                    file.name.replace(/\.[^/.]+$/, '.jpg'),
                    { type: 'image/jpeg' }
                  )
                  resolve(optimizedFile)
                },
                'image/jpeg',
                0.7 // Qualidade menor para arquivos grandes
              )
              return
            }
            
            // Cria o arquivo otimizado
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.jpg'),
              { type: 'image/jpeg' }
            )
            
            resolve(optimizedFile)
          },
          'image/jpeg',
          QUALITY
        )
      }
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }
  })
}

/**
 * Obtém as dimensões de uma imagem.
 * 
 * @param file - Arquivo de imagem
 * @returns Promise com largura e altura
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({ width: img.width, height: img.height })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Erro ao carregar imagem'))
    }
  })
}

/**
 * Formata o tamanho do arquivo para exibição.
 * 
 * @param bytes - Tamanho em bytes
 * @returns String formatada (ex: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
