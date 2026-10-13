#!/usr/bin/env node
/**
 * Install Agent skill packages into a target directory.
 * Default: ~/.cursor/skills (Cursor). Override with --dest for any editor.
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = path.resolve(__dirname, '..')

const SKILLS = [
  'screenshot-to-vue-ready-html',
  'axure-html-restore',
  'vue-ready-html-to-vue3',
]

const PRESETS = {
  cursor: () => path.join(os.homedir(), '.cursor', 'skills'),
  'cursor-project': () => path.join(process.cwd(), '.cursor', 'skills'),
  claude: () => path.join(process.cwd(), '.claude', 'skills'),
  agents: () => path.join(process.cwd(), '.agents', 'skills'),
  local: () => path.join(process.cwd(), 'agent-skills'),
}

function usage() {
  console.log(`
html-vue-agent-skills — install screenshot / Axure / Vue3 agent workflows

Usage:
  npx html-vue-agent-skills [install] [skill...] [options]
  npx html-vue-agent-skills list
  npx html-vue-agent-skills help

Skills (omit = install all):
  ${SKILLS.join('\n  ')}

Options:
  --dest <dir>     Install directory (overrides --preset)
  --preset <name>  cursor | cursor-project | claude | agents | local
                   default: cursor  →  ~/.cursor/skills
  --force          Overwrite existing skill folders

Examples:
  # Cursor 用户目录（默认）
  npx html-vue-agent-skills

  # 只装第 3 个
  npx html-vue-agent-skills install vue-ready-html-to-vue3

  # 当前项目（任意编辑器可引用）
  npx html-vue-agent-skills --preset local
  npx html-vue-agent-skills --dest ./.agent-skills

  # 从 Gitee 直接跑（未发 npm 时）
  npx --yes git+https://gitee.com/zxc19890923/cursor-skills-trace-html-vue.git
`.trim())
}

function parseArgs(argv) {
  const args = {
    cmd: 'install',
    skills: [],
    dest: null,
    preset: 'cursor',
    force: false,
  }
  const tokens = [...argv]
  if (tokens[0] === 'help' || tokens[0] === '-h' || tokens[0] === '--help') {
    args.cmd = 'help'
    return args
  }
  if (tokens[0] === 'list') {
    args.cmd = 'list'
    return args
  }
  if (tokens[0] === 'install') tokens.shift()

  while (tokens.length) {
    const t = tokens.shift()
    if (t === '--dest') args.dest = tokens.shift()
    else if (t === '--preset') args.preset = tokens.shift()
    else if (t === '--force') args.force = true
    else if (t.startsWith('-')) {
      console.error(`Unknown option: ${t}`)
      process.exit(1)
    } else if (SKILLS.includes(t)) args.skills.push(t)
    else {
      console.error(`Unknown skill: ${t}`)
      console.error(`Available: ${SKILLS.join(', ')}`)
      process.exit(1)
    }
  }
  if (!args.skills.length) args.skills = [...SKILLS]
  return args
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(from, to)
    else fs.copyFileSync(from, to)
  }
}

function resolveDest(args) {
  if (args.dest) return path.resolve(args.dest)
  const preset = PRESETS[args.preset]
  if (!preset) {
    console.error(`Unknown preset: ${args.preset}`)
    console.error(`Available: ${Object.keys(PRESETS).join(', ')}`)
    process.exit(1)
  }
  return preset()
}

function install(args) {
  const destRoot = resolveDest(args)
  fs.mkdirSync(destRoot, { recursive: true })
  console.log(`Install → ${destRoot}`)

  for (const name of args.skills) {
    const src = path.join(PKG_ROOT, name)
    const dest = path.join(destRoot, name)
    if (!fs.existsSync(path.join(src, 'SKILL.md'))) {
      console.error(`Missing package: ${name}`)
      process.exit(1)
    }
    if (fs.existsSync(dest) && !args.force) {
      console.log(`  skip  ${name} (exists, use --force to overwrite)`)
      continue
    }
    fs.rmSync(dest, { recursive: true, force: true })
    copyDir(src, dest)
    console.log(`  ok    ${name}`)
  }

  console.log('\nDone. Point your Agent at the SKILL.md under each folder, or use Cursor auto-discovery if dest is ~/.cursor/skills.')
}

function list() {
  console.log('Available skills:\n')
  for (const name of SKILLS) {
    const skillPath = path.join(PKG_ROOT, name, 'SKILL.md')
    const ok = fs.existsSync(skillPath)
    console.log(`  ${ok ? '✓' : '✗'} ${name}`)
  }
}

const args = parseArgs(process.argv.slice(2))
if (args.cmd === 'help') usage()
else if (args.cmd === 'list') list()
else install(args)
