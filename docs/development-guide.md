# 《往死里挤》开发与部署指南

> 完整的开发环境配置、场景创建、测试和发布流程

**版本**: v1.0.0
**最后更新**: 2026-02-15

---

## 一、开发环境配置

### 1.1 必需软件

| 软件 | 版本 | 下载地址 |
|------|------|----------|
| Cocos Creator | 3.8.8 | https://www.cocos.com/creator-download |
| Node.js | v16+ | https://nodejs.org/ |
| 微信开发者工具 | 最新稳定版 | https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html |
| Visual Studio Code | 最新版 | https://code.visualstudio.com/ (可选) |

### 1.2 项目配置

#### 打开项目

```bash
# 启动 Cocos Creator Dashboard
# 点击 "打开其他项目"
# 选择目录: /Users/xuefanfei/Ffcs/aiproject/game-t
```

#### 项目设置

```bash
# 菜单: 项目 → 项目设置
```

**关键配置项**:

1. **引擎版本**: Cocos Creator 3.8.8
2. **Canvas 设计分辨率**:
   - 宽度: 750
   - 高度: 1334
   - 适配策略: Fit Width
3. **物理引擎**:
   - 启用 2D 物理
   - 重力: (0, -320)

---

## 二、场景创建详细步骤

### 2.1 Launch.scene (启动场景)

#### 步骤 1: 创建场景

```
1. 文件 → 新建场景
2. 选择 Empty Scene
3. 保存为 assets/scenes/Launch.scene
```

#### 步骤 2: 节点结构

```
Launch (场景根)
└── Canvas (自动创建)
    ├── Camera (自动创建)
    ├── Background
    │   └── Sprite (背景图)
    └── LevelSelect (关卡选择容器)
        └── GridContainer (网格布局)
            └── [动态生成20个关卡按钮]
```

#### 步骤 3: 配置 Canvas

选中 Canvas 节点:
```
UITransform:
  - Content Size: 750 x 1334
  - Anchor: (0.5, 0.5)
```

#### 步骤 4: 配置 LevelSelect

1. 创建空节点 `LevelSelect`
2. 添加组件 `LevelSelect.ts`
3. 配置属性:
   - Grid Container: 拖入 GridContainer 节点
   - Level Item Prefab: 稍后创建的预制体

#### 步骤 5: 配置 GridContainer

```
1. 创建空节点 GridContainer
2. 添加组件 → Layout:
   - Type: Grid
   - Spacing X: 20
   - Spacing Y: 20
   - Cell Size: X=100, Y=100
   - Start Axis: Horizontal
   - Direction: Vertical
```

### 2.2 Game.scene (游戏主场景)

#### 步骤 1: 创建场景

```
1. 文件 → 新建场景
2. 选择 Empty Scene
3. 保存为 assets/scenes/Game.scene
```

#### 步骤 2: 节点结构

```
Game (场景根)
└── Canvas
    ├── Camera
    ├── GameManager (游戏管理器)
    │   Properties:
    │   - Level Loader: [LevelLoader节点]
    │   - Container Manager: [Container节点]
    │   - Ball Manager: [Balls节点]
    │   - Container Node: [Border节点]
    │   - Balls Node: [Balls节点]
    │   - UI Node: [UI节点]
    │
    ├── Container (容器系统)
    │   ├── Border (物理碰撞体)
    │   │   └── [自动生成碰撞体]
    │   └── Visual (视觉边框)
    │       └── Graphics (绘制边框)
    │
    ├── Balls (团子容器)
    │   └── [动态生成团子]
    │
    └── UI (UI层)
        ├── TopBar (顶部导航)
        │   ├── BackButton
        │   ├── LevelLabel
        │   ├── PauseButton
        │   └── RetryButton
        ├── FillRateBar (填充率进度条)
        │   ├── Background
        │   ├── Bar (进度条前景)
        │   └── Label (百分比文字)
        └── ResultPanel (结算弹窗)
            ├── TitleLabel
            ├── FillRateLabel
            ├── NextLevelButton
            ├── RetryButton
            └── ShareButton
```

#### 步骤 3: 配置 GameManager

```
1. 创建空节点 GameManager
2. 添加组件 → GameManager
3. 配置属性引用:
   - Level Loader: 拖入 LevelLoader 节点
   - Container Manager: 拖入 ContainerManager 节点
   - Ball Manager: 拖入 BallManager 节点
   - Container Node: 拖入 Container/Border 节点
   - Balls Node: 拖入 Balls 节点
   - UI Node: 拖入 UI 节点
```

#### 步骤 4: 配置 Container 系统

```
1. 创建 Container 空节点
   └── Border 空节点
   └── Visual 空节点

2. Border 节点:
   - 添加 PhysicsManager 组件 (可选)

3. Container 节点:
   - 添加 ContainerManager 组件
   - 配置属性:
     - Border Node: 拖入 Border 节点
     - Visual Node: 拖入 Visual 节点

4. Visual 节点:
   - 添加 Graphics 组件 (用于绘制边框)
```

#### 步骤 5: 配置 Balls 节点

```
1. 创建 Balls 空节点
2. 添加 BallManager 组件
3. 配置属性:
   - Container Node: 拖入 Container 节点
   - Ball Prefab: 稍后创建的团子预制体 (可选)
```

#### 步骤 6: 配置 UI 系统

