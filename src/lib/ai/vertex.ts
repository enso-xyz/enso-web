import { VertexAI } from '@google-cloud/vertexai'

export const vertexAI = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID!,
  location: 'us-central1'
})
