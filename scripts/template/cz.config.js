const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const mainDirName = '';

// 获取当前分支名，例如：feat/cli_33 => 自动获取 defaultIssues = #33
const issue = execSync('git rev-parse --abbrev-ref HEAD').toString().trim().split('_')[1];

// 获取当前目录下的所有子目录，并去掉末尾的 's'
const scopes = fs
  .readdirSync(path.resolve(__dirname, ''), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name.replace(/s$/, ''));

// 获取 git 状态
const gitStatus = execSync('git status --porcelain || true').toString().trim().split('\n');

// 预计算 scope
const scopeComplete = gitStatus
  .find(r => ~r.indexOf(`M ${mainDirName}`))
  ?.replace(/(\/)/g, '%%')
  ?.match(/src%%((\w|-)*)/)?.[1]
  ?.replace(/s$/, '');

// 预计算 subject
const subjectComplete = gitStatus
  .find(r => ~r.indexOf('M  packages/components'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%components%%((\w|-)*)/)?.[1];

module.exports = {
    alias: {
      tf: 'docs: fix typos',
      ur: 'docs: update README',
      cs: 'style: update code format',
      bd: 'build: bump dependencies',
      uc: 'chore: update config',
      at: 'test: add or update tests',
      oe: 'optimize: enhance efficiency',
      ip: 'perf: improve performance',
      fx: 'fix: bug fixes',
      nf: 'feat: add new features'
    },
    messages: {
      type: '选择你要提交的更改类型：',
      scope: '选择影响的模块（可选）：',
      customScope: '请输入自定义模块名称：',
      subject: '简要描述提交内容（必填）：',
      body: '详细描述提交内容（可选）：',
      breaking: '列出所有的不兼容性更改（可选；使用 "|" 换行）：',
      footerPrefixsSelect: '选择关联issue前缀（可选）:',
      customFooterPrefixs: '输入自定义issue前缀:',
      footer: '请输入要关闭的issue 例如: #31, #I3244（可选）：',
      confirmCommit: '确认使用以上信息提交？（y/n）'
    },
    types: [
      { value: 'feat',     name: 'feat:        ✨ 新增功能 | Introducing new features', emoji: ':sparkles:' },
      { value: 'fix',      name: 'fix:         🐛 修复缺陷 | Bug fixes', emoji: ':bug:' },
      { value: 'refactor', name: 'refactor:    ♻️ 代码重构 | Code changes that neither fix bugs nor add features', emoji: ':recycle:'},
      { value: 'optimize', name: 'optimize:    ⚡️ 性能提升 | Code changes that enhance efficiency', emoji: ':zap:' },
      { value: 'style',    name: 'style:       💄 代码格式 | Code style changes without affecting functionality', emoji: ':lipstick:' },
      { value: 'docs',     name: 'docs:        📝 文档更新 | Documentation updates', emoji: ':memo:' },
      { value: 'test',     name: 'test:        ✅ 测试相关 | Adding or updating tests', emoji: ':white_check_mark:' },
      { value: 'build',    name: 'build:       🔧 构建相关 | Changes affecting the build system or dependencies', emoji: ':package:' },
      { value: 'ci',       name: 'ci:          👷 持续集成 | CI configuration and script changes', emoji: ':ferris_wheel:' },
      { value: 'revert',   name: 'revert:      ⏪️ 回退代码 | Reverting previous commits', emoji: ':hammer:' },
      { value: 'chore',    name: 'chore:       🔨 杂项修改 | Miscellaneous changes not affecting source or tests', emoji: ':rewind:' },
      { value: 'perf',     name: 'perf:        🚀 性能提升 | Performance improvements', emoji: ':rocket:' },
      { value: 'security', name: 'security:    🔒 安全相关 | Security improvements or fixes', emoji: ':lock:' }
  ],
  prompt: {
    scopes: ['site', 'util', 'script', 'tool', 'mock', ...scopes],  // 提交影响的模块
    scopeFilters: ['__tests__', '_util', '.DS_Store'],              // 过滤特定的 scope
    maxHeaderLength: 100,                                           // header 最长 100 字符
    defaultScope: scopeComplete,                                    // 默认 scope
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',           // 自定义 scope 的位置
    defaultSubject: subjectComplete && `[${subjectComplete}] `,     // 默认 subject
    allowEmptyIssuePrefixs: true,                                   // 允许空的 issue 前缀
    allowCustomIssuePrefixs: true,                                  // 允许自定义 issue 前缀
    customScopesAlias: 'custom',                                    // 自定义 scope 的别名
    emptyScopesAlias: 'empty',                                      // 空 scope 的别名
    useEmoji: true,                                                 // 使用 emoji
    emojiAlign: 'center',                                           // emoji 对齐方式
    allowBreakingChanges: ['feat', 'fix'],                          // 允许 breaking changes 的 type
    "breakingPrefix": "💥 BREAKING CHANGE:",                        // breaking changes 的前缀
    defaultIssues: !issue ? '' : `#${issue}`,                       // 默认 issue
    customIssuePrefixAlign: !issue ? 'top' : 'bottom',              // 自定义 issue 前缀的位置
    emptyIssuePrefixAlias: 'skip',                                  // 空 issue 前缀的别名
    customIssuePrefixAlias: 'custom',                               // 自定义 issue 前缀的别名
    issuePrefixes: [                                                // 如果使用 gitee 作为开发管理
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' }
    ],
  }
};