**TopBar 配置**:
```
1. 创建 TopBar 节点
2. 添加 UITransform: ContentSize (750, 80)
3. 添加 TopBar 组件
4. 创建子节点:
   - BackButton (Button + Sprite)
   - LevelLabel (Label)
   - PauseButton (Button + Sprite)
   - RetryButton (Button + Sprite)
5. 配置 TopBar 组件属性引用
```

**FillRateBar 配置**:
```
1. 创建 FillRateBar 节点
2. 添加 UITransform: ContentSize (600, 40)
3. 添加 FillRateBar 组件
4. 创建子节点:
   - Background (Node + Sprite)
   - Bar (Node + Sprite)
   - Label (Label)
5. 配置 FillRateBar 组件属性引用
```

**ResultPanel 配置**:
```
1. 创建 ResultPanel 节点
2. 添加 UITransform: ContentSize (500, 400)
3. 添加 Sprite (背景)
4. 添加 ResultPanel 组件
5. 创建子节点并配置属性引用
```

---

## 三、预制体创建

### 3.1 Ball 预制体

```
1. 在场景中创建 Ball 节点
2. 添加 Ball 组件
3. 配置初始属性:
   - Sprite: 创建 Sprite 组件
   - RigidBody2D: 类型 Dynamic
   - CircleCollider2D: 半径 50
4. 拖入 assets/resources/prefabs/ 保存为预制体
```

### 3.2 LevelItem 预制体

```
1. 创建 LevelItem 节点
2. 添加 Button 组件
3. 添加 Sprite (背景)
4. 创建 Label 子节点 (显示关卡号)
5. 保存为预制体
```

---

## 四、测试流程

### 4.1 编辑器测试

```
1. 打开 Game.scene
2. 点击编辑器顶部 "运行" 按钮
3. 检查控制台是否有错误
4. 验证功能:
   - ✅ 场景正常加载
   - ✅ 团子可以拖拽
   - ✅ 物理碰撞正常
   - ✅ 胜利判定触发
```

### 4.2 微信开发者工具测试

```bash
# 1. 构建微信小游戏
项目 → 构建发布 → 微信小游戏

# 2. 配置构建设置
- 发布路径: ./build/wechatgame
- 远程服务器地址: (可选)

# 3. 点击 "构建"
```

```bash
# 4. 在微信开发者工具中打开
# 打开目录: build/wechatgame

# 5. 测试功能
- ✅ 真机触摸
- ✅ 震动反馈
- ✅ 分享功能
```

---

## 五、常见问题排查

### 5.1 场景加载失败

**问题**: 加载关卡时报错

**排查**:
```typescript
// 检查 levels.json 是否在 resources/data/ 目录
console.log(resources.getDir('data'));

// 检查 JSON 格式
resources.load('data/levels', JsonAsset, (err, asset) => {
    console.log('Load result:', err, asset);
});
```

### 5.2 物理碰撞不工作

**问题**: 团子穿过容器边界

**解决**:
1. 检查 RigidBody2D 类型是否为 Dynamic
2. 检查 Collider 是否添加
3. 检查物理世界是否启用

### 5.3 震动不触发

**问题**: 碰撞时没有震动

**解决**:
```typescript
// 检查平台
console.log('Platform:', sys.platform);

// 仅在微信小游戏环境支持
if (sys.platform !== sys.Platform.WECHAT_GAME) {
    console.log('Vibration only on WeChat');
}
```

---

## 六、发布检查清单

### 6.1 发布前必检

- [ ] 所有20个关卡可玩
- [ ] 场景文件已创建
- [ ] 组件属性引用已配置
- [ ] levels.json 数据完整
- [ ] 无控制台错误
- [ ] 真机测试通过
- [ ] 包体积 < 4MB

### 6.2 性能检查

- [ ] DrawCall < 20
- [ ] 稳定 60 FPS
- [ ] 内存占用合理
- [ ] 对象池正常工作

---

## 七、构建发布

### 7.1 开发版构建

```
1. 项目 → 构建发布
2. 平台: 微信小游戏
3. 勾选: Debug 模式
4. 点击 "构建"
```

### 7.2 生产版构建

```
1. 项目 → 构建发布
2. 平台: 微信小游戏
3. 勾选选项:
   - ☑️ 压缩 JSON
   - ☑️ 压缩 PNG
   - ☑️ 合并 SpriteFrame
   - ☐ Debug 模式 (不勾选)
4. 高级选项:
   - 配置 MD5 Cache
   - 配置远程服务器地址
5. 点击 "构建"
```

### 7.3 上传到微信

```bash
# 1. 在微信开发者工具中
点击 "上传" 按钮

# 2. 填写版本号和描述
版本号: 1.0.0
描述: 《往死里挤》完整版

# 3. 提交审核
登录微信公众平台 → 小程序管理 → 提交审核
```

---

## 八、后续优化建议

### 8.1 功能增强

1. **精确填充率计算**
   - 当前为简化版
   - 可使用像素级精确计算

2. **团子表情系统**
   - 正常眼睛 / X眼
   - 流汗粒子效果

3. **容器视觉特效**
   - 玻璃质感材质
   - 裂纹效果 (填充率 > 95%)

### 8.2 性能优化

1. **图集合并**
   - 合并所有团子 Sprite

2. **对象池优化**
   - 更多对象使用对象池

3. **物理调优**
   - 根据实测调整迭代次数

---

## 九、联系与支持

- **技术文档**: 见 `docs/` 目录
- **设计文档**: `docs/plans/2026-02-15-the-squeeze-design.md`
- **实施计划**: `docs/plans/2026-02-15-the-squeeze-implementation.md`

---

**文档版本**: 1.0
**最后更新**: 2026-02-15
