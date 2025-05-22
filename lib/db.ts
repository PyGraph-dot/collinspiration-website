import { neon } from "@neondatabase/serverless"

// Create a SQL client with only supported options
export const sql = neon(process.env.DATABASE_URL!)

// Also export as default for compatibility
export default sql
