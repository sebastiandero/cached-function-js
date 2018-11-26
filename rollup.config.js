import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import sourceMaps from "rollup-plugin-sourcemaps"

export default [
    {
        input: 'src/index.ts',
        external: [
            ...Object.keys(pkg.dependencies || {}),
        ],
        output: [
            {file: pkg.main, format: 'cjs', sourcemap: true},
            {file: pkg.module, format: 'es', sourcemap: true},
        ],
        plugins: [typescript({useTsconfigDeclarationDir: true}), resolve(), commonjs(), sourceMaps()],
    },
    {
        input: 'src/index.ts',
        output: [
            {name: 'cachedFunctionsJs', file: pkg.browser, format: 'umd', sourcemap: true}
        ],
        plugins: [typescript({useTsconfigDeclarationDir: true}), resolve(), commonjs(), sourceMaps()],
    }
];