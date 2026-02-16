# 《往死里挤》性能优化指南

> 本文档提供性能优化建议和最佳实践

---

## 一、DrawCall 优化

### 1.1 图集合并

**目标**: DrawCall < 20

**实施方案**:
- 将所有团子的 Sprite 合并到同一张图集
- 使用 Cocos Creator 的自动图集功能:
  1. 在 `assets/resources` 下创建 `atlas` 文件夹
  2. 配置 Auto Atlas 组件
  3. 将团子纹理拖入图集

**验证方法**:
```typescript
// 在开发时查看控制台
profiler.showStats();
```

---

## 二、物理性能优化

### 2.1 物理步进频率

当前配置 (GameConstants.ts):
```typescript
PHYSICS: {
    GRAVITY: { x: 0, y: -320 },
    STEP: 1/60,              // 60Hz
    VELOCITY_ITERATIONS: 8,
    POSITION_ITERATIONS: 3
}
```

**优化建议**:
- 60Hz 已是合理值,无需调整
- 团子数量 > 10 时,可降低迭代次数:
  - `VELOCITY_ITERATIONS: 6`
  - `POSITION_ITERATIONS: 2`

### 2.2 碰撞层级

**优化方案**: 使用碰撞矩阵,避免不必要的碰撞检测

```typescript
// 在项目设置中配置碰撞矩阵
Layer 1: Ball
Layer 2: Container

只检测 Ball-Container 和 Ball-Ball 碰撞
```

### 2.3 休眠未移动的团子

```typescript
// 在 Ball.ts 中添加
if (speed < 5 && !this.isDragging) {
    this.rigidBody.sleep();
}
```

---

## 三、内存优化

### 3.1 对象池使用

**已实现**: `ObjectPool.ts`

**使用方法**:
```typescript
// 在 BallManager 中
const pool = this.node.getComponent(ObjectPool);
pool.init(ballPrefab, 5, 50);

const ballNode = pool.acquire();
// 使用...
pool.release(ballNode);
```

### 3.2 纹理压缩

**微信小游戏推荐格式**:
- 使用 **ASTC** 或 **ETC2** 格式
- 在构建设置中启用纹理压缩

**步骤**:
1. 打开 `项目设置 → 项目数据预览`
2. 勾选 `压缩纹理`
3. 选择 `ASTC 4x4`

### 3.3 音频资源

**建议**: 本游戏无音频,无需优化

---

## 四、渲染优化

### 4.1 减少实时计算

当前问题: `BallManager.updateDeformations()` 每帧计算所有团子

**优化方案**:
```typescript
// 只计算速度大于阈值的团子
if (speed > 50) {
    this.calculateDeformation(ball);
}
```

### 4.2 批量渲染

**优化方案**: 使用 **Graphics** 组件绘制容器边框,而非多个 Sprite

**已实现**: `ContainerManager.ts` 中的 `createBorderVisual()`

---

## 五、包体积优化

### 5.1 目标

微信小游戏包限制: **4MB**

### 5.2 优化措施

1. **代码压缩混淆**
   ```json
   // 构建时启用
   {
     "minify": true,
     "obfuscate": true
   }
   ```

2. **移除未使用资源**
   - 删除 `assets/resources` 下的示例资源
   - 清理未使用的场景

3. **分包加载**
   - 将关卡数据放到分包
   - 主包仅保留核心代码

4. **远程资源**
   - 将贴图放到 CDN
   - 运行时动态加载

### 5.3 验证包体积

```bash
# 构建后查看
cd build/wechatgame
du -sh .
```

---

## 六、帧率优化

### 6.1 目标

稳定 **60 FPS**

### 6.2 监控

```typescript
// 在 GameManager 中添加
update(dt: number) {
    const fps = 1 / dt;

    if (fps < 55) {
        console.warn(`Low FPS: ${fps.toFixed(1)}`);
    }
}
```

### 6.3 降级策略

当帧率 < 50 时:
1. 减少形变计算
2. 降低物理迭代次数
3. 禁用粒子效果

---

## 七、特殊关卡优化

### 7.1 第18关 (移动容器)

**潜在问题**: 容器移动可能导致物理计算量增加

**优化方案**:
```typescript
// 降低移动频率
containerMovement: {
    period: 2.0  // 2秒一个周期
}
```

### 7.2 第20关 (长条团子)

**潜在问题**: 链式刚体计算复杂

**优化方案**:
- 限制段数 ≤ 5
- 使用固定关节而非距离关节

---

## 八、性能分析工具

### 8.1 Cocos Creator 内置

- **性能分析器**: `Ctrl/Cmd + P`
- **帧率图**: 实时查看 FPS

### 8.2 微信开发者工具

- **性能面板**: 查看 CPU/内存使用
- **Audits**: 性能评分

### 8.3 真机测试

**必测设备**:
- iPhone 6 (低端)
- iPhone 12 (中端)
- iPhone 14 Pro (高端)

---

## 九、优化清单

### 发布前必检项

- [ ] DrawCall < 20
- [ ] 稳定 60 FPS (低端设备)
- [ ] 包体积 < 4MB
- [ ] 无内存泄漏
- [ ] 对象池正常工作
- [ ] 纹理已压缩
- [ ] 物理迭代次数合理
- [ ] 碰撞矩阵配置正确

---

## 十、常见问题

### Q1: 包体积超过 4MB

**解决方案**:
1. 移除未使用资源
2. 启用代码混淆
3. 使用分包加载
4. 将大资源放到 CDN

### Q2: 帧率不稳定

**排查步骤**:
1. 查看性能分析器,定位瓶颈
2. 检查是否有大量对象创建/销毁
3. 减少物理迭代次数
4. 简化团子形变计算

### Q3: 内存持续增长

**排查步骤**:
1. 确认对象池正常工作
2. 检查事件监听是否正确移除
3. 查看 `onDestroy()` 是否释放资源

---

**文档版本**: 1.0
**最后更新**: 2026-02-15
