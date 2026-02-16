#!/bin/bash

# 《往死里挤》项目验证脚本
# 用于检查项目完成度和配置

echo "========================================="
echo "《往死里挤》项目验证脚本"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_checks=0
passed_checks=0

check() {
    total_checks=$((total_checks + 1))
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

# 1. 检查项目结构
echo "1. 检查项目结构..."
test -d assets/scripts/core && check "核心脚本目录存在"
test -d assets/scripts/physics && check "物理脚本目录存在"
test -d assets/scripts/ui && check "UI脚本目录存在"
test -d assets/scripts/systems && check "系统脚本目录存在"
test -d assets/scripts/utils && check "工具脚本目录存在"
test -d assets/resources/data && check "数据资源目录存在"
echo ""

# 2. 检查核心脚本文件
echo "2. 检查核心脚本文件..."
test -f assets/scripts/core/GameConstants.ts && check "GameConstants.ts"
test -f assets/scripts/core/GameManager.ts && check "GameManager.ts"
test -f assets/scripts/core/PhysicsManager.ts && check "PhysicsManager.ts"
test -f assets/scripts/core/Ball.ts && check "Ball.ts"
test -f assets/scripts/core/BallManager.ts && check "BallManager.ts"
test -f assets/scripts/core/ContainerManager.ts && check "ContainerManager.ts"
test -f assets/scripts/core/LevelLoader.ts && check "LevelLoader.ts"
echo ""

# 3. 检查物理系统
echo "3. 检查物理系统..."
test -f assets/scripts/physics/MovingContainer.ts && check "MovingContainer.ts"
test -f assets/scripts/physics/ChainBodyBuilder.ts && check "ChainBodyBuilder.ts"
echo ""

# 4. 检查UI组件
echo "4. 检查UI组件..."
test -f assets/scripts/ui/LevelSelect.ts && check "LevelSelect.ts"
test -f assets/scripts/ui/FillRateBar.ts && check "FillRateBar.ts"
test -f assets/scripts/ui/ResultPanel.ts && check "ResultPanel.ts"
test -f assets/scripts/ui/TopBar.ts && check "TopBar.ts"
echo ""

# 5. 检查系统管理器
echo "5. 检查系统管理器..."
test -f assets/scripts/systems/InputManager.ts && check "InputManager.ts"
test -f assets/scripts/systems/VibrationManager.ts && check "VibrationManager.ts"
test -f assets/scripts/systems/ShareManager.ts && check "ShareManager.ts"
echo ""

# 6. 检查工具类
echo "6. 检查工具类..."
test -f assets/scripts/utils/ObjectPool.ts && check "ObjectPool.ts"
test -f assets/scripts/utils/MathUtils.ts && check "MathUtils.ts"
echo ""

# 7. 检查关卡数据
echo "7. 检查关卡数据..."
test -f assets/resources/data/levels.json && check "levels.json (resources)"

# 检查关卡数量
if [ -f assets/resources/data/levels.json ]; then
    level_count=$(grep -o '"id":' assets/resources/data/levels.json | wc -l)
    if [ "$level_count" -eq 20 ]; then
        echo -e "${GREEN}✓${NC} 关卡数量: 20"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "${YELLOW}⚠${NC} 关卡数量: $level_count (预期20)"
    fi
    total_checks=$((total_checks + 1))
fi
echo ""

# 8. 检查文档
echo "8. 检查文档..."
test -f docs/plans/2026-02-15-the-squeeze-design.md && check "设计文档"
test -f docs/plans/2026-02-15-the-squeeze-implementation.md && check "实施计划"
test -f docs/scenes-setup-guide.md && check "场景创建指南"
test -f docs/performance-optimization.md && check "性能优化指南"
test -f docs/development-guide.md && check "开发指南"
test -f README.md && check "README"
echo ""

# 9. 检查配置文件
echo "9. 检查配置文件..."
test -f project.json && check "project.json"
test -d .git && check "Git 仓库已初始化"
echo ""

# 10. 统计代码
echo "10. 代码统计..."
ts_files=$(find assets/scripts -name "*.ts" 2>/dev/null | wc -l)
total_lines=$(find assets/scripts -name "*.ts" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')

echo "脚本文件数: $ts_files"
echo "总代码行数: $total_lines"
echo ""

# 总结
echo "========================================="
echo "验证结果"
echo "========================================="
echo "通过检查: $passed_checks / $total_checks"

if [ $passed_checks -eq $total_checks ]; then
    echo -e "${GREEN}所有检查通过！项目已准备就绪。${NC}"
    exit 0
else
    echo -e "${YELLOW}部分检查未通过，请查看详情。${NC}"
    exit 1
fi
