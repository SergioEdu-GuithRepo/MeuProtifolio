// src/sanityClient.ts
import {createClient} from '@sanity/client'

export default createClient({
  projectId: '9esw1hz4', // Encontre em sanity.io/manage
  dataset: 'production',
  useCdn: true, // `false` se quiser dados sempre frescos
  apiVersion: '2023-05-03',
})