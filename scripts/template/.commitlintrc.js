const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const mainDirName = '';

// git branch name = feature/cli_33 => auto get defaultIssues = #33
const issue = execSync('git rev-parse --abbrev-ref HEAD').toString().trim().split('_')[1];

const scopes = fs
  .readdirSync(path.resolve(__dirname, ''), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name.replace(/s$/, ''));

const gitStatus = execSync('git status --porcelain || true').toString().trim().split('\n');

// precomputed scope
const scopeComplete = gitStatus
  .find(r => ~r.indexOf(`M ${mainDirName}`))
  ?.replace(/(\/)/g, '%%')
  ?.match(/src%%((\w|-)*)/)?.[1]
  ?.replace(/s$/, '');

const subjectComplete = gitStatus
  .find(r => ~r.indexOf('M  packages/components'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%components%%((\w|-)*)/)?.[1];

console.log(scopeComplete);

/** @type {import('cz-git').UserConfig} */
module.exports = {
  ignores: [commit => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'always', scopes],
    'subject-case': [1, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['feature', 'update', 'fixbug', 'refactor', 'optimize', 'style', 'docs', 'test', 'build', 'ci', 'chore']
    ]
  },
  prompt: {
    scopes: ['site', 'util', 'script', 'tool', 'mock', ...scopes],
    scopeFilters: ['__tests__', '_util', '.DS_Store'],
    maxHeaderLength: 100,
    defaultScope: scopeComplete,
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    defaultSubject: subjectComplete && `[${subjectComplete}] `,
    allowEmptyIssuePrefixs: true,
    allowCustomIssuePrefixs: true,
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    useEmoji: true,
    emojiAlign: 'center',
    allowBreakingChanges: ['feature', 'fixbug'],
    defaultIssues: !issue ? '' : `#${issue}`,
    customIssuePrefixAlign: !issue ? 'top' : 'bottom',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    issuePrefixes: [
      // 如果使用 gitee 作为开发管理
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' }
    ],
    alias: {
      f: 'docs: fix typos',
      r: 'docs: update README',
      s: 'style: update code format',
      b: 'build: bump dependencies',
      c: 'chore: update config'
    },
    messages: {
      type: '请选择提交类型：',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围：',
      subject: '请简要描述提交（必填）：',
      body: '请输入详细描述（可选）:',
      breaking: '列举非兼容性重大的变更。使用 "|" 换行（可选）：',
      footerPrefixsSelect: '选择关联issue前缀（可选）:',
      customFooterPrefixs: '输入自定义issue前缀:',
      footer: '请输入要关闭的issue 例如: #31, #I3244（可选）：',
      confirmCommit: '确认使用以上信息提交？（y/n）'
    },
    types: [
      { value: 'feature', name: 'feature:     ✨ 新增功能 | A new feature', emoji: ':sparkles:' },
      { value: 'update', name: 'update:      🔧 更新功能 | A function update', emoji: ':update:' },
      { value: 'fixbug', name: 'fixbug:      🐛 修复缺陷 | A bug fixbug', emoji: ':bug:' },
      {
        value: 'refactor',
        name: 'refactor:    ♻️ 代码重构 | A code change that neither fixes a bug nor adds a feature',
        emoji: ':recycle:'
      },
      { value: 'optimize', name: 'optimize:    ⚡️ 性能提升 | A code change that improves optimize', emoji: ':zap:' },
      {
        value: 'style',
        name: 'style:       💄 代码格式 | Changes that do not affect the meaning of the code',
        emoji: ':lipstick:'
      },
      { value: 'docs', name: 'docs:        📝 文档更新 | Documentation only changes', emoji: ':memo:' },
      {
        value: 'test',
        name: 'test:        ✅ 测试相关 | Adding missing tests or correcting existing tests',
        emoji: ':white_check_mark:'
      },
      {
        value: 'build',
        name: 'build:       📦️ 构建相关 | Changes that affect the build system or external dependencies',
        emoji: ':package:'
      },
      {
        value: 'ci',
        name: 'ci:          🎡 持续集成 | Changes to our CI configuration files and scripts',
        emoji: ':ferris_wheel:'
      },
      { value: 'revert', name: 'revert:      🔨 回退代码 | Revert to a commit', emoji: ':hammer:' },
      {
        value: 'chore',
        name: 'chore:       ⏪️ 其他修改 | Other changes that do not modify src or test files',
        emoji: ':rewind:'
      }
    ]
  }
};
