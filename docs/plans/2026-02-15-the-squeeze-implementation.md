# 《往死里挤》微信小游戏实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 构建一款基于物理挤压的20关益智游戏，玩家需要将软萌团子拖进各种形状容器，通过Box2D物理引擎和视觉形变实现Q弹手感。

**架构:** 采用单一场景复用策略（Game.scene），通过JSON配置加载20个关卡内容。核心模块包括PhysicsManager（Box2D）、BallManager（团子管理+视觉形变）、ContainerManager（动态容器生成）。物理层使用刚体+视觉形变方案实现软体效果。

**技术栈:** Cocos Creator 3.8.x、TypeScript 5.x、Box2D物理引擎、微信小游戏API

---

## 阶段1: 项目初始化与基础框架

### Task 1.1: 创建 Cocos Creator 项目

**目标:** 初始化 Cocos Creator 项目并配置基础设置

**步骤:**

**Step 1: 使用 Cocos Creator 3.8.x 创建新项目**

```bash
# 通过 Cocos Creator Dashboard 创建项目
# 项目名称: game-t
# 项目路径: /Users/xuefanfei/Ffcs/aiproject/game-t
# 模板: Empty (TypeScript)
```

**Step 2: 配置项目设置**

打开 `project.json`，确认以下配置：

```json
{
  "version": "3.8.0",
  "name": "game-t",
  "uuid": "game-t-uuid",
  "type": "3d"
}
```

**Step 3: 创建目录结构**

```bash
cd /Users/xuefanfei/Ffcs/aiproject/game-t/assets
mkdir -p scenes scripts/core scripts/physics scripts/ui scripts/systems scripts/data scripts/utils resources/textures resources/particles
```

**Step 4: 提交初始项目**

```bash
cd /Users/xuefanfei/Ffcs/aiproject/game-t
git init
git add .
git commit -m "feat: initialize Cocos Creator project"
```

---

### Task 1.2: 创建全局常量配置

**目标:** 定义游戏的全局物理参数和配置常量

**文件:**
- Create: `assets/scripts/core/GameConstants.ts`

**Step 1: 创建常量文件**

```typescript
// assets/scripts/core/GameConstants.ts

export const GAME_CONFIG = {
    // 物理引擎配置
    PHYSICS: {
        GRAVITY: { x: 0, y: -320 },
        STEP: 1/60,
        VELOCITY_ITERATIONS: 8,
        POSITION_ITERATIONS: 3
    },

    // 团子物理参数
    BALL: {
        DENSITY: 1.0,
        FRICTION: 0.1,
        RESTITUTION: 0.4,
        LINEAR_DAMPING: 0.5,
        ANGULAR_DAMPING: 0.5,
        MAX_SQUEEZE: 0.3,        // 最大形变30%
        SQUEEZE_DECAY: 0.95,     // 形变恢复速度
        DRAG_SCALE: 1.2          // 拖拽时放大倍数
    },

    // 容器配置
    CONTAINER: {
        BORDER_THICKNESS: 10,
        BUFFER_ZONE: 0.8         // 80%体积进入即算有效
    },

    // 胜利条件
    WIN: {
        STABLE_TIME: 3.0,        // 3秒稳定时间
        FILL_RATE_THRESHOLD: 0.8 // 80%填充率
    },

    // 震动阈值
    VIBRATION: {
        COLLISION_THRESHOLD: 200, // 碰撞速度阈值
        SQUEEZE_THRESHOLD: 0.4    // 挤压形变阈值
    },

    // 团子颜色（马卡龙色系）
    COLORS: [
        '#FFB5C5', // 浅粉
        '#FFDAB9', // 桃色
        '#E6E6FA', // 淡紫
        '#B0E0E6', // 粉蓝
        '#FFA07A', // 浅橙
        '#98FB98', // 浅绿
        '#DDA0DD', // 梅红
        '#F0E68C'  // 卡其
    ]
};

// 游戏状态枚举
export enum GameState {
    MENU = 'menu',
    PLAYING = 'playing',
    PAUSED = 'paused',
    WIN = 'win',
    LOSE = 'lose'
}
```

**Step 2: 提交**

```bash
git add assets/scripts/core/GameConstants.ts
git commit -m "feat: add game constants configuration"
```

---

### Task 1.3: 创建 GameManager 核心控制器

**目标:** 实现游戏主控制器，管理游戏状态和关卡流程

**文件:**
- Create: `assets/scripts/core/GameManager.ts`

**Step 1: 创建 GameManager 脚本**

```typescript
// assets/scripts/core/GameManager.ts

import { _decorator, Component, Node } from 'cc';
import { GameState, GAME_CONFIG } from './GameConstants';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    containerNode: Node = null;

    @property(Node)
    ballsNode: Node = null;

    @property(Node)
    uiNode: Node = null;

    private static _instance: GameManager;
    private _currentLevel: number = 1;
    private _gameState: GameState = GameState.MENU;
    private _stableTimer: number = 0;

    public static get instance(): GameManager {
        return GameManager._instance;
    }

    onLoad() {
        if (GameManager._instance) {
            this.destroy();
            return;
        }
        GameManager._instance = this;
    }

    start() {
        this.changeState(GameState.MENU);
    }

    update(deltaTime: number) {
        if (this._gameState === GameState.PLAYING) {
            this.updateGameLogic(deltaTime);
        }
    }

    private updateGameLogic(dt: number) {
        // 游戏主循环逻辑，后续实现
    }

    public changeState(state: GameState) {
        this._gameState = state;
    }

    public loadLevel(levelId: number) {
        this._currentLevel = levelId;
        this._stableTimer = 0;
        this.changeState(GameState.PLAYING);

        // TODO: 调用 LevelLoader 加载关卡
    }

    public get currentLevel(): number {
        return this._currentLevel;
    }

    public get gameState(): GameState {
        return this._gameState;
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/core/GameManager.ts
git commit -m "feat: add GameManager core controller"
```

---

### Task 1.4: 创建 Launch 场景（关卡选择）

**目标:** 创建启动场景和关卡选择界面

**文件:**
- Create: `assets/scenes/Launch.scene`
- Create: `assets/scripts/ui/LevelSelect.ts`

**Step 1: 在 Cocos Creator 中创建 Launch 场景**

通过编辑器操作：
1. 新建场景 `Launch`
2. 添加 Canvas 节点
3. 添加关卡选择 UI（ScrollView 或 Grid）
4. 保存场景

**Step 2: 创建 LevelSelect 脚本**

