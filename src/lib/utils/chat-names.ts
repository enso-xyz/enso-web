import { friendlyWords } from 'friendlier-words'

export function generateChatName() {
  // Generate a 2-word name with a space separator
  return friendlyWords(2, ' ')
}