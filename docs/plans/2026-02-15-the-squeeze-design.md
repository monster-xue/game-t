# 《往死里挤》(The Squeeze) 设计文档

**日期**: 2026-02-15
**引擎**: Cocos Creator 3.8.8
**语言**: TypeScript
**平台**: 微信小游戏

---

## 一、项目概述

### 1.1 游戏概念

《往死里挤》是一款基于物理挤压的益智游戏。玩家需要将软萌的"团子"拖拽进各种形状的容器中，团子之间会相互挤压、碰撞，通过物理模拟展现Q弹的手感。

### 1.2 核心特色

- **软体物理手感**: 团子被挤压时会变形，松手后回弹
- **20个精心设计的关卡**: 从简单的方形到复杂的移动容器
- **无声体验**: 纯震动反馈，"视觉弹性"就是一切
- **分享裂变**: 生成"挤压报告"图片，支持好友头像自定义

---

## 二、视觉风格设定

### 2.1 色彩方案

- **底色**: 低饱和度莫兰迪色系（淡灰蓝 `#E8E8ED`、奶茶色 `#F5E6D3`）
- **团子**: 马卡龙色系（`#FFB5C5`、`#FFDAB9`、`#E6E6FA` 等）
- **容器**: 深灰色边框 `#4A4A4A`，玻璃质感

### 2.2 角色设计

**团子（主角）**:
- 形状：半透明圆球，带简单光影
- 表情：两个小黑点眼睛，被挤压时变成"X"眼
- 特效：高压时出现流汗粒子效果

---

## 三、核心架构

### 3.1 技术栈

| 类别 | 技术选型 |
|------|----------|
| 引擎 | Cocos Creator 3.8.8 |
| 语言 | TypeScript 5.x |
| 物理引擎 | Box2D (Cocos内置) |
| 平台 | 微信小游戏 |

### 3.2 场景架构

```
启动流程:
Launch.scene (关卡选择) → Game.scene (游戏主场景) → ResultPanel (结算)
```

**采用单一场景复用策略**：所有20关共用同一个Game场景，通过JSON配置加载不同内容，节省包体积。

### 3.3 目录结构

```
game-t/
├── assets/
│   ├── scenes/
│   │   ├── Launch.scene              # 启动+关卡选择
│   │   └── Game.scene                # 游戏主场景
│   ├── scripts/
│   │   ├── core/
│   │   │   ├── GameManager.ts        # 游戏主控制器
│   │   │   ├── PhysicsManager.ts     # Box2D物理管理
│   │   │   ├── BallManager.ts        # 团子管理器
│   │   │   ├── Ball.ts               # 单个团子组件
│   │   │   ├── ContainerManager.ts   # 容器管理器
│   │   │   ├── LevelLoader.ts        # 关卡加载器
│   │   │   └── GameConstants.ts      # 全局常量
│   │   ├── physics/
│   │   │   ├── SoftBodyDeformer.ts   # 视觉形变计算
│   │   │   └── ChainBodyBuilder.ts   # 长条团子构建
│   │   ├── ui/
│   │   │   ├── LevelSelect.ts        # 关卡选择
│   │   │   ├── TopBar.ts             # 顶部导航
│   │   │   ├── CountdownOverlay.ts   # 倒计时
│   │   │   ├── ResultPanel.ts        # 结算弹窗
│   │   │   └── FillRateBar.ts        # 填充率进度条
│   │   ├── systems/
│   │   │   ├── VibrationManager.ts   # 震动反馈
│   │   │   ├── ShareManager.ts       # 分享功能
│   │   │   ├── CustomBallManager.ts  # 头像自定义
│   │   │   └── InputManager.ts       # 触摸输入
│   │   ├── data/
│   │   │   └── levels.json           # 20关配置
│   │   └── utils/
│   │       ├── ObjectPool.ts         # 对象池
│   │       └── MathUtils.ts          # 数学工具
│   └── resources/
│       ├── textures/                 # 贴图资源
│       └── particles/                # 粒子效果
```

---

## 四、物理系统设计

### 4.1 Box2D 配置

```typescript
const PHYSICS_CONFIG = {
    gravity: { x: 0, y: -320 },    // 稍强重力，下落有重量感
    step: 1/60,                     // 60Hz物理更新
    velocityIterations: 8,
    positionIterations: 3
};
```