```typescript
// assets/scripts/ui/LevelSelect.ts

import { _decorator, Component, Node, Button, Label, Prefab, instantiate } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('LevelSelect')
export class LevelSelect extends Component {
    @property(Prefab)
    levelItemPrefab: Prefab = null;

    @property(Node)
    gridContainer: Node = null;

    private readonly TOTAL_LEVELS = 20;

    start() {
        this.generateLevelItems();
    }

    private generateLevelItems() {
        for (let i = 1; i <= this.TOTAL_LEVELS; i++) {
            const item = instantiate(this.levelItemPrefab);
            item.setParent(this.gridContainer);

            const label = item.getComponentInChildren(Label);
            if (label) {
                label.string = i.toString();
            }

            const button = item.getComponent(Button);
            if (button) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.onLevelSelected(i);
                });
            }
        }
    }

    private onLevelSelected(levelId: number) {
        GameManager.instance.loadLevel(levelId);
    }
}
```

**Step 3: 提交**

```bash
git add assets/scenes/Launch.scene assets/scripts/ui/LevelSelect.ts
git commit -m "feat: add Launch scene and level selection UI"
```

---

### Task 1.5: 创建 Game 主场景

**目标:** 创建游戏主场景的基础结构

**文件:**
- Create: `assets/scenes/Game.scene`

**Step 1: 在 Cocos Creator 中创建 Game 场景**

通过编辑器操作：
1. 新建场景 `Game`
2. 添加 Canvas 节点
3. 添加以下子节点：
   - `GameManager` (挂载 GameManager 脚本)
   - `Container` (容器节点)
   - `Balls` (团子容器节点)
   - `UI` (UI层节点)
4. 保存场景

**Step 2: 提交**

```bash
git add assets/scenes/Game.scene
git commit -m "feat: add Game scene base structure"
```

---

## 阶段2: 物理系统实现

### Task 2.1: 创建 PhysicsManager 物理管理器

**目标:** 封装 Box2D 物理引擎的初始化和管理

**文件:**
- Create: `assets/scripts/core/PhysicsManager.ts`

**Step 1: 创建 PhysicsManager 脚本**

```typescript
// assets/scripts/core/PhysicsManager.ts

import { _decorator, Component, Node, Vec2, RigidBody2D, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GAME_CONFIG } from './GameConstants';

const { ccclass, property } = _decorator;

export interface PhysicsConfig {
    gravity: Vec2;
    step: number;
    velocityIterations: number;
    positionIterations: number;
}

export interface CollisionCallback {
    onBeginContact?: (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) => void;
    onEndContact?: (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) => void;
}

@ccclass('PhysicsManager')
export class PhysicsManager extends Component {
    private static _instance: PhysicsManager;
    private _accumulatedTime: number = 0;
    private _collisionCallbacks: Map<string, CollisionCallback> = new Map();

    public static get instance(): PhysicsManager {
        return PhysicsManager._instance;
    }

    onLoad() {
        if (PhysicsManager._instance) {
            this.destroy();
            return;
        }
        PhysicsManager._instance = this;

        this.setupPhysicsWorld();
    }

    private setupPhysicsWorld() {
        const physicsWorld = this.node.scene.getComponent('cc.PhysicsWorld');
        if (physicsWorld) {
            physicsWorld.gravity = new Vec2(
                GAME_CONFIG.PHYSICS.GRAVITY.x,
                GAME_CONFIG.PHYSICS.GRAVITY.y
            );
        }
    }

    update(deltaTime: number) {
        // 物理步进由 Cocos 自动处理
    }

    public registerCollisionCallback(nodeUuid: string, callback: CollisionCallback) {
        this._collisionCallbacks.set(nodeUuid, callback);
    }

    public unregisterCollisionCallback(nodeUuid: string) {
        this._collisionCallbacks.delete(nodeUuid);
    }

    public getBallVelocity(body: RigidBody2D): Vec2 {
        return body.linearVelocity;
    }

    public getBallSpeed(body: RigidBody2D): number {
        return body.linearVelocity.length();
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/core/PhysicsManager.ts
git commit -m "feat: add PhysicsManager for Box2D wrapper"
```

---

### Task 2.2: 创建 Ball 团子组件

**目标:** 实现单个团子的刚体物理和基础渲染

**文件:**
- Create: `assets/scripts/core/Ball.ts`

**Step 1: 创建 Ball 组件**

```typescript
// assets/scripts/core/Ball.ts

import { _decorator, Component, Node, Sprite, Color, UITransform, Vec2, RigidBody2D, CircleCollider2D } from 'cc';
import { GAME_CONFIG } from './GameConstants';

const { ccclass, property } = _decorator;

export interface BallConfig {
    radius: number;
    color: string;
    position: Vec2;
}

@ccclass('Ball')
export class Ball extends Component {
    @property(Sprite)
    sprite: Sprite = null;

    @property(RigidBody2D)
    rigidBody: RigidBody2D = null;

    @property(CircleCollider2D)
    collider: CircleCollider2D = null;

    private _config: BallConfig;
    private _initialScale: Vec2 = new Vec2(1, 1);
    private _isDragging: boolean = false;

    onLoad() {
        if (!this.rigidBody) {
            this.rigidBody = this.node.addComponent(RigidBody2D);
        }
        if (!this.collider) {
            this.collider = this.node.addComponent(CircleCollider2D);
        }
        if (!this.sprite) {
            this.sprite = this.node.addComponent(Sprite);
        }

        this._initialScale = new Vec2(this.node.scale.x, this.node.scale.y);
    }

    public init(config: BallConfig): void {
        this._config = config;

        // 设置刚体参数
        this.rigidBody.type = RigidBody2D.Type.Dynamic;
        this.rigidBody.gravityScale = 1;
        this.rigidBody.linearDamping = GAME_CONFIG.BALL.LINEAR_DAMPING;
        this.rigidBody.angularDamping = GAME_CONFIG.BALL.ANGULAR_DAMPING;

        // 设置碰撞体
        this.collider.radius = config.radius;
        this.collider.density = GAME_CONFIG.BALL.DENSITY;
        this.collider.friction = GAME_CONFIG.BALL.FRICTION;
        this.collider.restitution = GAME_CONFIG.BALL.RESTITUTION;
        this.collider.sensor = false;

        // 设置节点大小
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(config.radius * 2, config.radius * 2);
        }

        // 设置位置
        this.node.setPosition(config.position.x, config.position.y);

        // 设置颜色
        const color = new Color();
        Color.fromHEX(color, config.color);
        this.sprite.color = color;
    }

    public get config(): BallConfig {
        return this._config;
    }

    public get radius(): number {
        return this._config?.radius || 0;
    }

    public set isDragging(value: boolean) {
        this._isDragging = value;

        // 拖拽时放大
        const scale = value ? GAME_CONFIG.BALL.DRAG_SCALE : 1;
        this.node.setScale(scale, scale, 1);

        // 拖拽时禁用物理模拟
        this.rigidBody.type = value ? RigidBody2D.Type.Kinematic : RigidBody2D.Type.Dynamic;
    }

    public get isDragging(): boolean {
        return this._isDragging;
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/core/Ball.ts
git commit -m "feat: add Ball component with rigid body physics"
```

