import fs from "fs/promises"
import glslx from "glslx"
import { defineConfig, Plugin } from "vite"
import Inspect from "vite-plugin-inspect"

export default defineConfig({
  root: "./src",
  plugins: [glslxPlugin({ writeTypeDeclarations: true }), Inspect()],
})

type GlslxPluginOptions = {
  disableRename?: boolean
  prettyPrint?: boolean
  keepSymbols?: boolean
  writeTypeDeclarations?: boolean
}

function glslxPlugin({
  disableRename = false,
  prettyPrint = false,
  keepSymbols = false,
  writeTypeDeclarations = false,
}: GlslxPluginOptions = {}): Plugin {
  return {
    name: "vite:glslx-plugin",
    transform(code, id) {
      if (id.endsWith(".glslx")) {
        const { output } = glslx.compile(code, {
          format: "json",
          renaming: disableRename ? "none" : "internal-only",
          prettyPrint,
          keepSymbols,
        })
        const result = JSON.parse(output)

        const resultCode = result.shaders.reduce((acc, { name, contents }) => {
          return (acc += `export const ${name} = "${contents}";`)
        }, "")

        // Write TypeScript type declaration file
        if (writeTypeDeclarations) {
          let typeDeclaration = "declare const shaders: {\n"
          result.shaders.forEach(({ name }) => {
            typeDeclaration += `  readonly "${name}": string;\n`
          })
          typeDeclaration += "}\nexport = shaders;\n"
          const filePath = `${id}.d.ts`
          fs.writeFile(filePath, typeDeclaration, { encoding: "utf-8" })
        }

        return resultCode
      }
      return null
    },
  }
}
