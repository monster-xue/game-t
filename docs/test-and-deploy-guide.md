# 《往死里挤》测试与发布指南

> 完整的项目打开、测试、构建和发布流程

**版本**: v1.0.0
**最后更新**: 2026-02-18

---

## 一、在 Cocos Creator 3.8.8 中打开项目

### 步骤 1：安装 Cocos Creator 3.8.8

1. 访问：https://www.cocos.com/creator-download
2. 下载 **Cocos Creator 3.8.8**
3. 安装并启动

### 步骤 2：打开项目

1. 启动 **Cocos Creator Dashboard**
2. 点击 **"打开其他项目"**
3. 选择目录：`/Users/xuefanfei/Ffcs/aiproject/game-t`
4. 等待项目加载完成

### 步骤 3：验证项目结构

打开后，你应该能看到：

```
assets/
├── data/
│   └── levels.json          ✅ 20个关卡配置
├── scenes/
│   ├── Launch.scene         ✅ 启动场景
│   └── Game.scene           ✅ 游戏场景
├── scripts/
│   ├── core/                ✅ 8个核心文件
│   ├── physics/             ✅ 物理相关
│   ├── systems/             ✅ 游戏系统
│   ├── ui/                  ✅ UI组件
│   └── utils/               ✅ 工具类
└── resources/               ✅ 资源目录
```

---

## 二、编辑器测试

### 2.1 场景检查

**打开 Launch.scene**：
- 检查 Canvas 节点是否存在
- 检查 Camera 节点配置
- 检查 LevelSelect 节点

**打开 Game.scene**：
- 检查 Canvas 节点
- 检查 Camera 配置
- 检查 GameManager 节点

### 2.2 代码编译检查

1. 点击编辑器顶部菜单：**项目 → 构建发布**
2. 查看控制台是否有编译错误
3. 检查 TypeScript 类型错误

### 2.3 物理配置

**项目设置**：
1. 菜单：**项目 → 项目设置**
2. 选择 **"物理"** 选项卡
3. 确认配置：
   - 2D 物理引擎：已启用
   - 重力：`(0, -320)`
   - 步长：`1/60`

---

## 三、运行预览

### 3.1 浏览器预览

1. 打开 **Launch.scene** 或 **Game.scene**
2. 点击编辑器顶部的 **▶️ 预览** 按钮
3. 游戏将在默认浏览器中打开
4. URL 格式：`http://localhost:7456/`

### 3.2 功能测试清单

#### 启动场景（Launch.scene）

- [ ] 场景正常加载
- [ ] 显示20个关卡按钮
- [ ] 点击关卡按钮跳转到 Game.scene

#### 游戏场景（Game.scene）

- [ ] 场景正常加载
- [ ] 容器正确显示（根据关卡配置）
- [ ] 团子正确生成（根据关卡配置）
- [ ] 可以拖动团子
- [ ] 团子被容器挤压时变形
- [ ] 填充率进度条实时更新
- [ ] 达到胜利条件时弹出结算面板
- [ ] "下一关"按钮正常工作
- [ ] "重试"按钮正常工作
- [ ] "分享"按钮正常工作

#### 特殊关卡

- [ ] **第18关**：容器移动（X轴振荡）
- [ ] **第20关**：长条团子（5段链式刚体）

---

## 四、构建发布

### 4.1 构建为微信小游戏

**步骤**：

1. 菜单：**项目 → 构建发布**
2. 配置：
   - **平台**：微信小游戏
   - **游戏名称**：往死里挤
   - **游戏ID**：填写你的微信小游戏 AppID
   - **游戏类型**：小游戏
3. 点击 **"构建"**
4. 构建完成后，点击 **"打开构建文件夹"**

**输出目录**：
```
build/wechatgame/
```

### 4.2 使用微信开发者工具

1. 打开 **微信开发者工具**
2. 导入项目：选择 `build/wechatgame/` 目录
3. 填写你的 AppID
4. 点击 **"编译"**
5. 测试游戏功能

### 4.3 构建为 Web Mobile

**步骤**：

1. 菜单：**项目 → 构建发布**
2. 配置：
   - **平台**：Web Mobile
   - **游戏名称**：The Squeeze
3. 点击 **"构建"**
4. 构建完成后，输出目录：`build/web-mobile/`

**部署到服务器**：

```bash
# 部署到任何静态文件服务器
cp -r build/web-mobile/* /path/to/web/server/
```

---

## 五、GitHub Pages 部署（可选）

### 5.1 启用 GitHub Pages

1. 访问：https://github.com/monster-xue/game-t/settings/pages
2. Source 选择：**Deploy from a branch**
3. Branch 选择：**master** → **/root**
4. 点击 **Save**

### 5.2 使用 gh-pages 分支

```bash
# 1. 构建 Web Mobile 版本
# 在 Cocos Creator 中构建 Web Mobile

# 2. 创建 gh-pages 分支
cd build/web-mobile
git init
git checkout -b gh-pages
git add .
git commit -m "Deploy to GitHub Pages"

# 3. 推送到 GitHub
git remote add origin git@github.com:monster-xue/game-t.git
git push origin gh-pages

# 4. 在 GitHub 设置中选择 gh-pages 分支
```

访问：https://monster-xue.github.io/game-t/

---

## 六、发布检查清单

### 代码质量

- [ ] 无 TypeScript 编译错误
- [ ] 无运行时错误（查看控制台）
- [ ] 所有20个关卡可玩
- [ ] 物理模拟稳定
- [ ] 填充率计算准确

### 性能

- [ ] 帧率稳定在 60 FPS
- [ ] DrawCall < 20
- [ ] 内存占用合理
- [ ] 加载时间 < 3秒

### 用户体验

- [ ] UI 响应流畅
- [ ] 关卡难度曲线合理
- [ ] 胜利反馈清晰
- [ ] 震动反馈正常

### 平台特定

**微信小游戏**：
- [ ] 分享功能正常
- [ ] 震动 API 正常
- [ ] 通过微信审核
- [ ] 包大小符合要求

**Web Mobile**：
- [ ] 移动端触摸正常
- [ ] 适配不同屏幕尺寸
- [ ] 浏览器兼容性测试

---

## 七、常见问题

### Q1: 打开项目时报错"编辑器版本不存在"

**A**: 确保：
- 已安装 Cocos Creator 3.8.8
- project.json 中版本号是 "3.8.8"

### Q2: 场景打开后没有内容

**A**: 这是正常的。需要：
1. 在编辑器中手动创建节点
2. 或者导入预制体资源
3. 参考文档：`docs/scenes-setup-guide.md`

### Q3: 编译时找不到模块

**A**: 检查：
- tsconfig.json 配置是否正确
- 路径别名 `@/*` 是否配置
- 重启编辑器

### Q4: 物理模拟不生效

**A**:
1. 检查项目设置中物理是否启用
2. 确认重力设置：`(0, -320)`
3. 检查物理碰撞体组件是否添加

---

## 八、下一步优化

### 可选功能

1. **音频系统**
   - 添加背景音乐
   - 添加音效（挤压、碰撞、胜利）

2. **视觉效果**
   - 容器玻璃质感
   - 团子表情系统
   - 粒子特效

3. **关卡编辑器**
   - 可视化关卡编辑器
   - 实时预览

4. **数据分析**
   - 关卡完成率统计
   - 用户行为分析

---

## 九、技术支持

- **Cocos Creator 文档**: https://docs.cocos.com/creator/3.8/
- **TypeScript 文档**: https://www.typescriptlang.org/docs/
- **Box2D 文档**: http://box2d.org/documentation/

---

祝你发布顺利！🎉
