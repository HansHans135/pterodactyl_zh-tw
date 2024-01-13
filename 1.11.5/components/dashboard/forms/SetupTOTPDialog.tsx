import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogWrapperContext } from '@/components/elements/dialog';
import getTwoFactorTokenData, { TwoFactorTokenData } from '@/api/account/getTwoFactorTokenData';
import { useFlashKey } from '@/plugins/useFlash';
import tw from 'twin.macro';
import QRCode from 'qrcode.react';
import { Button } from '@/components/elements/button/index';
import Spinner from '@/components/elements/Spinner';
import { Input } from '@/components/elements/inputs';
import CopyOnClick from '@/components/elements/CopyOnClick';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import enableAccountTwoFactor from '@/api/account/enableAccountTwoFactor';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import asDialog from '@/hoc/asDialog';

interface Props {
    onTokens: (tokens: string[]) => void;
}

const ConfigureTwoFactorForm = ({ onTokens }: Props) => {
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<TwoFactorTokenData | null>(null);
    const { clearAndAddHttpError } = useFlashKey('account:two-step');
    const updateUserData = useStoreActions((actions: Actions<ApplicationStore>) => actions.user.updateUserData);

    const { close, setProps } = useContext(DialogWrapperContext);

    useEffect(() => {
        getTwoFactorTokenData()
            .then(setToken)
            .catch((error) => clearAndAddHttpError(error));
    }, []);

    useEffect(() => {
        setProps((state) => ({ ...state, preventExternalClose: submitting }));
    }, [submitting]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (submitting) return;

        setSubmitting(true);
        clearAndAddHttpError();
        enableAccountTwoFactor(value, password)
            .then((tokens) => {
                updateUserData({ useTotp: true });
                onTokens(tokens);
            })
            .catch((error) => {
                clearAndAddHttpError(error);
                setSubmitting(false);
            });
    };

    return (
        <form id={'enable-totp-form'} onSubmit={submit}>
            <FlashMessageRender byKey={'account:two-step'} className={'mt-4'} />
            <div className={'flex items-center justify-center w-56 h-56 p-2 bg-gray-50 shadow mx-auto mt-6'}>
                {!token ? (
                    <Spinner />
                ) : (
                    <QRCode renderAs={'svg'} value={token.image_url_data} css={tw`w-full h-full shadow-none`} />
                )}
            </div>
            <CopyOnClick text={token?.secret}>
                <p className={'font-mono text-sm text-gray-100 text-center mt-2'}>
                    {token?.secret.match(/.{1,4}/g)!.join(' ') || 'Loading...'}
                </p>
            </CopyOnClick>
            <p id={'totp-code-description'} className={'mt-6'}>
                使用您喜歡的兩步驟驗證應用程序掃描上面的 QR 代碼。然後，將生成的 6 位數代碼輸入下面的字段。
            </p>
            <Input.Text
                aria-labelledby={'totp-code-description'}
                variant={Input.Text.Variants.Loose}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                className={'mt-3'}
                placeholder={'000000'}
                type={'text'}
                inputMode={'numeric'}
                autoComplete={'one-time-code'}
                pattern={'\\d{6}'}
            />
            <label htmlFor={'totp-password'} className={'block mt-3'}>
                帳戶密碼
            </label>
            <Input.Text
                variant={Input.Text.Variants.Loose}
                className={'mt-1'}
                type={'password'}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Dialog.Footer>
                <Button.Text onClick={close}>取消</Button.Text>
                <Tooltip
                    disabled={password.length > 0 && value.length === 6}
                    content={
                        !token
                            ? '等待 QR 代碼加載中...'
                            : '您必須輸入 6 位數代碼和密碼以繼續。'
                    }
                    delay={100}
                >
                    <Button
                        disabled={!token || value.length !== 6 || !password.length}
                        type={'submit'}
                        form={'enable-totp-form'}
                    >
                        啟用
                    </Button>
                </Tooltip>
            </Dialog.Footer>
        </form>
    );
};

export default asDialog({
    title: '啟用兩步驟驗證',
    description:
        '幫助保護您的帳戶免受未經授權的訪問。每次登錄時，您都會收到一個驗證碼的提示。',
})(ConfigureTwoFactorForm);
