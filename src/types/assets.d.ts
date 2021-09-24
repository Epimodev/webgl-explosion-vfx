// Save this as the file "glslx.d.ts" alongside your source code
declare module "*.glslx" {
  const values: Record<string, string>
  export = values
}
