module.exports = {
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
};
