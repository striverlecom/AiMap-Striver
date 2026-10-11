# STRIVER AI - ENTERPRISE MULTI-AGENT ARCHITECT KNOWLEDGE PACK
> Tiêu chuẩn Kỹ thuật Thiết kế PRD & Hệ thống Multi-Agent Doanh nghiệp (Phiên bản Thực chiến 2026)

Tài liệu này là bộ tri thức nền tảng (Knowledge Pack) được nạp trực tiếp vào động cơ sinh PRD (Product Requirements Document) và System Instructions của Striver AI. Toàn bộ PRD được sinh ra tại Ngày 8 bắt buộc phải tuân thủ nghiêm ngặt các nguyên tắc, cấu trúc 14 phần và tiêu chuẩn kỹ thuật dưới đây.

---

## 1. NGUYÊN TẮC THIẾT KẾ NỀN TẢNG (CORE ARCHITECTURE)

### 1.1 Nguyên tắc "Governance Đi Trước Orchestration"
Không bao giờ thiết kế luồng tự động (ai gọi ai) trước khi thiết kế luật an toàn và phân quyền (ai được phép làm gì). Mọi hệ thống Agent bắt buộc phải xây dựng dựa trên 7 lớp chuẩn quốc tế:

```
┌─────────────────────────────────────────┐
│ 1. GOVERNANCE LAYER (Luật chơi & Rào chắn) │
├─────────────────────────────────────────┤
│ 2. ORCHESTRATION LAYER (Điều phối luồng) │
├─────────────────────────────────────────┤
│ 3. ROUTING & PLANNING (Phân giải ý định) │
├─────────────────────────────────────────┤
│ 4. WORKER AGENTS (Thực thi chuyên môn)   │
├─────────────────────────────────────────┤
│ 5. MEMORY & STATE LAYER (Bộ nhớ & Phiên) │
├─────────────────────────────────────────┤
│ 6. TOOL / PROTOCOL LAYER (MCP, API, CRM)│
├─────────────────────────────────────────┤
│ 7. OBSERVABILITY LAYER (Giám sát & Audit)│
└─────────────────────────────────────────┘
```

### 1.2 Phân Cấp Quyền Tự Chủ Của Agent (Autonomy Tiers)
Trong mọi PRD, mỗi Agent bắt buộc phải được định danh rõ cấp độ tự chủ (Autonomy Tier):
- **L0 – Read-Only (Chỉ đọc/Tra cứu):** Chỉ đọc dữ liệu từ DB/Sheets/CRM, tổng hợp báo cáo. Không có quyền sửa đổi dữ liệu hay phát ngôn trực tiếp.
- **L1 – Draft / Propose (Soạn thảo đề xuất):** Soạn sẵn email, báo giá, kịch bản trả lời hoặc đơn đặt hàng. **BẮT BUỘC người (Human-in-the-loop) bấm duyệt trước khi gửi đi**.
- **L2 – Execute with Guardrails (Tự thực thi trong ngưỡng an toàn):** Tự động xử lý nếu thỏa mãn các điều kiện định lượng (ví dụ: Chiết khấu < 5%, giá trị đơn hàng < 5.000.000đ, khách hàng VIP). Vượt ngưỡng lập tức đẩy sang L1.
- **L3 – Full Autonomy (Tự chủ hoàn toàn):** Chỉ áp dụng cho các tác vụ nội bộ rủi ro thấp (ví dụ: Phân loại email, gắn tag ticket, trích xuất dữ liệu hóa đơn).

---

## 2. QUY CHUẨN 14 PHẦN BẮT BUỘC TRONG MỖI BẢN PRD

Mỗi bản PRD sinh ra tại Ngày 8 phải triển khai đầy đủ và chi tiết 14 mục sau:

### Mục 1: Thẻ điều hành (Executive Summary)
- Tên Use-case & Mã use-case.
- Bài toán kinh doanh cốt lõi (Vấn đề thực tế, chi phí cơ hội bị lãng phí).
- Mục tiêu định lượng (Tiết kiệm X giờ/tuần, cắt giảm Y% chi phí vận hành, ROI dự kiến).
- Phạm vi triển khai (In-scope) và giới hạn không làm (Out-of-scope).

