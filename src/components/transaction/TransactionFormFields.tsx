import { Form, InputNumber, Input } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * Shared Parameters : Amount + Description
 *   - 后续如果加 currency selector、daily limit 提示等，
 */

export function TransactionFormFields() {
    const { t } = useTranslation();
    
    return (
        <>
            <Form.Item
                name="amount"
                label={t('transaction.modal.amountLabel')}
                rules={[
                    { required: true, message: t('transaction.modal.amountRequired') },
                    {
                        validator: (_, value) => {
                          if (value == null || value > 0) {
                            return Promise.resolve();
                          }
                  
                          return Promise.reject(
                            new Error(t('transaction.modal.amountPositive'))
                          );
                        },
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    prefix="$"
                    placeholder={t('transaction.modal.amountPlaceholder')}
                    precision={2}
                    min={0}
                    // step={0.01} 让上下箭头按 1 分钱递增
                    step={0.01}
                />
            </Form.Item>

            <Form.Item
                name="description"
                label={t('transaction.modal.descriptionLabel')}
            >
                <Input.TextArea
                    placeholder={t('transaction.modal.descriptionPlaceholder')}
                    rows={2}
                    maxLength={200}
                    showCount
                />
            </Form.Item>
        </>
    );
}