---

### Task 2.3: 创建 BallManager 团子管理器

**目标:** 管理团子的创建、销毁、对象池和视觉形变更新

**文件:**
- Create: `assets/scripts/core/BallManager.ts`

**Step 1: 创建 BallManager 脚本**

```typescript
// assets/scripts/core/BallManager.ts

import { _decorator, Component, Node, instantiate, Prefab, Vec2 } from 'cc';
import { Ball, BallConfig } from './Ball';
import { PhysicsManager } from './PhysicsManager';
import { GAME_CONFIG } from './GameConstants';

const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    @property(Prefab)
    ballPrefab: Prefab = null;

    @property(Node)
    containerNode: Node = null;

    private _balls: Ball[] = [];
    private _ballPool: Node[] = [];

    public createBall(config: BallConfig): Ball {
        let ballNode: Node;

        // 从对象池获取或创建新节点
        if (this._ballPool.length > 0) {
            ballNode = this._ballPool.pop()!;
        } else {
            if (this.ballPrefab) {
                ballNode = instantiate(this.ballPrefab);
            } else {
                ballNode = new Node('Ball');
                ballNode.addComponent(Ball);
            }
        }

        ballNode.setParent(this.containerNode);
        const ball = ballNode.getComponent(Ball);
        ball.init(config);

        this._balls.push(ball);
        return ball;
    }

    public destroyBall(ball: Ball): void {
        const index = this._balls.indexOf(ball);
        if (index !== -1) {
            this._balls.splice(index, 1);
            ball.node.setParent(null);
            this._ballPool.push(ball.node);
        }
    }

    public clearBalls(): void {
        for (const ball of this._balls) {
            ball.node.setParent(null);
            this._ballPool.push(ball.node);
        }
        this._balls = [];
    }

    public getBalls(): Ball[] {
        return this._balls;
    }

    public getBallCount(): number {
        return this._balls.length;
    }

    update(deltaTime: number) {
        this.updateDeformations(deltaTime);
    }

    private updateDeformations(dt: number): void {
        for (const ball of this._balls) {
            if (ball.isDragging) continue;

            const rigidBody = ball.node.getComponent('cc.RigidBody2D') as any;
            if (!rigidBody) continue;

            const velocity = PhysicsManager.instance.getBallVelocity(rigidBody);
            const speed = PhysicsManager.instance.getBallSpeed(rigidBody);

            // 计算形变因子
            const squashFactor = Math.min(speed / 500, GAME_CONFIG.BALL.MAX_SQUEEZE);

            // 应用形变（沿运动方向拉伸，垂直方向压缩）
            if (speed > 10) {
                const angle = Math.atan2(velocity.y, velocity.x);
                const scaleX = 1 + squashFactor;
                const scaleY = 1 - squashFactor * 0.5;

                ball.node.setScale(scaleX, scaleY, 1);
                ball.node.angle = angle * (180 / Math.PI);
            } else {
                // 恢复原始形状
                const currentScale = ball.node.scale;
                const lerpFactor = 1 - GAME_CONFIG.BALL.SQUEEZE_DECAY;
                ball.node.setScale(
                    this.lerp(currentScale.x, 1, lerpFactor),
                    this.lerp(currentScale.y, 1, lerpFactor),
                    1
                );
                ball.node.angle = this.lerp(ball.node.angle, 0, lerpFactor);
            }
        }
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/core/BallManager.ts
git commit -m "feat: add BallManager with object pool and deformation"
```

---

### Task 2.4: 实现 InputManager 触摸输入处理

**目标:** 处理团子的拖拽操作

**文件:**
- Create: `assets/scripts/systems/InputManager.ts`

**Step 1: 创建 InputManager 脚本**

```typescript
// assets/scripts/systems/InputManager.ts

import { _decorator, Component, Node, input, Input, EventTouch, Vec3, Camera } from 'cc';
import { Ball } from '../core/Ball';
import { BallManager } from '../core/BallManager';
import { RigidBody2D } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('InputManager')
export class InputManager extends Component {
    @property(Camera)
    uiCamera: Camera = null;

    @property(BallManager)
    ballManager: BallManager = null;

    private _draggedBall: Ball = null;
    private _dragOffset: Vec3 = new Vec3();

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        const touchPos = this.getTouchWorldPosition(event);

        // 检测是否点击了团子
        const balls = this.ballManager.getBalls();
        for (const ball of balls) {
            const ballPos = ball.node.worldPosition;
            const distance = Vec3.distance(touchPos, ballPos);

            if (distance <= ball.radius) {
                this.startDragging(ball, touchPos);
                break;
            }
        }
    }

    private onTouchMove(event: EventTouch) {
        if (!this._draggedBall) return;

        const touchPos = this.getTouchWorldPosition(event);
        const newPos = new Vec3(
            touchPos.x - this._dragOffset.x,
            touchPos.y - this._dragOffset.y,
            0
        );

        this._draggedBall.node.worldPosition = newPos;
    }

    private onTouchEnd(event: EventTouch) {
        if (this._draggedBall) {
            this.stopDragging();
        }
    }

    private startDragging(ball: Ball, touchPos: Vec3) {
        this._draggedBall = ball;
        this._draggedBall.isDragging = true;

        const ballPos = ball.node.worldPosition;
        Vec3.subtract(this._dragOffset, touchPos, ballPos);
    }

    private stopDragging() {
        if (this._draggedBall) {
            this._draggedBall.isDragging = false;
            this._draggedBall = null;
        }
    }

    private getTouchWorldPosition(event: EventTouch): Vec3 {
        const pos = event.getUILocation();
        const uiPos = new Vec3(pos.x, pos.y, 0);

        if (this.uiCamera) {
            this.uiCamera.convertToUINode(uiPos, this.node, uiPos);
        }

        return uiPos;
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/systems/InputManager.ts
git commit -m "feat: add InputManager for ball drag handling"
```

---

## 阶段3: 容器系统与关卡加载

### Task 3.1: 创建关卡数据 JSON 文件

**目标:** 定义前3关的配置数据

**文件:**
- Create: `assets/scripts/data/levels.json`

**Step 1: 创建 levels.json**