### 4.2 团子物理参数

```typescript
interface BallPhysicsConfig {
    density: 1.0,         // 密度
    friction: 0.1,        // 低摩擦，滑溜溜手感
    restitution: 0.4,     // 中等弹性，Q弹但不会乱飞
    linearDamping: 0.5,   // 线性阻尼
    angularDamping: 0.5   // 角阻尼
}
```

### 4.3 软体视觉形变

团子在物理上是刚体圆形，渲染时通过计算速度和受力来形变Sprite：

```typescript
// 基于速度的挤压形变
const velocity = body.getLinearVelocity();
const speed = velocity.length();
const squashFactor = Math.min(speed / 500, 0.3); // 最多压缩30%

// 沿运动方向拉伸，垂直方向压缩
const angle = Math.atan2(velocity.y, velocity.x);
sprite.setScale(
    1 + squashFactor,          // 拉伸
    1 - squashFactor * 0.5     // 压缩（体积守恒）
);
sprite.angle = angle * Math.radToDeg;
```

---

## 五、关卡系统

### 5.1 关卡数据结构

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
    }
  ]
}
```

### 5.2 容器类型支持

| 类型 | 说明 | 关卡示例 |
|------|------|----------|
| `polygon` | 多边形（正方形、三角形、梯形等） | 1, 3, 5, 9 |
| `circle` | 圆形/圆环 | 2, 7, 18 |
| `multi` | 多个独立形状 | 14, 20 |

### 5.3 特殊关卡机制

| 关卡 | 特殊行为 | 实现方式 |
|------|----------|----------|
| 18 | 移动容器 | `specialBehavior: "movingContainer"` + 振荡参数 |
| 20 | 长条团子 | `specialBehavior: "chainBody"` + 链式刚体 |

---

## 六、游戏循环与判定

### 6.1 主循环

```typescript
update(dt) {
    // 1. 物理步进
    PhysicsManager.step(dt);

    // 2. 更新团子视觉形变
    BallManager.updateDeformations();

    // 3. 检测团子是否在容器内
    const allInside = ContainerManager.checkBallsInside();

    // 4. 胜利倒计时
    if (allInside && !this.isStable) {
        this.stableTimer += dt;
        if (this.stableTimer >= 3.0) {
            this.levelComplete();
        }
    } else {
        this.stableTimer = 0;
    }
}
```

### 6.2 胜利条件

- 所有团子中心点距离容器边界 > `ballRadius * 0.8`
- 保持稳定 3 秒（期间有团子弹出则重置计时器）
- 容器填充率 = 团子总面积 / 容器内接面积

---

## 七、UI 系统设计

### 7.1 界面布局

```
┌────────────────────────────────┐
│  [←] 第1关 / 20    ⏸  🔄      │ ← 顶部导航 (60px)
├────────────────────────────────┤
│        [团子待挤区]             │ ← 团子生成区 (Y: 80%)
│      (●) (●) (●)               │
│                                │
│    ┌─────────────────┐         │
│    │  ┌───┐          │         │ ← 容器 (中心 Y: 40%)
│    │  │ ● │          │         │   宽度: 70-80% 屏幕
│    └─────────────────┘         │
│  ▓▓▓▓▓▓▓▓░░░░  85%           │ ← 填充率进度条 (底部 40px)
└────────────────────────────────┘
```

### 7.2 主要 UI 组件

| 组件 | 功能 |
|------|------|
| `LevelSelectItem` | 关卡选择卡片，显示解锁状态和星级 |
| `TopBar` | 返回、关卡号、暂停、重玩按钮 |
| `CountdownOverlay` | "3...2...1" 倒计时遮罩 |
| `ResultPanel` | 过关评价、挤压率、分享按钮 |
| `FillRateBar` | 容器填充率进度条，80%变黄，95%闪烁 |

---

## 八、震动反馈系统

### 8.1 震动 API 封装

```typescript
class VibrationManager {
    static vibrate(type: VibrateType) {
        if (sys.platform === sys.Platform.WECHAT_GAME) {
            wx.vibrateShort({ type });
        }
    }

