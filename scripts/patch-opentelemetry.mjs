/**
 * Post-build script: ensures @opentelemetry/api is in the function bundle.
 *
 * Vercel's nft file tracer fails to include @opentelemetry/api in git-triggered
 * deploys. This script copies it manually to the function directory after build.
 */
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const funcDir = resolve('.vercel/output/functions/_render.func');
const targetDir = resolve(funcDir, 'node_modules/@opentelemetry/api');
const sourceDir = resolve('node_modules/@opentelemetry/api');

if (existsSync(funcDir) && existsSync(sourceDir)) {
  if (!existsSync(targetDir)) {
    cpSync(sourceDir, targetDir, { recursive: true });
    console.log('✅ Copied @opentelemetry/api to function bundle');
  } else {
    console.log('✅ @opentelemetry/api already in function bundle');
  }
} else {
  if (!existsSync(funcDir)) {
    console.log('⚠️  Function directory not found, skipping patch');
  }
  if (!existsSync(sourceDir)) {
    console.log('⚠️  @opentelemetry/api not found in node_modules');
  }
}
