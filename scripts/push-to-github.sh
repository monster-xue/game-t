#!/bin/bash

# 《往死里挤》项目推送到 GitHub 脚本

echo "========================================="
echo "推送到 GitHub"
echo "========================================="
echo ""

# GitHub 配置
GITHUB_USER="monster-xue"
REPO_NAME="game-t"
REMOTE_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "📍 目标仓库: $REMOTE_URL"
echo ""

# 检查是否已添加远程仓库
if git remote get-url origin &>/dev/null; then
    echo "⚠️  检测到已存在的远程仓库:"
    git remote get-url origin
    echo ""
    read -p "是否要更新远程仓库地址? (y/n): " update_remote
    if [ "$update_remote" = "y" ] || [ "$update_remote" = "Y" ]; then
        git remote set-url origin $REMOTE_URL
        echo "✅ 远程仓库地址已更新"
    else
        echo "ℹ️  保持现有远程仓库配置"
    fi
else
    echo "📌 添加远程仓库..."
    git remote add origin $REMOTE_URL
    echo "✅ 远程仓库已添加"
fi
echo ""

# 推送主分支
echo "🚀 推送代码到 master 分支..."
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码推送成功！"
    echo ""
    echo "📍 仓库地址: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""

    # 推送标签
    echo "🏷️  推送版本标签..."
    git push origin v1.0.0

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 标签推送成功！"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎉 完成！"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📍 你的仓库地址:"
        echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
        echo ""
        echo "📌 下一步:"
        echo "   1. 访问上面的地址查看你的代码"
        echo "   2. 在 GitHub 上编辑 README.md（如果需要）"
        echo "   3. 设置仓库描述、标签等"
        echo ""
    else
        echo ""
        echo "⚠️  标签推送失败，但代码已成功推送"
        echo "你可以手动推送标签:"
        echo "   git push origin v1.0.0"
    fi
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "可能的原因:"
    echo "  1. GitHub 仓库还未创建"
    echo "  2. 认证信息未配置"
    echo "  3. 网络连接问题"
    echo ""
    echo "请检查:"
    echo "  • 是否已在 GitHub 上创建了仓库"
    echo "  • 是否已配置 GitHub 认证 (SSH Key 或 Personal Access Token)"
    echo "  • 网络连接是否正常"
    echo ""
fi