    static readonly VIBRATE = {
        COLLISION: 'light',      // 团子碰撞 - 轻微震动
        SQUEEZE: 'medium',       // 高压挤压 - 中等震动
        POP_OUT: 'heavy',        // 团子弹飞 - 强震动
        WIN: 'pattern'           // 胜利 - 连续震动
    };
}
```

### 8.2 触发时机

| 事件 | 震动类型 | 触发条件 |
|------|----------|----------|
| 团子碰撞 | `light` | 碰撞速度 > 200 |
| 高压挤压 | `medium` | 形变 > 30%，持续震动 |
| 团子弹飞 | `heavy` | 离开容器边界 |
| 过关 | `pattern` | 倒计时结束 |

---

## 九、分享裂变功能

### 9.1 挤压报告生成

```typescript
class ShareManager {
    async generateShareImage(levelData, fillRate): Promise<ImageAsset> {
        const canvas = document.createElement('canvas');
        canvas.width = 750;
        canvas.height = 1334;
        const ctx = canvas.getContext('2d');

        // 1. 绘制游戏截图
        ctx.drawImage(gameScreenshot, 0, 0, 750, 800);

        // 2. 绘制容器边框高亮
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 10;
        ctx.strokeRect(100, 200, 550, 550);

        // 3. 绘制数据卡片
        this.drawDataCard(ctx, {
            level: levelData.id,
            fillRate: fillRate,
            rank: this.getRank(fillRate)
        });

        // 4. 绘制文案
        ctx.fillText('我的瓶子里连一个原子都塞不下了', 80, 1150);
        ctx.fillText('不信你试试？', 250, 1220);

        return canvas.toTempFilePath();
    }

    getRank(fillRate): string {
        if (fillRate >= 0.99) return '空间管理大师！';
        if (fillRate >= 0.95) return '挤挤总会有的';
        if (fillRate >= 0.90) return '就这？';
        return '继续努力';
    }
}
```

### 9.2 头像自定义

```typescript
class CustomBallManager {
    async setCustomBallTexture(imageUrl: string) {
        const texture = await resources.load(imageUrl, SpriteFrame);
        this.ballTexture = texture;
    }

    showCustomMenu(ball: Ball) {
        wx.chooseImage({
            count: 1,
            success: (res) => {
                this.setCustomBallTexture(res.tempFilePaths[0]);
            }
        });
    }
}
```

---

## 十、视觉特效系统

### 10.1 团子表情系统

```typescript
class BallFace {
    private normalEyes: SpriteFrame;
    private xEyes: SpriteFrame;
    private sweatParticle: ParticleSystem;

