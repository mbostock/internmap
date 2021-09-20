import {readFileSync} from "fs";
import {terser} from "rollup-plugin-terser";
import * as meta from "./package.json";

// Extract copyrights from the LICENSE.
const copyright = readFileSync("./LICENSE", "utf-8")
  .split(/\n/g)
  .filter(line => /^copyright\s+/i.test(line))
  .map(line => line.replace(/^copyright\s+/i, ""))
  .join(", ");

const config = {
  input: "src/index.js",
  output: {
    file: `dist/${meta.name}.js`,
    name: "internmap",
    format: "umd",
    indent: false,
    banner: `// ${meta.homepage} v${meta.version} Copyright ${copyright}`
  },
  plugins: []
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${meta.name}.min.js`
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner
        },
        mangle: {
          reserved: [
            "InternMap",
            "InternSet"
          ]
        }
      })
    ]
  }
];
