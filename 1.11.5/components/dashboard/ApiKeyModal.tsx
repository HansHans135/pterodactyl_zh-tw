import React, { useContext } from 'react';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import asModal from '@/hoc/asModal';
import ModalContext from '@/context/ModalContext';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface Props {
    apiKey: string;
}

const ApiKeyModal = ({ apiKey }: Props) => {
    const { dismiss } = useContext(ModalContext);

    return (
        <>
            <h3 css={tw`mb-6 text-2xl`}>您的 API 金鑰</h3>
            <p css={tw`text-sm mb-6`}>
                下面顯示了您請求的 API 金鑰。請將其存儲在安全的位置，它將不再顯示。
            </p>
            <pre css={tw`text-sm bg-neutral-900 rounded py-2 px-4 font-mono`}>
                <CopyOnClick text={apiKey}>
                    <code css={tw`font-mono`}>{apiKey}</code>
                </CopyOnClick>
            </pre>
            <div css={tw`flex justify-end mt-6`}>
                <Button type={'button'} onClick={() => dismiss()}>
                    關閉
                </Button>
            </div>
        </>
    );
};

ApiKeyModal.displayName = 'ApiKeyModal';

export default asModal<Props>({
    closeOnEscape: false,
    closeOnBackground: false,
})(ApiKeyModal);
