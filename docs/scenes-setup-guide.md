# Cocos Creator 场景创建指南

本文档说明如何在 Cocos Creator 3.8.x 编辑器中手动创建游戏所需的场景。

---

## 一、启动场景 (Launch.scene)

### 用途
启动+关卡选择界面

### 创建步骤

1. **创建新场景**
   - 在 Cocos Creator 编辑器中,点击 `文件` → `新建场景`
   - 选择 `Empty Scene` (空场景)
   - 保存为 `Launch.scene`,路径: `assets/scenes/Launch.scene`

2. **场景节点结构**
   ```
   Launch (场景根节点)
   └── Canvas
       ├── Camera
       ├── LevelSelect (关卡选择容器)
       │   └── GridContainer (网格布局容器)
       └── Background (背景节点)
   ```

3. **创建节点**

   a. **Canvas 节点** (默认已创建)
      - 选中 Canvas
      - 在右侧属性检查器中确认:
        - `UITransform` 组件:
          - Content Size: 设计分辨率(如 750x1334)

   b. **LevelSelect 节点**
      - 选中 Canvas,右键 → `创建` → `创建空节点`
      - 重命名为 `LevelSelect`
      - 添加组件 → `UITransform`:
        - 设置ContentSize 为(750, 1334)
        - 设置锚点 Anchor 为(0.5, 0.5)
      - 添加组件 → `Widget`:
        - 勾选 Top、Bottom、Left、Right 全部对齐

   c. **GridContainer 节点**
      - 选中 LevelSelect,右键 → `创建` → `创建空节点`
      - 重命名为 `GridContainer`
      - 添加组件 → `UITransform`
      - 添加组件 → `Layout`:
        - `Type`: Grid
        - `Spacing X`: 20
        - `Spacing Y`: 20
        - `Cell Size`: X=100, Y=100
        - `Start Axis`: Horizontal
        - `Direction`: Vertical
        - `Horizontal Direction`: Left To Right

   d. **挂载脚本**
      - 选中 LevelSelect 节点
      - 在右侧属性检查器中,点击 `添加组件` → `自定义脚本` → `LevelSelect`
      - 设置属性:
        - `Grid Container`: 拖拽 GridContainer 节点到此属性框

4. **保存场景**
   - `Ctrl+S` / `Cmd+S` 保存场景

---

## 二、游戏主场景 (Game.scene)

### 用途
游戏主要玩法场景,所有20关共用此场景

### 创建步骤

1. **创建新场景**
   - 在 Cocos Creator 编辑器中,点击 `文件` → `新建场景`
   - 选择 `Empty Scene` (空场景)
   - 保存为 `Game.scene`,路径: `assets/scenes/Game.scene`

2. **场景节点结构**
   ```
   Game (场景根节点)
   └── Canvas
       ├── Camera
       ├── GameManager (游戏管理器)
       ├── Container (容器节点)
       │   └── Border (边框节点)
       ├── Balls (团子容器节点)
       └── UI (UI层节点)
           ├── TopBar (顶部导航栏)
           ├── FillRateBar (填充率进度条)
           └── ResultPanel (结算弹窗)
   ```

3. **创建节点**

   a. **Canvas 节点** (默认已创建)
      - 设置 UITransform 的 Content Size 为设计分辨率(750x1334)

   b. **GameManager 节点**
      - 选中 Canvas,右键 → `创建` → `创建空节点`
      - 重命名为 `GameManager`
      - 添加组件 → `自定义脚本` → `GameManager`
      - 设置属性:
        - `Container Node`: 拖拽 Container 节点到此(稍后创建)
        - `Balls Node`: 拖拽 Balls 节点到此(稍后创建)
        - `Ui Node`: 拖拽 UI 节点到此(稍后创建)

   c. **Container 节点**
      - 选中 Canvas,右键 → `创建` → `创建空节点`
      - 重命名为 `Container`
      - 添加组件 → `UITransform`
      - 设置位置 Position 为(0, -100, 0)
      - 创建子节点 `Border`:
        - 选中 Container,右键 → `创建` → `创建空节点`
        - 重命名为 `Border`

   d. **Balls 节点**
      - 选中 Canvas,右键 → `创建` → `创建空节点`
      - 重命名为 `Balls`
      - 添加组件 → `UITransform`

   e. **UI 节点及子节点**
      - 选中 Canvas,右键 → `创建` → `创建空节点`
      - 重命名为 `UI`
      - 添加组件 → `UITransform`

      创建子节点:

      i. **TopBar (顶部导航栏)**
         - 选中 UI,右键 → `创建` → `UI节点` → `Node`
         - 重命名为 `TopBar`
         - 添加组件 → `Sprite` (背景)
         - 添加子节点:
           - `BackButton` (返回按钮)
           - `LevelLabel` (关卡号显示)
           - `PauseButton` (暂停按钮)
           - `RetryButton` (重玩按钮)

      ii. **FillRateBar (填充率进度条)**
          - 选中 UI,右键 → `创建` → `UI节点` → `Node`
          - 重命名为 `FillRateBar`
          - 添加组件 → `UITransform`
          - 添加组件 → `自定义脚本` → `FillRateBar`
          - 创建子节点:
            - `Background` (进度条背景)
            - `Bar` (进度条前景)
            - `Text` (百分比文字)

      iii. **ResultPanel (结算弹窗)**
          - 选中 UI,右键 → `创建` → `UI节点` → `Node`
          - 重命名为 `ResultPanel`
          - 添加组件 → `UITransform`
          - 添加组件 → `Sprite` (弹窗背景)
          - 添加组件 → `自定义脚本` → `ResultPanel`
          - 创建子节点:
            - `TitleLabel` (评价标题)
            - `FillRateLabel` (填充率显示)
            - `NextLevelButton` (下一关按钮)
            - `RetryButton` (重试按钮)
            - `ShareButton` (分享按钮)

4. **保存场景**
   - `Ctrl+S` / `Cmd+S` 保存场景

---

## 三、设置项目启动场景

1. 打开 `project.json`
2. 确认或添加:
   ```json
   {
     "startScene": "db://assets/scenes/Launch.scene"
   }
   ```
3. 或者在编辑器中:
   - 在 `资源管理器` 面板中右键 `Launch.scene`
   - 选择 `将该场景设为启动场景`

---

## 四、场景预制体 (Prefabs)

以下预制体需要单独创建,可在场景创建后制作:

### 1. Ball Prefab (团子预制体)
- 创建空节点
- 添加 `Sprite` 组件
- 添加 `RigidBody2D` 组件
- 添加 `CircleCollider2D` 组件
- 添加 `Ball` 脚本
- 保存为预制体到 `assets/resources/prefabs/Ball.prefab`

### 2. LevelItem Prefab (关卡选择项)
- 创建空节点
- 添加 `Button` 组件
- 添加 `Label` 子节点(显示关卡号)
- 保存为预制体到 `assets/resources/prefabs/LevelItem.prefab`

---

## 五、验证场景

创建完成后,验证:

1. ✅ `Launch.scene` 能正常打开
2. ✅ `Game.scene` 能正常打开
3. ✅ 场景节点结构完整
4. ✅ 脚本组件挂载正确
5. ✅ 没有报错或丢失资源

---

## 六、后续操作

场景创建完成后,即可运行代码逻辑:
- 场景只是"舞台"
- 游戏逻辑由 TypeScript 脚本控制
- 容器形状、团子等都由代码动态生成

创建完场景后,请返回继续执行实施计划的后续任务。
