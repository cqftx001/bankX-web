/**
 * Generate a fresh idempotency key for a transaction operation.
 *
 * 设计动机：
 *   交易类操作（deposit/withdraw/transfer）必须是幂等的——
 *   同一个 key 在后端只会被处理一次，重复提交直接返回首次的结果。
 *
 *   常见的重复提交场景：
 *     1. 用户网络慢，看不到响应，连点了两次"确认"按钮
 *     2. 移动端弱网，请求超时但后端实际已经处理
 *     3. 浏览器自动重试机制
 *
 *   后端用这个 key 在数据库做 unique constraint。
 *   重复 key 触发 DataIntegrityViolationException → 返回首次结果。
 *
 * 为什么前端生成而不是后端生成？
 *   后端生成需要先发一个 "请求 token" 请求，再发真正的交易请求——
 *   两次往返。前端生成只需要一次请求，并且天然防御
 *   "用户狂点按钮但前端没禁用按钮" 的场景。
 *
 * 用 crypto.randomUUID()：
 *   浏览器原生 API，不需要引入 uuid 库。
 *   生成 RFC 4122 v4 UUID，碰撞概率可以忽略。
 *   IE 不支持但我们项目不支持 IE，无所谓。
 */
export function generateIdempotencyKey(): string {
    return crypto.randomUUID();
}