    update(squeezeRatio: number) {
        if (squeezeRatio > 0.4) {
            this.eyeSprite.spriteFrame = this.xEyes;

            if (squeezeRatio > 0.6) {
                this.sweatParticle.resetSystem();
            }
        } else {
            this.eyeSprite.spriteFrame = this.normalEyes;
            this.sweatParticle.stopSystem();
        }
    }
}
```

### 10.2 容器"挤爆"警告

```typescript
if (fillRate > 0.95) {
    // 容器边框抖动
    tween(this.containerNode)
        .to(0.05, { angle: 2 })
        .to(0.05, { angle: -2 })
        .union()
        .repeat(3)
        .start();

    // 显示裂纹贴图
    this.crackSprite.active = true;

    // 进度条闪烁
    this.fillRateBar.getComponent(Animation).play('flash');
}
```

---

## 十一、性能优化策略

| 优化点 | 实现 |
|--------|------|
| 对象池 | 团子复用，避免频繁创建/销毁 |
| 物理子步 | 60Hz即可，不需要更高精度 |
| 碰撞层级 | 只检测团子-容器、团子-团子 |
| 纹理压缩 | 使用 ASTC 格式贴图 |
| 按需加载 | 关卡配置按需加载 |
| DrawCall | 合并团子 Sprite 到同一图集 |

---

## 十二、全局配置常量

```typescript
// GameConstants.ts
export const GAME_CONFIG = {
    PHYSICS: {
        GRAVITY: { x: 0, y: -320 },
        STEP: 1/60,
        VELOCITY_ITERATIONS: 8,
        POSITION_ITERATIONS: 3
    },
    BALL: {
        DENSITY: 1.0,
        FRICTION: 0.1,
        RESTITUTION: 0.4,
        LINEAR_DAMPING: 0.5,
        ANGULAR_DAMPING: 0.5,
        MAX_SQUEEZE: 0.3,
        SQUEEZE_DECAY: 0.95
    },
    CONTAINER: {
        BORDER_THICKNESS: 10,
        BUFFER_ZONE: 0.8
    },
    WIN: {
        STABLE_TIME: 3.0,
        FILL_RATE_THRESHOLD: 0.8
    },
    VIBRATION: {
        COLLISION_THRESHOLD: 200,
        SQUEEZE_THRESHOLD: 0.4
    },
    COLORS: [
        '#FFB5C5', '#FFDAB9', '#E6E6FA', '#B0E0E6',
        '#FFA07A', '#98FB98', '#DDA0DD', '#F0E68C'
    ]
};
```

---

## 十三、开发里程碑

| 阶段 | 内容 | 交付物 |
|------|------|--------|
| 阶段1 | 项目搭建+基础框架 | Cocos项目、目录结构、核心管理器空实现 |
| 阶段2 | 物理系统+团子实现 | Box2D集成、团子组件、基础拖拽 |
| 阶段3 | 容器系统+关卡加载 | 容器碰撞体生成、JSON解析、1-3关 |
| 阶段4 | 视觉特效+UI完善 | 团子形变、表情、进度条、结算界面 |
| 阶段5 | 震动+分享功能 | 震动管理器、挤压报告生成 |
| 阶段6 | 20关内容填充 | 完整关卡数据、特殊关卡实现 |
| 阶段7 | 测试+优化 | 性能优化、Bug修复、包体积优化 |

---

## 十四、风险与注意事项

| 风险 | 缓解措施 |
|------|----------|
| 微信4MB包限制 | JSON配置减少资源，纹理压缩，按需加载 |
| 软体物理手感难调 | 提前做物理参数调优原型 |
| 特殊关卡性能问题 | 第18-20关单独优化，必要时降低物理精度 |
| 分享图片生成失败 | 降级为纯文字卡片，记录错误日志 |

---

## 十五、20关概览

| 关卡 | 名称 | 容器形状 | 团子数量 | 难度 |
|------|------|----------|----------|------|
| 1 | 初体验 | 正方形 | 1大 | ⭐ |
| 2 | 双球挤挤 | 圆瓶 | 2中 | ⭐ |
| 3 | 横排三杰 | 扁平长方形 | 3中 | ⭐⭐ |
| 4 | 窄口瓶 | 窄口瓶 | 1大1小 | ⭐⭐ |
| 5 | 三角挑战 | 三角形 | 3中 | ⭐⭐ |
| 6 | 弯管 | L型弯管 | 3小 | ⭐⭐⭐ |
| 7 | 甜甜圈 | 圆环 | 4中 | ⭐⭐⭐ |
| 8 | 沙漏 | 沙漏形 | 2大2小 | ⭐⭐⭐ |
| 9 | 十字架 | 十字架 | 5中 | ⭐⭐⭐ |
| 10 | 菱形 | 菱形 | 4大 | ⭐⭐⭐ |
| 11 | 极细试管 | 细长试管 | 5小 | ⭐⭐⭐⭐ |
| 12 | 梯形 | 梯形 | 4中 | ⭐⭐⭐⭐ |
| 13 | 爱心 | 爱心形 | 5小 | ⭐⭐⭐⭐ |
| 14 | 双圈 | 两个独立圆 | 各1大1小 | ⭐⭐⭐⭐ |
| 15 | 五角星 | 五角星 | 5小 | ⭐⭐⭐⭐ |
| 16 | 涂鸦 | 扭曲形状 | 6随机 | ⭐⭐⭐⭐⭐ |
| 17 | 横梁方块 | 带横梁方块 | 5中 | ⭐⭐⭐⭐⭐ |
| 18 | 晃动瓶子 | 移动圆瓶 | 3中 | ⭐⭐⭐⭐⭐ |
| 19 | 漏斗 | 漏斗形 | 1超大4极小 | ⭐⭐⭐⭐⭐ |
| 20 | 双管齐下 | 并排双管 | 2长条 | ⭐⭐⭐⭐⭐ |

---

**文档版本**: 1.0
**最后更新**: 2026-02-15