```json
{
  "version": "1.0",
  "levels": [
    {
      "id": 1,
      "name": "初体验",
      "container": {
        "type": "polygon",
        "vertices": [
          {"x": -150, "y": -150},
          {"x": 150, "y": -150},
          {"x": 150, "y": 150},
          {"x": -150, "y": 150}
        ]
      },
      "balls": [
        {
          "radius": 80,
          "color": "#FFB5C5",
          "position": {"x": 0, "y": 300}
        }
      ],
      "winCondition": {
        "fillRate": 0.8,
        "stableTime": 3.0
      }
    },
    {
      "id": 2,
      "name": "双球挤挤",
      "container": {
        "type": "circle",
        "radius": 120,
        "center": {"x": 0, "y": 0}
      },
      "balls": [
        {
          "radius": 50,
          "color": "#FFB5C5",
          "position": {"x": -40, "y": 300}
        },
        {
          "radius": 50,
          "color": "#FFDAB9",
          "position": {"x": 40, "y": 300}
        }
      ],
      "winCondition": {
        "fillRate": 0.85,
        "stableTime": 3.0
      }
    },
    {
      "id": 3,
      "name": "横排三杰",
      "container": {
        "type": "polygon",
        "vertices": [
          {"x": -250, "y": -80},
          {"x": 250, "y": -80},
          {"x": 250, "y": 80},
          {"x": -250, "y": 80}
        ]
      },
      "balls": [
        {
          "radius": 50,
          "color": "#FFB5C5",
          "position": {"x": -60, "y": 300}
        },
        {
          "radius": 50,
          "color": "#FFDAB9",
          "position": {"x": 0, "y": 300}
        },
        {
          "radius": 50,
          "color": "#E6E6FA",
          "position": {"x": 60, "y": 300}
        }
      ],
      "winCondition": {
        "fillRate": 0.85,
        "stableTime": 3.0
      }
    }
  ]
}
```

**Step 2: 提交**

```bash
git add assets/scripts/data/levels.json
git commit -m "feat: add level data for first 3 levels"
```

---

### Task 3.2: 创建 ContainerManager 容器管理器

**目标:** 根据JSON配置动态生成容器碰撞体

**文件:**
- Create: `assets/scripts/core/ContainerManager.ts`

**Step 1: 创建 ContainerManager 脚本**

```typescript
// assets/scripts/core/ContainerManager.ts

import { _decorator, Component, Node, Vec2, Vec3, PolygonCollider2D, RigidBody2D, UITransform } from 'cc';

const { ccclass, property } = _decorator;

export interface ContainerConfig {
    type: 'polygon' | 'circle' | 'multi';
    vertices?: Array<{x: number, y: number}>;
    radius?: number;
    center?: {x: number, y: number};
    shapes?: any[];
}

@ccclass('ContainerManager')
export class ContainerManager extends Component {
    @property(Node)
    borderNode: Node = null;

    private _containerConfig: ContainerConfig;

    public init(config: ContainerConfig): void {
        this._containerConfig = config;

        // 清除旧的碰撞体
        this.removeColliders();

        // 根据类型创建碰撞体
        switch (config.type) {
            case 'polygon':
                this.createPolygonContainer(config.vertices);
                break;
            case 'circle':
                this.createCircleContainer(config.radius, config.center);
                break;
            case 'multi':
                this.createMultiContainer(config.shapes);
                break;
        }
    }

    private createPolygonContainer(vertices: Array<{x: number, y: number}>): void {
        const points = vertices.map(v => new Vec2(v.x, v.y));

        // 创建刚体
        const rigidBody = this.borderNode.addComponent(RigidBody2D);
        rigidBody.type = RigidBody2D.Type.Static;

        // 创建多边形碰撞体
        const collider = this.borderNode.addComponent(PolygonCollider2D);
        collider.points = points;
        collider.restitution = 0.3;
        collider.friction = 0.5;

        // 创建可视化边框
        this.createBorderVisual(vertices);
    }

    private createCircleContainer(radius: number, center: {x: number, y: number}): void {
        const segments = 32;
        const points: Vec2[] = [];

        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new Vec2(
                Math.cos(angle) * radius + center.x,
                Math.sin(angle) * radius + center.y
            ));
        }

        this.createPolygonContainer(
            points.map(p => ({ x: p.x, y: p.y }))
        );
    }

    private createMultiContainer(shapes: any[]): void {
        // TODO: 实现多形状容器
    }

    private createBorderVisual(vertices: Array<{x: number, y: number}>): void {
        // TODO: 使用Graphics或Sprite绘制边框
    }

    private removeColliders(): void {
        const colliders = this.borderNode.getComponents(PolygonCollider2D);
        for (const collider of colliders) {
            collider.destroy();
        }

        const rigidBodies = this.borderNode.getComponents(RigidBody2D);
        for (const rb of rigidBodies) {
            rb.destroy();
        }
    }

    public checkBallsInside(balls: Node[]): boolean {
        // TODO: 实现团子是否在容器内的检测
        return true;
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/core/ContainerManager.ts
git commit -m "feat: add ContainerManager for dynamic collision generation"
```

---

### Task 3.3: 创建 LevelLoader 关卡加载器

**目标:** 解析JSON并初始化关卡

**文件:**
- Create: `assets/scripts/core/LevelLoader.ts`

**Step 1: 创建 LevelLoader 脚本**

```typescript
// assets/scripts/core/LevelLoader.ts

import { _decorator, Component, Node, resources, JsonAsset } from 'cc';
import { BallManager } from './BallManager';
import { ContainerManager, ContainerConfig } from './ContainerManager';
import { Ball, BallConfig } from './Ball';

const { ccclass, property } = _decorator;

export interface LevelConfig {
    id: number;
    name: string;
    container: ContainerConfig;
    balls: BallConfig[];
    winCondition: {
        fillRate: number;
        stableTime: number;
    };
    specialBehavior?: string;
}

@ccclass('LevelLoader')
export class LevelLoader extends Component {
    @property(BallManager)
    ballManager: BallManager = null;

    @property(ContainerManager)
    containerManager: ContainerManager = null;

    private _currentLevel: LevelConfig = null;

    public loadLevel(levelId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load('data/levels', JsonAsset, (err, asset) => {
                if (err) {
                    console.error('Failed to load levels:', err);
                    reject(err);
                    return;
                }

                const data = asset.json;
                const level = data.levels.find((l: LevelConfig) => l.id === levelId);

                if (!level) {
                    console.error(`Level ${levelId} not found`);
                    reject(new Error(`Level ${levelId} not found`));
                    return;
                }

                this._currentLevel = level;
                this.initLevel(level);
                resolve();
            });
        });
    }

    private initLevel(level: LevelConfig): void {
        // 清除旧团子
        this.ballManager.clearBalls();

        // 初始化容器
        this.containerManager.init(level.container);

        // 创建团子
        for (const ballConfig of level.balls) {
            this.ballManager.createBall(ballConfig);
        }

        console.log(`Level ${level.id} (${level.name}) loaded`);
    }

    public getCurrentLevel(): LevelConfig {
        return this._currentLevel;
    }
}
```

**Step 2: 更新 GameManager 使用 LevelLoader**

修改 `assets/scripts/core/GameManager.ts`:

```typescript
import { LevelLoader } from './LevelLoader';

@ccclass('GameManager')
export class GameManager extends Component {
    @property(LevelLoader)
    levelLoader: LevelLoader = null;

    // ... 其他代码保持不变

    public async loadLevel(levelId: number) {
        this._currentLevel = levelId;
        this._stableTimer = 0;
        this.changeState(GameState.PLAYING);

        try {
            await this.levelLoader.loadLevel(levelId);
        } catch (error) {
            console.error('Failed to load level:', error);
        }
    }
}
```

**Step 3: 提交**

```bash
git add assets/scripts/core/LevelLoader.ts assets/scripts/core/GameManager.ts
git commit -m "feat: add LevelLoader and integrate with GameManager"
```

---

### Task 3.4: 实现容器边界检测

**目标:** 检测团子是否在容器内

**文件:**
- Modify: `assets/scripts/core/ContainerManager.ts`

**Step 1: 扩展 ContainerManager 添加边界检测**

在 `ContainerManager.ts` 中添加以下方法：

```typescript
public checkBallsInside(balls: Node[]): boolean {
    for (const ballNode of balls) {
        if (!this.isBallInside(ballNode)) {
            return false;
        }
    }
    return true;
}

private isBallInside(ballNode: Node): boolean {
    const ballPos = ballNode.worldPosition;
    const ball = ballNode.getComponent('Ball') as Ball;

    if (!ball) return false;

    const radius = ball.radius;
    const buffer = radius * GAME_CONFIG.CONTAINER.BUFFER_ZONE;

    // 根据容器类型检测
    switch (this._containerConfig.type) {
        case 'polygon':
            return this.isInsidePolygon(ballPos, buffer);
        case 'circle':
            return this.isInsideCircle(ballPos, buffer);
        default:
            return true;
    }
}

private isInsidePolygon(pos: Vec3, buffer: number): boolean {
    // 使用射线法检测点是否在多边形内
    const vertices = this._containerConfig.vertices || [];
    let inside = false;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;

        const intersect = ((yi > pos.y) !== (yj > pos.y)) &&
            (pos.x < (xj - xi) * (pos.y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}

private isInsideCircle(pos: Vec3, buffer: number): boolean {
    const center = this._containerConfig.center || { x: 0, y: 0 };
    const radius = this._containerConfig.radius || 0;

    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < (radius - buffer);
}
```

**Step 2: 提交**

```bash
git add assets/scripts/core/ContainerManager.ts
git commit -m "feat: add boundary detection for containers"
```

---

## 阶段4: UI 系统与胜利判定

### Task 4.1: 创建 FillRateBar 填充率进度条

**目标:** 显示容器填充率

**文件:**
- Create: `assets/scripts/ui/FillRateBar.ts`

**Step 1: 创建 FillRateBar 组件**

```typescript
// assets/scripts/ui/FillRateBar.ts

import { _decorator, Component, Node, Sprite, UITransform, Tween, color } from 'cc';
import { GAME_CONFIG } from '../core/GameConstants';

const { ccclass, property } = _decorator;

@ccclass('FillRateBar')
export class FillRateBar extends Component {
    @property(Sprite)
    barSprite: Sprite = null;

    @property(Node)
    textNode: Node = null;

    private _currentFillRate: number = 0;

    public updateFillRate(fillRate: number): void {
        this._currentFillRate = fillRate;
        this.updateBar(fillRate);
        this.updateColor(fillRate);
    }

    private updateBar(fillRate: number): void {
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            const maxWidth = transform.width;
            const currentWidth = maxWidth * fillRate;

            const barTransform = this.barSprite.node.getComponent(UITransform);
            if (barTransform) {
                barTransform.setContentSize(currentWidth, barTransform.height);
            }
        }
    }

    private updateColor(fillRate: number): void {
        let barColor: color;

        if (fillRate >= 0.95) {
            barColor = new color(255, 0, 0); // 红色闪烁
        } else if (fillRate >= 0.8) {
            barColor = new color(255, 200, 0); // 黄色
        } else {
            barColor = new color(100, 200, 100); // 绿色
        }

        this.barSprite.color = barColor;
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/ui/FillRateBar.ts
git commit -m "feat: add FillRateBar component"
```

---

### Task 4.2: 创建 ResultPanel 结算弹窗

**目标:** 显示过关评价

**文件:**
- Create: `assets/scripts/ui/ResultPanel.ts`

**Step 1: 创建 ResultPanel 组件**

```typescript
// assets/scripts/ui/ResultPanel.ts

import { _decorator, Component, Node, Label, Button } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('ResultPanel')
export class ResultPanel extends Component {
    @property(Label)
    titleLabel: Label = null;

    @property(Label)
    fillRateLabel: Label = null;

    @property(Button)
    nextLevelButton: Button = null;

    @property(Button)
    retryButton: Button = null;

    @property(Button)
    shareButton: Button = null;

    onLoad() {
        this.node.active = false;

        if (this.nextLevelButton) {
            this.nextLevelButton.node.on(Button.EventType.CLICK, this.onNextLevel, this);
        }
        if (this.retryButton) {
            this.retryButton.node.on(Button.EventType.CLICK, this.onRetry, this);
        }
        if (this.shareButton) {
            this.shareButton.node.on(Button.EventType.CLICK, this.onShare, this);
        }
    }

    public show(fillRate: number): void {
        this.node.active = true;
        this.titleLabel.string = this.getRankText(fillRate);
        this.fillRateLabel.string = `填充率: ${(fillRate * 100).toFixed(1)}%`;
    }

    public hide(): void {
        this.node.active = false;
    }

    private getRankText(fillRate: number): string {
        if (fillRate >= 0.99) return '空间管理大师！';
        if (fillRate >= 0.95) return '挤挤总会有的';
        if (fillRate >= 0.90) return '就这？';
        return '继续努力';
    }

    private onNextLevel(): void {
        const currentLevel = GameManager.instance.currentLevel;
        if (currentLevel < 20) {
            GameManager.instance.loadLevel(currentLevel + 1);
        }
        this.hide();
    }

    private onRetry(): void {
        GameManager.instance.loadLevel(GameManager.instance.currentLevel);
        this.hide();
    }

    private onShare(): void {
        // TODO: 调用 ShareManager 生成分享图片
        console.log('Share functionality to be implemented');
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/ui/ResultPanel.ts
git commit -m "feat: add ResultPanel component"
```

---

### Task 4.3: 实现胜利判定逻辑

**目标:** 在 GameManager 中实现胜利条件检测

**文件:**
- Modify: `assets/scripts/core/GameManager.ts`

**Step 1: 扩展 GameManager 添加胜利检测**

在 `GameManager.ts` 中添加以下代码：

