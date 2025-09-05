import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

export default [
  // Main library bundle
  {
    input: 'lib/src/simplest.ts',
    output: [
      {
        file: 'dist/simplistic.esm.js',
        format: 'es',
        sourcemap: !production
      },
      {
        file: 'dist/simplistic.cjs.js',
        format: 'cjs',
        sourcemap: !production,
        exports: 'named'
      },
      {
        file: 'dist/simplistic.umd.js',
        format: 'umd',
        name: 'Simplistic',
        sourcemap: !production
      }
    ],
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: !production,
        inlineSources: !production
      }),
      production && terser()
    ].filter(Boolean)
  },
  
  // Extended components bundle
  {
    input: 'lib/src/extended.ts',
    output: [
      {
        file: 'dist/extended.esm.js',
        format: 'es',
        sourcemap: !production
      },
      {
        file: 'dist/extended.cjs.js',
        format: 'cjs',
        sourcemap: !production,
        exports: 'named'
      }
    ],
    external: ['./simplest.js'],
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: !production,
        inlineSources: !production
      }),
      production && terser()
    ].filter(Boolean)
  },
  
  // State management bundle
  {
    input: 'lib/src/state.ts',
    output: [
      {
        file: 'dist/state.esm.js',
        format: 'es',
        sourcemap: !production
      },
      {
        file: 'dist/state.cjs.js',
        format: 'cjs',
        sourcemap: !production,
        exports: 'named'
      }
    ],
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: !production,
        inlineSources: !production
      }),
      production && terser()
    ].filter(Boolean)
  }
]