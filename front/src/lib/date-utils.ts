import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

/**
 * Formats a date string to ISO format with time for Prisma
 * @param dateString Date string in YYYY-MM-DD format
 * @returns ISO formatted date string
 */
export function formatDateForPrisma(dateString) {
  if (!dateString) return null

  // Add time component and convert to ISO string
  return new Date(`${dateString}T00:00:00Z`).toISOString()
}

/**
 * Formats a date for display
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDateForDisplay(dateString) {
  if (!dateString) return "N/A"

  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString
    return format(date, "dd MMMM yyyy", { locale: fr })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date invalide"
  }
}

/**
 * Formats a date for input fields
 * @param dateString ISO date string
 * @returns YYYY-MM-DD formatted string
 */
export function formatDateForInput(dateString) {
  if (!dateString) return ""

  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString
    return format(date, "yyyy-MM-dd")
  } catch (error) {
    console.error("Error formatting date for input:", error)
    return ""
  }
}

