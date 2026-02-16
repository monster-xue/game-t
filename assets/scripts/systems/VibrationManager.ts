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
        // 实现连续震动模式(胜利时使用)
        const pattern = async () => {
            for (let i = 0; i < 4; i++) {
                VibrationManager.vibrate(VibrateType.MEDIUM);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        };
        pattern();
    }
}
