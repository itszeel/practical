import { z } from 'zod'

export const validateWithZod = <T>(schema: z.Schema<T>, values: T) => {
  const result = schema.safeParse(values)
  if (result.success) return {}

  const errors: Record<string, string> = {}
  result.error.issues.forEach(issue => {
    const path = issue.path[0] as string
    if (path) errors[path] = issue.message
  })
  return errors
}
