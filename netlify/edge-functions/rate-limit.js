export default async (request, context) => {
  // Hier später Rate-Limiting-Logik einbauen
  const response = await context.next();
  response.headers.set("X-Rate-Limit", "active");
  return response;
};
