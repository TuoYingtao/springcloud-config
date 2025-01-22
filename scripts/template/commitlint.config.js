const fs = require('fs');
const path = require('path');

// 获取当前目录下的所有子目录，并去掉末尾的 's'
const scopes = fs
  .readdirSync(path.resolve(__dirname, ''), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name.replace(/s$/, ''));

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
  }
};