```typescript
import { ContainerManager } from './ContainerManager';
import { BallManager } from './BallManager';

@ccclass('GameManager')
export class GameManager extends Component {
    @property(ContainerManager)
    containerManager: ContainerManager = null;

    @property(BallManager)
    ballManager: BallManager = null;

    // ... 其他代码

    private updateGameLogic(dt: number) {
        // 获取所有团子节点
        const balls = this.ballManager.getBalls().map(b => b.node);

        // 检测是否所有团子都在容器内
        const allInside = this.containerManager.checkBallsInside(balls);

        if (allInside) {
            this._stableTimer += dt;

            // 显示倒计时（可选）
            console.log(`Stable: ${this._stableTimer.toFixed(1)}s / ${GAME_CONFIG.WIN.STABLE_TIME}s`);

            if (this._stableTimer >= GAME_CONFIG.WIN.STABLE_TIME) {
                this.levelComplete();
            }
        } else {
            // 团子弹出，重置计时器
            if (this._stableTimer > 0) {
                console.log('Ball popped out! Timer reset.');
            }
            this._stableTimer = 0;
        }
    }

    private levelComplete(): void {
        this.changeState(GameState.WIN);

        // 计算填充率
        const fillRate = this.calculateFillRate();

        // 显示结算界面
        // const resultPanel = this.uiNode.getComponent(ResultPanel);
        // if (resultPanel) {
        //     resultPanel.show(fillRate);
        // }

        console.log(`Level Complete! Fill rate: ${(fillRate * 100).toFixed(1)}%`);
    }

    private calculateFillRate(): number {
        // TODO: 实现精确的填充率计算
        // 简化版本：基于团子数量
        const ballCount = this.ballManager.getBallCount();
        const levelData = this.levelLoader.getCurrentLevel();

        if (!levelData) return 0;

        // 简化假设：每个团子占据一定空间
        const ballArea = ballCount * 10000; // 假设每个团子10000面积
        const containerArea = 150000; // 假设容器150000面积

        return Math.min(ballArea / containerArea, 1);
    }
}
```

**Step 2: 提交**

```bash
git add assets/scripts/core/GameManager.ts
git commit -m "feat: add win condition detection"
```

---

## 阶段5: 震动与分享功能

### Task 5.1: 实现 VibrationManager 震动管理器

**目标:** 封装微信小游戏震动API

**文件:**
- Create: `assets/scripts/systems/VibrationManager.ts`

**Step 1: 创建 VibrationManager 脚本**

```typescript
// assets/scripts/systems/VibrationManager.ts

import { _decorator, Component, sys } from 'cc';
import { GAME_CONFIG } from '../core/GameConstants';

const { ccclass } = _decorator;

export enum VibrateType {
    LIGHT = 'light',
    MEDIUM = 'medium',
    HEAVY = 'heavy'
}

@ccclass('VibrationManager')
export class VibrationManager extends Component {
    private static _instance: VibrationManager;

    public static get instance(): VibrationManager {
        return VibrationManager._instance;
    }

    onLoad() {
        if (VibrationManager._instance) {
            this.destroy();
            return;
        }
        VibrationManager._instance = this;
    }

    public static vibrate(type: VibrateType): void {
        if (sys.platform !== sys.Platform.WECHAT_GAME) {
            console.log('Vibration not supported on this platform');
            return;
        }

        const wx = (window as any).wx;
        if (!wx || !wx.vibrateShort) {
            console.log('WeChat API not available');
            return;
        }

        try {
            wx.vibrateShort({ type });
        } catch (error) {
            console.error('Vibration failed:', error);
        }
    }

    public static vibrateLong(): void {
        if (sys.platform !== sys.Platform.WECHAT_GAME) return;

        const wx = (window as any).wx;
        if (!wx || !wx.vibrateLong) return;

        try {
            wx.vibrateLong();
        } catch (error) {
            console.error('Long vibration failed:', error);
        }
    }

    public static vibratePattern(): void {
        // 实现连续震动模式（胜利时使用）
        const pattern = async () => {
            for (let i = 0; i < 4; i++) {
                VibrationManager.vibrate(VibrateType.MEDIUM);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        };
        pattern();
    }
}
```

**Step 2: 在 Ball 碰撞时触发震动**

修改 `assets/scripts/core/Ball.ts`，添加碰撞回调：

```typescript
import { VibrationManager, VibrateType } from '../systems/VibrationManager';
import { PhysicsManager } from './PhysicsManager';

@ccclass('Ball')
export class Ball extends Component {
    // ... 其他代码

    public onCollisionEnter(): void {
        if (this.isDragging) return;

        const rigidBody = this.node.getComponent('cc.RigidBody2D') as any;
        const speed = PhysicsManager.instance.getBallSpeed(rigidBody);

        if (speed > GAME_CONFIG.VIBRATION.COLLISION_THRESHOLD) {
            VibrationManager.vibrate(VibrateType.LIGHT);
        }
    }
}
```

**Step 3: 提交**

```bash
git add assets/scripts/systems/VibrationManager.ts assets/scripts/core/Ball.ts
git commit -m "feat: add VibrationManager and collision feedback"
```

---

### Task 5.2: 实现 ShareManager 分享管理器

**目标:** 生成挤压报告图片

**文件:**
- Create: `assets/scripts/systems/ShareManager.ts`

**Step 1: 创建 ShareManager 脚本**

