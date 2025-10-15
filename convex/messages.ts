import { query } from './_generated/server'

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
      throw new Error('Not authenticated')
    }
    // Bu fonksiyon artık kullanılmıyor, users tablosu kullanılıyor
    return []
  },
})