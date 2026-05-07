import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { useTranslation } from 'react-i18next';
import 'antd/dist/reset.css';
import './index.css';
import './i18n';     // 🆕 初始化 i18n
import App from './App.tsx';

function AppWithLocale() {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'zh' ? zhCN : enUS;

  return (
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithLocale />
  </StrictMode>,
);