```typescript
// assets/scripts/systems/ShareManager.ts

import { _decorator, Component, Sprite, SpriteFrame, Texture2D, image } from 'cc';
import { sys } from 'cc';

const { ccclass, property } = _decorator;

export interface ShareData {
    level: number;
    fillRate: number;
    rank: string;
}

@ccclass('ShareManager')
export class ShareManager extends Component {
    private static _instance: ShareManager;

    public static get instance(): ShareManager {
        return ShareManager._instance;
    }

    onLoad() {
        if (ShareManager._instance) {
            this.destroy();
            return;
        }
        ShareManager._instance = this;
    }

    public getRank(fillRate: number): string {
        if (fillRate >= 0.99) return '空间管理大师！';
        if (fillRate >= 0.95) return '挤挤总会有的';
        if (fillRate >= 0.90) return '就这？';
        return '继续努力';
    }

    public async generateShareImage(data: ShareData): Promise<string> {
        if (sys.platform !== sys.Platform.WECHAT_GAME) {
            console.log('Share only available on WeChat');
            return '';
        }

        const wx = (window as any).wx;
        if (!wx || !wx.createCanvasContext) {
            console.log('WeChat Canvas API not available');
            return '';
        }

        return new Promise((resolve, reject) => {
            try {
                const ctx = wx.createCanvasContext('shareCanvas');
                const canvasWidth = 750;
                const canvasHeight = 1334;

                // 绘制背景
                ctx.fillStyle = '#E8E8ED';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // 绘制标题
                ctx.fillStyle = '#333333';
                ctx.font = 'bold 48px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('往死里挤', canvasWidth / 2, 100);

                // 绘制关卡信息
                ctx.font = '36px sans-serif';
                ctx.fillText(`第 ${data.level} 关`, canvasWidth / 2, 180);

                // 绘制填充率
                ctx.font = 'bold 64px sans-serif';
                ctx.fillStyle = '#FF6B6B';
                ctx.fillText(`${(data.fillRate * 100).toFixed(1)}%`, canvasWidth / 2, 300);

                // 绘制评价
                ctx.fillStyle = '#333333';
                ctx.font = '42px sans-serif';
                ctx.fillText(data.rank, canvasWidth / 2, 400);

                // 绘制容器区域（简化为矩形示意）
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 10;
                ctx.strokeRect(100, 500, 550, 550);

                // 绘制文案
                ctx.fillStyle = '#666666';
                ctx.font = '36px sans-serif';
                ctx.fillText('我的瓶子里连一个原子都塞不下了', canvasWidth / 2, 1150);

                ctx.font = '30px sans-serif';
                ctx.fillText('不信你试试？', canvasWidth / 2, 1220);

                // 绘制到Canvas
                ctx.draw(false, () => {
                    // 导出为临时文件
                    wx.canvasToTempFilePath({
                        canvasId: 'shareCanvas',
                        success: (res: any) => {
                            resolve(res.tempFilePath);
                        },
                        fail: (err: any) => {
                            console.error('Canvas export failed:', err);
                            reject(err);
                        }
                    });
                });
            } catch (error) {
                console.error('Share image generation failed:', error);
                reject(error);
            }
        });
    }

    public shareToFriend(imagePath: string): void {
        if (sys.platform !== sys.Platform.WECHAT_GAME) return;

        const wx = (window as any).wx;
        if (!wx || !wx.shareImage) return;

        wx.shareImage({
            url: imagePath,
            success: () => {
                console.log('Share success');
            },
            fail: (err: any) => {
                console.error('Share failed:', err);
            }
        });
    }
}
```

**Step 2: 更新 ResultPanel 使用 ShareManager**

修改 `assets/scripts/ui/ResultPanel.ts`:

```typescript
import { ShareManager, ShareData } from '../systems/ShareManager';

@ccclass('ResultPanel')
export class ResultPanel extends Component {
    private _fillRate: number = 0;

    public show(fillRate: number): void {
        this._fillRate = fillRate;
        this.node.active = true;
        this.titleLabel.string = this.getRankText(fillRate);
        this.fillRateLabel.string = `填充率: ${(fillRate * 100).toFixed(1)}%`;
    }

    private async onShare(): void {
        const shareManager = ShareManager.instance;

        const data: ShareData = {
            level: GameManager.instance.currentLevel,
            fillRate: this._fillRate,
            rank: this.getRankText(this._fillRate)
        };

        try {
            const imagePath = await shareManager.generateShareImage(data);
            shareManager.shareToFriend(imagePath);
        } catch (error) {
            console.error('Share failed:', error);
        }
    }
}
```

**Step 3: 提交**

```bash
git add assets/scripts/systems/ShareManager.ts assets/scripts/ui/ResultPanel.ts
git commit -m "feat: add ShareManager for report generation"
```

---

## 阶段6: 特殊关卡实现

### Task 6.1: 实现第18关移动容器

**目标:** 实现容器振荡移动效果

**文件:**
- Modify: `assets/scripts/core/ContainerManager.ts`
- Create: `assets/scripts/physics/MovingContainer.ts`

**Step 1: 创建 MovingContainer 组件**

```typescript
// assets/scripts/physics/MovingContainer.ts

import { _decorator, Component, Vec3, tween, Tween } from 'cc';

const { ccclass, property } = _decorator;

export interface MovementConfig {
    type: 'oscillate';
    axis: 'x' | 'y';
    amplitude: number;
    period: number;
}

@ccclass('MovingContainer')
export class MovingContainer extends Component {
    private _movementConfig: MovementConfig = null;
    private _tween: Tween<Node> = null;

    public init(config: MovementConfig): void {
        this._movementConfig = config;
        this.startMovement();
    }

    private startMovement(): void {
        if (!this._movementConfig) return;

        const { axis, amplitude, period } = this._movementConfig;
        const halfPeriod = period / 2;

        this._tween = tween(this.node)
            .to(halfPeriod, {
                position: new Vec3(
                    axis === 'x' ? amplitude : 0,
                    axis === 'y' ? amplitude : 0,
                    0
                )
            })
            .to(halfPeriod, {
                position: new Vec3(0, 0, 0)
            })
            .union()
            .repeatForever()
            .start();
    }

    public stopMovement(): void {
        if (this._tween) {
            this._tween.stop();
            this._tween = null;
        }
    }

    onDestroy(): void {
        this.stopMovement();
    }
}
```

**Step 2: 在 ContainerManager 中支持移动容器**

修改 `assets/scripts/core/ContainerManager.ts`:

```typescript
import { MovingContainer, MovementConfig } from '../physics/MovingContainer';

@ccclass('ContainerManager')
export class ContainerManager extends Component {
    @property(Node)
    borderNode: Node = null;

    private _containerConfig: ContainerConfig;
    private _movingContainer: MovingContainer = null;

    public init(config: ContainerConfig): void {
        this._containerConfig = config;
        this.removeColliders();

        // 停止旧的移动
        if (this._movingContainer) {
            this._movingContainer.stopMovement();
            this._movingContainer = null;
        }

        switch (config.type) {
            case 'polygon':
                this.createPolygonContainer(config.vertices);
                break;
            case 'circle':
                this.createCircleContainer(config.radius, config.center);
                break;
            case 'multi':
                this.createMultiContainer(config.shapes);
                break;
        }

        // 检查是否有特殊行为
        // 注意：需要从 LevelLoader 传递 specialBehavior 和 containerMovement
    }

    public enableMovingContainer(config: MovementConfig): void {
        if (!this._movingContainer) {
            this._movingContainer = this.borderNode.addComponent(MovingContainer);
        }
        this._movingContainer.init(config);
    }
}
```

**Step 3: 更新 LevelLoader 支持特殊行为**

修改 `assets/scripts/core/LevelLoader.ts`:

```typescript
export interface LevelConfig {
    id: number;
    name: string;
    container: ContainerConfig;
    balls: BallConfig[];
    winCondition: {
        fillRate: number;
        stableTime: number;
    };
    specialBehavior?: string;
    containerMovement?: any;
}

@ccclass('LevelLoader')
export class LevelLoader extends Component {
    private initLevel(level: LevelConfig): void {
        this.ballManager.clearBalls();
        this.containerManager.init(level.container);

        // 处理特殊行为
        if (level.specialBehavior === 'movingContainer' && level.containerMovement) {
            this.containerManager.enableMovingContainer(level.containerMovement);
        }

        for (const ballConfig of level.balls) {
            this.ballManager.createBall(ballConfig);
        }

        console.log(`Level ${level.id} (${level.name}) loaded`);
    }
}
```

