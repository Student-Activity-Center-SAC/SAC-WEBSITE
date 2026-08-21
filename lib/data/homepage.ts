
export async function getHomepageEvents(limit = 5) {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await Promise.resolve({ data: [] as any[], count: 0, error: null });
  return data ?? [];
}
