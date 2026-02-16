// assets/scripts/systems/ShareManager.ts

import { _decorator, Component, Sprite, SpriteFrame, Texture2D, image, sys } from 'cc';

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

                // 绘制容器区域(简化为矩形示意)
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
