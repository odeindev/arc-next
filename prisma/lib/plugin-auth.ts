export function validatePluginSecret(request: Request): boolean {
  const secret = request.headers.get("x-plugin-secret");
  return secret === process.env.PLUGIN_SECRET;
}
