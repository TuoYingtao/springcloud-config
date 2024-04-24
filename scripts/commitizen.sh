#!/usr/bin/env sh
#=========================================  配置文件相关  =========================================#
commitlintrc_temp_file_name=".commitlintrc_temp.js"
cat <<EOF > $commitlintrc_temp_file_name
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
  .find(r => ~r.indexOf(\`M \${mainDirName}\`))
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
    defaultSubject: subjectComplete && \`[\${subjectComplete}] \`,
    allowEmptyIssuePrefixs: true,
    allowCustomIssuePrefixs: true,
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    useEmoji: true,
    emojiAlign: 'center',
    allowBreakingChanges: ['feature', 'fixbug'],
    defaultIssues: !issue ? '' : \`#\${issue}\`,
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
EOF

alias_release_name="git_release"

bash_profile_dir="$HOME/.bash_profile"
bashrc_dir="$HOME/.bashrc"
bash_aliases_dir="$HOME/.bash_aliases"
script_tools_dir="$HOME/.script_tools"
git_cz_dir="$HOME/.czrc"

release_script_file_path="bin/release.sh"
releaseConfigFilePath="template/.versionrc.js"

target_release_script_file_path="$script_tools_dir/.release.sh"
target_release_config_file_path="$HOME/.versionrc.js"
target_commitizen_config_file_path="$HOME/.commitlintrc.js"

command_merge=""
command_commitizen="npm install -g cz-git commitizen @commitlint/cli @commitlint/config-conventional standard-version"

command_merge+="${command_commitizen};"

initCommitizenConfig() {
  eval $command_merge
  if [ ! -d "$script_tools_dir" ]; then
    mkdir -p "$script_tools_dir"
    echo "Created directory: $script_tools_dir"
  fi
  if [ ! -f "$target_release_script_file_path" ]; then
    touch "$target_release_script_file_path"
    echo "Created file: $target_release_script_file_path"
  fi
    if [ ! -f "$git_cz_dir" ]; then
    touch "$git_cz_dir"
    echo "Created file: $git_cz_dir"
  fi
  if [ ! -f "$target_release_config_file_path" ]; then
    touch "$target_release_config_file_path"
    echo "Created file: $target_release_config_file_path"
  fi
  if [ ! -f "$target_commitizen_config_file_path" ]; then
    touch "$target_commitizen_config_file_path"
    echo "Created file: $target_commitizen_config_file_path"
  fi
  echo '{"path": "cz-git", "$schema": "https://cdn.jsdelivr.net/gh/Zhengqbbb/cz-git@1.9.1/docs/public/schema/cz-git.json", "useEmoji": true }' > "$git_cz_dir"
  cat .commitlintrc_temp.js > "$target_commitizen_config_file_path"
  cat "$release_script_file_path" > "$target_release_script_file_path"
  cat "$releaseConfigFilePath" > "$target_release_config_file_path"

  if [ "$platform_type" -eq 1 -o "$platform_type" -eq 2 ]; then
    if [ -f ~/.zshrc ]; then
      echo "alias ${alias_release_name}='bash ${target_release_script_file_path}'" >> ~/.zshrc
      echo "Added alias ${alias_release_name} to ~/.zshrc"
      source ~/.zshrc
    elif [ -f ~/.bashrc ]; then
      echo "alias ${alias_release_name}='bash ${target_release_script_file_path}'" >> ~/.bashrc
      echo "Added alias ${alias_release_name} to ~/.bashrc"
      source ~/.bashrc
    elif [ -f ~/.bash_profile ]; then
      echo "alias ${alias_release_name}='bash ${target_release_script_file_path}'" >> ~/.bash_profile
      echo "Added alias ${alias_release_name} to ~/.bash_profile"
      source ~/.bash_profile
    else
      echo "Warning: No suitable shell configuration file found, skipping..."
    fi
  elif [ "$platform_type" -eq 3 ]; then
    if [ ! -f "$bash_aliases_dir" ]; then
      touch "$bash_aliases_dir"
      echo "Created file: $bash_aliases_dir"
    fi
    if [ ! -f "$bash_profile_dir" ]; then
      touch "$bash_profile_dir"
      echo "Created file: $bash_profile_dir"
    fi
    if [ ! -f "$bashrc_dir" ]; then
      touch "$bashrc_dir"
      cat << EOF > $bashrc_dir
if [ -f ~/.bash_aliases ]; then 
  . ~/.bash_aliases 
fi
EOF
      echo "Created file: $bashrc_dir"
    fi
    echo "alias ${alias_release_name}='bash ${target_release_script_file_path}'" >> $bash_aliases_dir
    echo "Added alias ${alias_release_name} to ${bash_aliases_dir}"
    source $bashrc_dir
    source $bash_aliases_dir
  else
    echo "初始化失败"
  fi;
  command_merge=""
  
}

removerTempFile() {
  rm $commitlintrc_temp_file_name
}

#=========================================  业务相关  =========================================#

# 获取当前系统平台信息
platform_type=0
platform=$(uname)
electron="electron"
commitizen="commitizen"

usage() {
  echo " "
  echo "GIT COMMIT 规范工具"
  echo ""
  echo "使用方式"
  echo "  git add ."
  echo "  git commit 'message' 替换 git cz"
  echo ""
  echo "GIT 发布版本"
  echo "版本号说明: major.minor.patch (主版本.次版本.修订版)"
  echo ""
  echo "使用方式"
  echo "  git_release --options"
  echo ""
  echo "参数列表[--options]："
  echo "  -f|--first-release:          用于生成第一个版本时，忽略之前的提交历史。"
  echo "  -p|--prerelease:             预发版本。例如 --prerelease alpha。"
  echo "  -r|--release-as              指定发布的版本号。例如 --tag-prefix [patch or minor or major or 1.0.1] 默认为：path"
  echo "  -t|--tag-prefix:             版本标签前缀。例如 --tag-prefix v。 默认为：v"
  echo "  -n|--no-verify:              跳过提交消息格式的验证。"
  echo "  -d|--dry-run:                运行模拟模式，不实际修改文件。"
  echo "  -b|--branch:                 切换git分支"
}

platformHandler() {
  # 根据平台信息进行判断
  case $platform in
    "Linux")
      echo "Current platform is Linux"
      platform_type=1
      return 1
      ;;
    "Darwin")
      echo "Current platform is macOS"
      platform_type=2
      return 2
      ;;
    "Windows" | *"MINGW64_NT"* | *"MINGW32_NT"*)
      echo "Current platform is Windows"
      platform_type=3
      return 3
      ;;
    *)
      echo "Unknown platform: $platform"
      platform_type=0
      return 0
      ;;
  esac
}

platformHandler
# echo $?

initCommitizen() {
  if [ "$platform_type" == 1 ]; then
    echo "Linux 初始化中"
    initCommitizenConfig
  elif [ "$platform_type" == 2 ]; then
    echo "MacOS 初始化中"
    initCommitizenConfig
  elif [ "$platform_type" == 3 ]; then
    echo "Windows 初始化中"
    initCommitizenConfig
  else
    echo "初始化失败"
  fi;
}

if npm_list=$(npm list -g --depth=0 --json); then
  echo "Check the contents of the npm global list:"
  echo "$npm_list"
  if echo "$npm_list" | grep -q "\"$commitizen\":"; then
    usage
  else
    initCommitizen
    usage
  fi
else
  echo "空存在"
  echo "Check the contents of the npm global list:"
  echo "$npm_list"
  initCommitizen
  usage
fi

removerTempFile
echo "🎉🎉🎉 Commitizen init finished."