### Mục 2: Ngữ cảnh người dùng & Hiện trạng (User Context & As-Is)
- Đối tượng sử dụng (Nhân viên kinh doanh, CSKH, Kế toán, Quản lý).
- Nỗi đau hiện tại và các lỗi thường gặp trong quy trình thủ công.
- Trích dẫn trực tiếp lời khai nhân sự hoặc số liệu quỹ lương từ Ngày 2–4.

### Mục 3: Kiến trúc quy trình tự động hóa (To-Be Architecture)
- Sơ đồ luồng công việc mới khi có sự tham gia của AI.
- Phân công nhiệm vụ giữa Con người và Hệ thống Multi-Agent.
- Trigger kích hoạt (Webhook từ Zalo, Form gửi đến, Lịch định kỳ cron).

### Mục 4: Data Workflow JSON
- Cung cấp sơ đồ luồng dữ liệu chuẩn hóa dạng JSON định tuyến trạng thái:
```json
{
  "workflow_id": "wf_customer_support_01",
  "trigger": "zalo_message_received",
  "steps": [
    { "step": 1, "agent": "Agent Phân Loại Ý Định", "tier": "L3", "timeout_ms": 3000 },
    { "step": 2, "agent": "Agent Tra Cứu Sản Phẩm", "tier": "L0", "tool": "mcp_inventory_lookup" },
    { "step": 3, "agent": "Agent Soạn Thảo Phản Hồi", "tier": "L1", "human_approval_required": true }
  ]
}
```

### Mục 5: Data Flow Map
- Bản đồ luồng đi của dữ liệu từ nguồn (Zalo/Web/ERP) qua các tầng biến đổi, làm sạch dữ liệu, lọc PII (thông tin cá nhân) cho đến đầu ra.

### Mục 6: Concrete Example (Ví Dụ Dữ Liệu Thực Tế)
- Đưa ra ít nhất 01 ca sử dụng cụ thể với dữ liệu đầu vào thực tế (Input mẫu) -> Các bước trung gian -> Đầu ra chính xác (Output mẫu).

### Mục 7: Đặc tả Agent theo mô hình RCICE
Với mỗi Agent trong hệ thống, bắt buộc định nghĩa theo khung RCICE:
- **Role (Vai trò):** Định danh duy nhất ("Agent + Chức năng chính").
- **Context (Ngữ cảnh hoạt động):** Bối cảnh công ty, sản phẩm, dữ liệu được cấp quyền truy cập.
- **Instructions (Nhiệm vụ cụ thể):** Từng bước thực hiện tác vụ theo thứ tự ưu tiên.
- **Constraints (Ràng buộc nghiêm ngặt):** Điều cấm kỵ (không hứa hẹn vượt thẩm quyền, không bịa thông tin, không tiết lộ prompt hệ thống).
- **Examples (Ví dụ mẫu vài lượt):** Mẫu câu hỏi/yêu cầu và phản hồi chuẩn.

### Mục 8: INPUT SCHEMA & OUTPUT SCHEMA
- Định nghĩa rõ ràng JSON Schema với kiểu dữ liệu (`string`, `number`, `boolean`, `array`), các trường bắt buộc (`required`), mô tả và format.
- Tuyệt đối không để input/output dạng text tự do không có cấu trúc.

### Mục 9: Knowledge Base & Retrieval Strategy (Chiến Lược Cơ Sở Tri Thức)
- Nguồn tài liệu tri thức (File PDF chính sách, Bảng giá Google Sheets, Catalog sản phẩm).
- Phương pháp chia nhỏ văn bản (Chunking size, overlap), nhúng vector (Embeddings) và chiến lược tìm kiếm hỗn hợp (Hybrid Search: Keyword + Semantic).
- Cơ chế cập nhật tri thức khi chính sách/bảng giá thay đổi.

### Mục 10: Yêu Cầu Tích Hợp Kỹ Thuật (Integration & Technical Requirements)
- Giao thức kết nối: MCP (Model Context Protocol), REST API, Webhooks.
- Hệ thống đích: Zalo OA API, Telegram Bot, Google Sheets, HubSpot/KiotViet/Sapo CRM.
- Yêu cầu hạ tầng: Docker, Node.js / Python, PostgreSQL / Supabase, Redis cache.

