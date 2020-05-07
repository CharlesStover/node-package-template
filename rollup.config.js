import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';
import typescript2 from 'rollup-plugin-typescript2';
import packageJson from './package.json';

const EXTERNAL = new Set([
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
]);

export default [
  {
    input: 'src/index.ts',
    external(id) {
      if (EXTERNAL.has(id)) {
        return true;
      }

      for (const pkg of EXTERNAL) {
        if (id.startsWith(`${pkg}/`)) {
          return true;
        }
      }

      return false;
    },
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
      },
      {
        file: packageJson.module,
        format: 'es',
      },
    ],
    plugins: [
      json({
        compact: true,
      }),
      url(),
      postcss({
        autoModules: true,
        extract: false,
        minimize: true,
        use: ['sass'],
      }),
      nodeResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs({
        extensions: ['.js', '.jsx'],
      }),
      typescript2({
        useTsconfigDeclarationDir: true,
      }),
    ],
  },
];
