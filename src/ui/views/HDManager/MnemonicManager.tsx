import React from 'react';
import { MainContainer } from './MainContainer';
import { useWallet } from '@/ui/utils';
import { HARDWARE_KEYRING_TYPES } from '@/constant';
import { Modal } from 'antd';
import { ReactComponent as LedgerLogoSVG } from 'ui/assets/walletlogo/ledger.svg';
import { ReactComponent as SettingSVG } from 'ui/assets/setting-outline.svg';
import {
  AdvancedSettings,
  SettingData,
  DEFAULT_SETTING_DATA,
} from './AdvancedSettings';
import { HDPathType } from './HDPathTypeButton';
import { Account } from './AccountList';
import { HDManagerStateContext } from './utils';

export type InitAccounts = {
  [key in HDPathType]: Account[];
};

export const MnemonicManager: React.FC = () => {
  const [visibleAdvanced, setVisibleAdvanced] = React.useState(false);
  const [setting, setSetting] = React.useState<SettingData>(
    DEFAULT_SETTING_DATA
  );
  const [loading, setLoading] = React.useState(false);
  const { getCurrentAccounts, createTask, keyringId } = React.useContext(
    HDManagerStateContext
  );

  const openAdvanced = React.useCallback(() => {
    if (loading) {
      return;
    }
    setVisibleAdvanced(true);
  }, [loading]);

  const onConfirmAdvanced = React.useCallback(async (data: SettingData) => {
    setVisibleAdvanced(false);
    setLoading(true);

    await createTask(() => getCurrentAccounts());
    setSetting(data);
    setLoading(false);
  }, []);

  const fetchCurrentAccounts = React.useCallback(async () => {
    setLoading(true);
    await createTask(() => getCurrentAccounts());
    setSetting({
      ...setting,
      type: HDPathType.Default,
    });
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchCurrentAccounts();
  }, []);

  return (
    <>
      <div className="setting" onClick={openAdvanced}>
        <SettingSVG className="icon" />
        <span className="title">Advanced Settings</span>
      </div>

      <MainContainer setting={setting} loading={loading} HDName="Seed Phrase" />

      <Modal
        destroyOnClose
        className="AdvancedModal"
        title="Custom Address HD path"
        visible={visibleAdvanced}
        centered
        width={840}
        footer={[]}
        onCancel={() => setVisibleAdvanced(false)}
      >
        <AdvancedSettings
          onConfirm={onConfirmAdvanced}
          initSettingData={setting}
        />
      </Modal>
    </>
  );
};
