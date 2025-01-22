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

/** @type {import('cz-git').UserConfig} */
module.exports = {
  ignores: [commit => commit.includes('init')],                     // 忽略包含 'init' 的提交
  extends: ['@commitlint/config-conventional'],                     // 继承 @commitlint/config-conventional 配置
  rules: {
    'body-leading-blank': [1, 'always'],                            // body 前必须有空行
    'footer-leading-blank': [1, 'always'],                          // footer 前必须有空行
    'header-max-length': [2, 'always', 72],                         // header 最长 72 字符
    'scope-case': [2, 'always', 'lower-case'],                      // scope 必须小写
    'scope-enum': [2, 'always', scopes],                            // scope 必须是预定义的值
    'subject-case': [1, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']], // subject 不允许特定大小写
    'subject-empty': [2, 'never'],                                  // subject 不能为空
    'subject-full-stop': [2, 'never', '.'],                         // subject 不能以 '.' 结尾
    'type-case': [2, 'always', 'lower-case'],                       // type 必须小写
    'type-empty': [2, 'never'],                                     // type 不能为空
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'optimize', 'style', 'docs', 'test', 'build', 'ci', 'revert', 'chore', 'perf', 'security']] // 预定义的 type
  },
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
    ]
  }
};
