import fs from "fs"
import glslx from "glslx"
import path from "path"
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
        const { output, log } = glslx.compile(code, {
          format: "json",
          renaming: disableRename ? "none" : "internal-only",
          fileAccess: (filePath, relativeTo) => {
            const absolutePath =
              relativeTo === "<stdin>"
                ? path.resolve(id, "..", filePath)
                : path.resolve(id, "..", relativeTo, "..", filePath)

            const data = fs.readFileSync(absolutePath, { encoding: "utf-8" })
            return data
          },
          prettyPrint,
          keepSymbols,
        })

        if (log) {
          throw new Error(log)
        }

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
          fs.writeFile(
            filePath,
            typeDeclaration,
            { encoding: "utf-8" },
            err => {
              if (err) {
                throw err
              }
            },
          )
        }

        return resultCode
      }
      return null
    },
  }
}