**Step 4: 提交**

```bash
git add assets/scripts/physics/MovingContainer.ts assets/scripts/core/ContainerManager.ts assets/scripts/core/LevelLoader.ts
git commit -m "feat: add moving container for level 18"
```

---

### Task 6.2: 实现第20关长条团子

**目标:** 实现链式刚体团子

**文件:**
- Create: `assets/scripts/physics/ChainBodyBuilder.ts`
- Modify: `assets/scripts/core/BallManager.ts`

**Step 1: 创建 ChainBodyBuilder 组件**

```typescript
// assets/scripts/physics/ChainBodyBuilder.ts

import { _decorator, Component, Node, Vec2, RigidBody2D, CircleCollider2D, Joint2D, DistanceJoint2D } from 'cc';
import { GAME_CONFIG } from '../core/GameConstants';

const { ccclass } = _decorator;

export interface ChainBallConfig {
    type: 'chain';
    segments: number;
    segmentRadius: number;
    color: string;
    position: {x: number, y: number};
}

@ccclass('ChainBodyBuilder')
export class ChainBodyBuilder extends Component {
    public createChainBall(config: ChainBallConfig, container: Node): Node[] {
        const segments: Node[] = [];
        const { segments: count, segmentRadius, color, position } = config;

        // 创建多个小圆球用关节连接
        for (let i = 0; i < count; i++) {
            const segmentNode = new Node(`ChainSegment_${i}`);
            segmentNode.setParent(container);

            // 添加刚体
            const rigidBody = segmentNode.addComponent(RigidBody2D);
            rigidBody.type = RigidBody2D.Type.Dynamic;
            rigidBody.gravityScale = 1;
            rigidBody.linearDamping = GAME_CONFIG.BALL.LINEAR_DAMPING;
            rigidBody.angularDamping = GAME_CONFIG.BALL.ANGULAR_DAMPING;

            // 添加碰撞体
            const collider = segmentNode.addComponent(CircleCollider2D);
            collider.radius = segmentRadius;
            collider.density = GAME_CONFIG.BALL.DENSITY;
            collider.friction = GAME_CONFIG.BALL.FRICTION;
            collider.restitution = GAME_CONFIG.BALL.RESTITUTION;

            // 设置位置（垂直排列）
            const yOffset = i * segmentRadius * 2;
            segmentNode.setPosition(position.x, position.y - yOffset);

            // 添加 Sprite 组件用于渲染
            const sprite = segmentNode.addComponent('cc.Sprite') as any;
            // TODO: 设置颜色

            segments.push(segmentNode);

            // 用关节连接到前一个节点
            if (i > 0) {
                this.connectWithJoint(segments[i - 1], segmentNode, segmentRadius);
            }
        }

        return segments;
    }

    private connectWithJoint(nodeA: Node, nodeB: Node, radius: number): void {
        const joint = nodeA.addComponent(Joint2D) as DistanceJoint2D;
        joint.connectedBody = nodeB.getComponent(RigidBody2D);

        // 设置关节属性
        joint.autoDistance = false;
        joint.distance = radius * 2;
        joint.dampingRatio = 0.5;
        joint.frequency = 10;
    }
}
```

**Step 2: 更新 BallManager 支持链式团子**

修改 `assets/scripts/core/BallManager.ts`:

```typescript
import { ChainBodyBuilder, ChainBallConfig } from '../physics/ChainBodyBuilder';

@ccclass('BallManager')
export class BallManager extends Component {
    private _chainSegments: Node[] = [];

    public createBall(config: BallConfig | ChainBallConfig): Ball | Node[] {
        if ((config as any).type === 'chain') {
            return this.createChainBall(config as ChainBallConfig);
        }
        // ... 原有代码
    }

    private createChainBall(config: ChainBallConfig): Node[] {
        const builder = new ChainBodyBuilder();
        const segments = builder.createChainBall(config, this.containerNode);
        this._chainSegments.push(...segments);
        return segments;
    }

    public clearBalls(): void {
        super.clearBalls();

        for (const segment of this._chainSegments) {
            segment.setParent(null);
            segment.destroy();
        }
        this._chainSegments = [];
    }
}
```

**Step 3: 提交**

```bash
git add assets/scripts/physics/ChainBodyBuilder.ts assets/scripts/core/BallManager.ts
git commit -m "feat: add chain body balls for level 20"
```

---

## 阶段7: 测试与优化

### Task 7.1: 性能优化检查

**目标:** 检查并优化性能

**步骤:**

**Step 1: 检查 DrawCall**

在 Cocos Creator 中运行游戏，查看调试器的 DrawCall 数量：
- 目标: < 20 DrawCall
- 优化: 合并团子 Sprite 到同一图集

**Step 2: 检查物理性能**

- 确认物理更新频率为 60Hz
- 检查 velocityIterations 和 positionIterations 设置合理

**Step 3: 内存优化**

- 确认对象池正常工作
- 检查没有内存泄漏（团子销毁时移除所有引用）

**Step 4: 提交优化**

```bash
git commit -m "perf: optimize performance and reduce draw calls"
```

---

### Task 7.2: 包体积优化

**目标:** 确保微信小游戏包体积 < 4MB

**步骤:**

**Step 1: 检查包大小**

```bash
# 在 Cocos Creator 中构建微信小游戏
# 查看输出目录大小
du -sh build/wechatgame
```

**Step 2: 优化措施**

- 压缩纹理（使用 ASTC 格式）
- 移除未使用资源
- 代码压缩混淆

**Step 3: 提交**

```bash
git commit -m "build: optimize package size for WeChat mini game"
```

---

### Task 7.3: 最终测试

**目标:** 完整测试所有功能

**测试清单:**

- [ ] 20个关卡全部可玩
- [ ] 胜利判定准确
- [ ] 震动反馈正常
- [ ] 分享功能正常
- [ ] 无明显Bug

**Step 1: 提交最终版本**

```bash
git add .
git commit -m "release: complete The Squeeze game with 20 levels"
git tag v1.0.0
```

---

## 总结

本实施计划将《往死里挤》游戏开发分解为 7 个阶段、约 30 个可执行任务。每个任务都包含详细的代码和提交步骤。

**关键里程碑:**
1. ✅ 项目初始化（阶段1）
2. ✅ 物理系统（阶段2）
3. ✅ 容器和关卡（阶段3）
4. ✅ UI和胜利判定（阶段4）
5. ✅ 震动和分享（阶段5）
6. ✅ 特殊关卡（阶段6）
7. ✅ 测试优化（阶段7）

**下一步:** 使用 `superpowers:executing-plans` 技能执行此计划。
