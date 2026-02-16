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

    // 团子颜色(马卡龙色系)
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
