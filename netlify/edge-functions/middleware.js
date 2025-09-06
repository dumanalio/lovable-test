export default async (request, context) => {
  // Beispiel: einfache Response-Header setzen
  const response = await context.next();
  response.headers.set("X-Custom-Edge", "Hello from Edge");
  return response;
};
