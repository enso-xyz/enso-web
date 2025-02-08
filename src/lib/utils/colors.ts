// A set of balanced, zen-like gradients that complement our brand blue (#178bf1)
export const chatGradients = [
  // Calm blue to purple
  'from-[#178bf1] to-[#9f7aea]',
  // Soft teal to blue
  'from-[#0d9488] to-[#178bf1]',
  // Warm rose to purple
  'from-[#f43f5e] to-[#9f7aea]',
  // Ocean blue to emerald
  'from-[#178bf1] to-[#059669]',
  // Sunset orange to rose
  'from-[#f97316] to-[#f43f5e]',
  // Deep purple to blue
  'from-[#7c3aed] to-[#178bf1]',
  // Forest green to teal
  'from-[#059669] to-[#0d9488]',
  // Royal purple to indigo
  'from-[#9f7aea] to-[#6366f1]'
]

export function getChatGradient(chatId: string) {
  const index = chatId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % chatGradients.length
  return chatGradients[index]
} 