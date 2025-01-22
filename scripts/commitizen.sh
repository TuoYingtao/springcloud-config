#!/usr/bin/env sh

#=========================================  配置文件相关  =========================================#

# 临时 commitlint 配置文件名
commitlintrc_temp_file_name=".commitlintrc_temp.js"

# 创建临时 commitlint 配置文件
cat <<EOF > $commitlintrc_temp_file_name
# .commitlintrc.js的内容
EOF

# 定义全局脚本别名
alias_release_name="git_release"

# 定义常用的 shell 配置文件路径
bash_profile_dir="$HOME/.bash_profile"
bashrc_dir="$HOME/.bashrc"
bash_aliases_dir="$HOME/.bash_aliases"
script_tools_dir="$HOME/.script_tools"
git_cz_dir="$HOME/.czrc"
husky_dir="$HOME/.husky"

# 定义发布脚本和配置文件的路径
release_script_file_path="bin/release.sh"
releaseConfigFilePath="template/.versionrc.js"

# 定义目标路径，用于存储发布脚本和配置文件
target_release_script_file_path="$script_tools_dir/.release.sh"
target_release_config_file_path="$HOME/.versionrc.js"
target_commitizen_config_file_path="$HOME/.commitlintrc.js"

# 初始化命令合并字符串
command_merge=""

# 定义安装 commitizen 及相关工具的命令
command_commitizen="npm install -g commitizen cz-git husky @commitlint/cli @commitlint/config-conventional standard-version"

# 将安装命令添加到命令合并字符串中
command_merge+="${command_commitizen};"

# 初始化 Husky 并添加 commit-msg 钩子的命令
command_husky="git init && npx husky install ~/.husky && npx husky add ~/.husky/commit-msg \"npx --no-install commitlint --edit '\$1'\""

# 将 Husky 初始化命令添加到命令合并字符串中
command_merge+="${command_husky};"

# 删除临时文件
removerTempFile() {
  rm $commitlintrc_temp_file_name
}

# 将 alias 配置路径写入到 .bashrc 文件中
writtenAliasConfigToBashrc() {
  touch "$bashrc_dir"
  cat << EOF > $bashrc_dir
if [ -f ~/.bash_aliases ]; then
  . ~/.bash_aliases
fi
EOF
}

# 创建目录和配置文件
createConfigDirAndFile() {
  [ ! -d "$script_tools_dir" ] && mkdir -p "$script_tools_dir" && echo "Create an initialization commitlintrc script tool directory: $script_tools_dir"
  [ ! -f "$target_release_script_file_path" ] && touch "$target_release_script_file_path" && echo "Create a release script file: $target_release_script_file_path"
  [ ! -f "$target_release_config_file_path" ] && touch "$target_release_config_file_path" && echo "Create a distribution provisioning profile: $target_release_config_file_path"
  [ ! -f "$target_commitizen_config_file_path" ] && touch "$target_commitizen_config_file_path" && echo "Create commitlintrc configuration file: $target_commitizen_config_file_path"
  [ ! -f "$git_cz_dir" ] && touch "$git_cz_dir" && echo "Create cz-git configuration file: $git_cz_dir"
  [ ! -f "$husky_dir" ] && touch "$husky_dir" && echo "Create husky configuration file: $husky_dir"
  # Window 环境
  if [ "$platform_type" -eq 3 ]; then
    [ ! -f "$bash_aliases_dir" ] && touch "$bash_aliases_dir" && echo "Create a global alias configuration file: $bash_aliases_dir"
    [ ! -f "$bash_profile_dir" ] && touch "$bash_profile_dir" && echo "Create a global bash_profile configuration file: $bash_profile_dir"
  fi
}

# 全局配置文件写入配置信息
writtenCommitizenConfig() {
  # 执行合并的命令
  eval $command_merge

  # 写入配置内容
  echo '{"path": "cz-git", "$schema": "https://cdn.jsdelivr.net/gh/Zhengqbbb/cz-git@1.9.1/docs/public/schema/cz-git.json", "useEmoji": true }' > "$git_cz_dir"
  cat .commitlintrc_temp.js > "$target_commitizen_config_file_path"
  cat "$release_script_file_path" > "$target_release_script_file_path"
  cat "$releaseConfigFilePath" > "$target_release_config_file_path"

  # 根据平台类型添加别名到相应的 shell 配置文件
  if [ "$platform_type" -eq 1 ] || [ "$platform_type" -eq 2 ]; then
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
    # Window 环境
    [ ! -f "$bashrc_dir" ] && writtenAliasConfigToBashrc && echo "Write the alias configuration path to the .bashrc file: $bashrc_dir"
    echo "alias ${alias_release_name}='bash ${target_release_script_file_path}'" >> $bash_aliases_dir
    echo "Add alias ${alias_release_name} ${alias_release_name}='bash ${target_release_script_file_path}' to ${bash_aliases_dir}."
    source $bashrc_dir
    source $bash_aliases_dir
  else
    echo "Initialization failed"
  fi

  # 清空命令合并字符串
  command_merge=""

  # 初始化全局husky
  # eval cd $husky_dir
  # eval git init
  # npx husky install ~/.husky
  # npx husky add ~/.husky/commit-msg "npx --no-install commitlint --edit '$1'"
}

#=========================================  业务相关  =========================================#

# 获取当前系统平台信息
platform_type=0
platform=$(uname)
electron="electron"
commitizen="commitizen"

# 显示使用说明
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

# 处理平台信息
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

# 调用平台处理函数
platformHandler

# 初始化全局配置
initCommitizen() {
  createConfigDirAndFile
  if [ "$platform_type" == 1 ]; then
    echo "Linux Initializing..."
    writtenCommitizenConfig
  elif [ "$platform_type" == 2 ]; then
    echo "MacOS Initializing..."
    writtenCommitizenConfig
  elif [ "$platform_type" == 3 ]; then
    echo "Windows Initializing..."
    writtenCommitizenConfig
  else
    echo "Initialization failed"
  fi
}

# 检查全局 npm 依赖列表是否安装必备的依赖
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

# 删除临时文件
removerTempFile
echo "🎉🎉🎉 Commitizen init finished."
