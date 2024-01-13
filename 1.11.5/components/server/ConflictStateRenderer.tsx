import React from 'react';
import { ServerContext } from '@/state/server';
import ScreenBlock from '@/components/elements/ScreenBlock';
import ServerInstallSvg from '@/assets/images/server_installing.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';

export default () => {
    const status = ServerContext.useStoreState((state) => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data?.isTransferring || false);
    const isNodeUnderMaintenance = ServerContext.useStoreState(
        (state) => state.server.data?.isNodeUnderMaintenance || false
    );

    return status === 'installing' || status === 'install_failed' || status === 'reinstall_failed' ? (
        <ScreenBlock
            title={'正在運行安裝程序'}
            image={ServerInstallSvg}
            message={'您的服務器應該很快就會準備好，請稍後再試。'}
        />
    ) : status === 'suspended' ? (
        <ScreenBlock
            title={'服務器已暫停'}
            image={ServerErrorSvg}
            message={'此服務器已暫停，無法訪問。'}
        />
    ) : isNodeUnderMaintenance ? (
        <ScreenBlock
            title={'節點維護中'}
            image={ServerErrorSvg}
            message={'此服務器的節點目前正在維護中。'}
        />
    ) : (
        <ScreenBlock
            title={isTransferring ? '轉移中' : '正在從備份中還原'}
            image={ServerRestoreSvg}
            message={
                isTransferring
                    ? '您的服務器正在轉移到新節點，請稍後再來檢查。'
                    : '您的服務器目前正在從備份中還原，請在幾分鐘後再來檢查。'
            }
        />
    );
};