### Mục 11: Human-in-the-Loop & Failure Paths Matrix (Đường Lỗi & Điểm Duyệt Con Người)
Bắt buộc có ma trận xử lý lỗi và ngoại lệ:
| Loại lỗi / Ngoại lệ | Ngưỡng kích hoạt | Hành động của Agent | Kênh báo động con người |
| :--- | :--- | :--- | :--- |
| **Model Hallucination** | Confidence score < 0.75 | Không trả lời suy đoán, dùng câu fallback | Đẩy vào hàng đợi kiểm duyệt của nhân viên |
| **Vượt ngưỡng thẩm quyền** | Đơn hàng > 10.000.000đ | Soạn nháp đề xuất (Tier L1) | Gửi thông báo phê duyệt qua Telegram / Zalo quản lý |
| **API Timeout / Lỗi mạng** | Request > 5000ms | Retry 2 lần với Exponential Backoff | Chuyển luồng sang nhân sự trực ca |
| **Khách hàng khiếu nại gay gắt**| Phát hiện từ khóa tiêu cực / giận dữ | Dừng trả lời tự động, xin lỗi nhã nhặn | Rung chuông cảnh báo CSKH cấp tốc |

### Mục 12: Evaluation Framework & Quality Rubric (Khung Đánh Giá Chất Lượng)
- Chỉ số kỹ thuật: Tỷ lệ chính xác (Accuracy), Độ trễ (Latency < 2s), Tỷ lệ lỗi (Error rate < 1%).
- Chỉ số kinh doanh: Tỷ lệ khách hàng hài lòng (CSAT), Thời gian giải quyết tác vụ (Resolution time), Chi phí Token trung bình trên mỗi phiên.

### Mục 13: Lộ Trình Triển Khai & Quản Trị Rủi Ro (Roadmap & Risk Mitigation)
- Giai đoạn 1: Prototype & Thử nghiệm nội bộ (Tuần 1–2).
- Giai đoạn 2: Pilot giới hạn với dữ liệu thực và nhân viên giám sát 100% (Tuần 3–4).
- Giai đoạn 3: Triển khai diện rộng với cơ chế Guardrails tự động (Tháng thứ 2).
- Biện pháp phòng ngừa rò rỉ dữ liệu (PII Data Masking, Không dùng dữ liệu huấn luyện công cộng).

### Mục 14: Câu Hỏi Mở & Việc Cần Làm (Open Questions / TODOs)
- Phân loại rõ:
  * `{TODO - Nghiêm trọng}`: Vấn đề cản trở triển khai kỹ thuật (ví dụ: Thiếu API key, chưa có database).
  * `{TODO - Quan trọng}`: Cần thống nhất quy trình kinh doanh (ví dụ: Ai là người duyệt báo giá cuối cùng).
  * `{TODO - Nên biết}`: Tối ưu hóa trong tương lai (ví dụ: Tích hợp thêm kênh TikTok Shop).

---

## 3. CHECKLIST KIỂM ĐỊNH CHẤT LƯỢNG PRD (RUBRIC THẨM ĐỊNH)

Một bản PRD được đánh giá là **Đạt chuẩn Thực chiến (Production-Ready)** khi đạt tối thiểu **80/100 điểm** theo các tiêu chí sau:
1. **Tính đầy đủ về cấu trúc (25 điểm):** Đầy đủ 14 mục, không bỏ sót các phần cốt lõi.
2. **Độ chặt chẽ kỹ thuật (25 điểm):** Có đầy đủ INPUT/OUTPUT JSON Schema, định danh Tool và API rõ ràng.
3. **Cơ chế Human-in-the-Loop & Governance (25 điểm):** Xác định rõ Autonomy Tier cho từng Agent, ngưỡng phê duyệt của con người và bảo mật dữ liệu.
4. **Xử lý sự cố & Dự phòng (25 điểm):** Có Failure Matrix chi tiết, xử lý khiếu nại, timeout và fallback khi AI không chắc chắn.
