import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
    input: './demo/main.ts',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: './demo/bundle.js'
    },
    plugins: [
        resolve(),
        typescript({
            typescript: require("typescript"),
        }),
    ],
};