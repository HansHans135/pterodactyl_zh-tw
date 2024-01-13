import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import reinstallServer from '@/api/server/reinstallServer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import { Dialog } from '@/components/elements/dialog';

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [modalVisible, setModalVisible] = useState(false);
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const reinstall = () => {
        clearFlashes('settings');
        reinstallServer(uuid)
            .then(() => {
                addFlash({
                    key: 'settings',
                    type: 'success',
                    message: '您的伺服器已開始重新安裝過程。',
                });
            })
            .catch((error) => {
                console.error(error);

                addFlash({ key: 'settings', type: 'error', message: httpErrorToHuman(error) });
            })
            .then(() => setModalVisible(false));
    };

    useEffect(() => {
        clearFlashes();
    }, []);

    return (
        <TitledGreyBox title={'重新安裝伺服器'} css={tw`relative`}>
            <Dialog.Confirm
                open={modalVisible}
                title={'確認重新安裝伺服器'}
                confirm={'是的，重新安裝伺服器'}
                onClose={() => setModalVisible(false)}
                onConfirmed={reinstall}
            >
                在此過程中，您的伺服器將被停止，並且可能會刪除或修改一些文件，您確定要繼續嗎？
            </Dialog.Confirm>
            <p css={tw`text-sm`}>
                重新安裝伺服器將停止它，然後重新運行最初設定它的安裝腳本。&nbsp;
                <strong css={tw`font-medium`}>
                    在此過程中，可能會刪除或修改一些文件，請在繼續之前備份您的數據。
                </strong>
            </p>
            <div css={tw`mt-6 text-right`}>
                <Button.Danger variant={Button.Variants.Secondary} onClick={() => setModalVisible(true)}>
                    重新安裝伺服器
                </Button.Danger>
            </div>
        </TitledGreyBox>
    );
};
