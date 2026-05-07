export const en = {
  common: {
      appName: 'BankX',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      retry: 'Retry',
      create: 'Create',
  },
  nav: {
      dashboard: 'Dashboard',
      accounts: 'Accounts',
      transactions: 'Transactions',
      profile: 'Profile',
      logout: 'Logout',
  },
  auth: {
      login: {
          title: 'Sign in to your account',
          email: 'Email',
          password: 'Password',
          emailRequired: 'Please enter your email',
          emailInvalid: 'Invalid email format',
          passwordRequired: 'Please enter your password',
          submit: 'Sign In',
          noAccount: 'New to BankX?',
          register: 'Create an account',
          failed: 'Login failed. Please try again.',
          emailPlaceholder: 'your@email.com',
      },
  },
  dashboard: {
      welcome: 'Welcome back, {{email}}',
      subtitle: "Here's a snapshot of your accounts and recent activity.",
      totalBalance: 'Total Balance',
      activeAccounts: 'Active Accounts',
      monthlyTransactions: "This Month's Transactions",
  },
  account: {
      openNew: 'Open New Account',
      totalBalance: 'Total Balance',
      activeAccounts: 'Active Accounts',
      balance: 'Balance',
      empty: 'No accounts yet. Open your first account to get started!',
      loadFailed: 'Failed to load accounts',
      // 开户 Modal
      create: {
          title: 'Open New Account',
          typeLabel: 'Account Type',
          typeRequired: 'Please select an account type',
          typePlaceholder: 'Select account type',
          saving: 'Savings — Earn interest on deposits',
          checking: 'Checking — Daily transactions',
          credit: 'Credit — Borrow and repay',
      },
      // 账户类型展示名
      type: {
          SAVING: 'Savings',
          CHECKING: 'Checking',
          CREDIT: 'Credit',
      },
      // 日期前缀
      opened: 'Opened {{date}}',
  },
  transaction: {
    title: 'Transactions',
    // 顶部三个按钮
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    transfer: 'Transfer',
    // Demo 提示条
    demoBannerTitle: 'Demo mode',
    demoBannerDesc: 'In production, deposits and withdrawals typically go through ATM, mobile check deposit, or ACH integrations. They are enabled here for end-to-end testing.',
    // 筛选面板
    filter: 'Filter',
    filterClear: 'Clear',
    filterApply: 'Apply',
    filterAccount: 'Account',
    filterAccountPlaceholder: 'All accounts',
    filterType: 'Type',
    filterTypePlaceholder: 'All types',
    filterStatus: 'Status',
    filterStatusPlaceholder: 'All statuses',
    filterDateRange: 'Date range',
    filterAmountMin: 'Min amount',
    filterAmountMax: 'Max amount',
    // 列表
    empty: 'No transactions found.',
    loadFailed: 'Failed to load transactions',
    // 卡片字段
    fromAccount: 'From',
    toAccount: 'To',
    balanceAfter: 'Balance after',
    // 类型展示名
    type: {
        DEPOSIT: 'Deposit',
        WITHDRAW: 'Withdraw',
        TRANSFER: 'Transfer',
        REVERSAL: 'Reversal',
    },
    // 状态展示名
    status: {
        PENDING: 'Pending',
        COMPLETED: 'Completed',
        FAILED: 'Failed',
        REVERSED: 'Reversed',
        CANCELED: 'Canceled',
        REFUNDED: 'Refunded',
    },
    // Modal
    modal: {
        depositTitle: 'Deposit Money',
        withdrawTitle: 'Withdraw Money',
        transferTitle: 'Transfer Money',
        accountLabel: 'Account',
        accountPlaceholder: 'Select an account',
        accountRequired: 'Please select an account',
        fromAccountLabel: 'From account',
        toAccountLabel: 'To account',
        toAccountPlaceholder: 'Select destination account',
        sameAccountError: 'From and To must be different accounts',
        amountLabel: 'Amount',
        amountPlaceholder: '0.00',
        amountRequired: 'Please enter an amount',
        amountPositive: 'Amount must be greater than 0',
        currencyLabel: 'Currency',
        descriptionLabel: 'Description (optional)',
        descriptionPlaceholder: 'What is this for?',
        submit: 'Confirm',
        success: 'Transaction completed successfully',
    },
  }
};

export type TranslationKeys = typeof en;