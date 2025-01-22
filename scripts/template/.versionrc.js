module.exports = {
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
  releaseCommitMessageFormat: 'chore(release): 发布版本 {{currentTag}}'
};
