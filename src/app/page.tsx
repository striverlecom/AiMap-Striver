import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Bản Đồ 7 Ngày Thay Đổi Doanh Nghiệp Bằng AI | STRIVER.AI.VN',
  description: 'Tự kiểm toán - Dữ liệu thật - Kết quả thật. Bản đồ hành động 7 ngày xây dựng AI cho doanh nghiệp.',
}

export default function Home() {
  return (
    <div style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* 1. PRE-HEAD / CALL-OUT */}
      <div style={{ backgroundColor: '#111', color: '#fff', textAlign: 'center', padding: '12px 20px', fontSize: '0.9rem', fontWeight: 500, borderBottom: '1px solid #333' }}>
        ⚠️ DÀNH RIÊNG CHO CHỦ DOANH NGHIỆP: Nếu bạn đang bối rối không biết bắt đầu AI từ đâu...
      </div>

      <div className="container" style={{ maxWidth: '850px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* 2. MAIN HEADLINE */}
        <h1 className="home-h1" style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          lineHeight: 1.1, 
          letterSpacing: '-0.04em', 
          textAlign: 'center',
          marginBottom: '24px',
          fontWeight: 800
        }}>
          95% Doanh Nghiệp Thất Bại Vì Nhảy Vào Mua Cố "Tool AI" Mà Không Biết Mình Cần Gì.
        </h1>
        
        {/* 3. SUBHEADLINE */}
        <h2 className="home-h2" style={{ 
          fontSize: '1.4rem', 
          lineHeight: 1.5, 
          fontWeight: 400, 
          color: 'var(--muted)', 
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          Đây là <strong>Tấm Bản Đồ 7 Ngày</strong> duy nhất giúp bạn ép các lỗ hổng của doanh nghiệp lộ diện ra ánh sáng bằng Dữ Liệu Thật — và tìm ra 3 <i>Chiến Thắng Nhanh</i> mang lại <strong>ROI X5 Lần</strong> ngay trong tháng đầu tiên.
        </h2>

        {/* 4. VIDEO SALES LETTER (VSL) in Apple-style Glass Frame */}
        <div style={{ 
          margin: '0 auto 60px', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          background: '#000',
          aspectRatio: '16/9',
          position: 'relative'
        }}>
          <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
          <Script src="https://fast.wistia.com/embed/5rzow3zfkd.js" strategy="afterInteractive" type="module" />
          <style dangerouslySetInnerHTML={{__html: `wistia-player[media-id='5rzow3zfkd']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/5rzow3zfkd/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }`}} />
          
          {/* @ts-ignore */}
          <wistia-player media-id="5rzow3zfkd" aspect="1.7777777777777777" style={{ width: '100%', height: '100%', display: 'block' }}></wistia-player>
        </div>

        {/* 5. AGITATE THE PAIN (Dan Kennedy approach) */}
        <div style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--foreground)' }}>
          <p style={{ marginBottom: '24px' }}><strong>Từ: Striver Le</strong></p>
          
          <p style={{ marginBottom: '24px' }}>Gửi Chủ Doanh Nghiệp,</p>
          
          <p style={{ marginBottom: '24px' }}>
            Bạn nghe mọi người ra rả về AI. Rằng nó làm thay đổi thế giới. Rằng ai không dùng AI sẽ bị đào thải. Và bạn bắt đầu lo sợ.
          </p>

          <p style={{ marginBottom: '24px' }}>
            Bạn rút ví ra, mua gói ChatGPT Plus. Bạn đăng ký vài ba cái tài khoản tạo ảnh, viết bài cho nhân viên. Bạn mong chờ một cú hích kỳ diệu. 
            <strong>Nhưng... vài tuần sau, chẳng có gì thay đổi cả.</strong> 
          </p>

          <p style={{ marginBottom: '40px', fontSize: '1.4rem', fontWeight: 600, color: '#fff' }}>
            ĐÓ KHÔNG PHẢI LỖI CỦA BẠN. ĐÓ LÀ LỖI CỦA CÁCH TIẾP CẬN "MỲ ĂN LIỀN".
          </p>

          <p style={{ marginBottom: '24px' }}>
            Trong quá trình làm việc với hàng chục công ty từ 5 đến 200+ nhân viên, tôi nhận ra một khuôn mẫu chết người: <strong style={{ color: '#fff' }}>Họ cố nhét AI vào quy trình mà không hề dừng lại một nhịp để bắt mạch xem doanh nghiệp ĐANG ĐAU Ở ĐÂU.</strong>
          </p>

          <p style={{ marginBottom: '40px' }}>
            Quy tắc vàng của tôi là: <i>"Kế hoạch AI từ dữ liệu giả sẽ cho ra hướng đi giả. Mà hướng đi giả thì đốt tiền thật."</i> Dưới đây là cách chúng ta sẽ làm đúng.
          </p>

          {/* 6. THE SOLUTION / OFFER DETAILS */}
          <div style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--card-border)', 
            padding: '40px', 
            borderRadius: '24px',
            marginBottom: '60px'
          }}>
            <h3 style={{ fontSize: '2.2rem', marginBottom: '24px', letterSpacing: '-0.03em', textAlign: 'center' }}>
              Bản Đồ 7 Ngày: Hành Động Và Kết Quả Cụ Thể
            </h3>
            
            <p style={{ marginBottom: '32px', color: 'var(--muted)', textAlign: 'center' }}>
              Chỉ mất 30-45 phút mỗi ngày. Trung thực 100%. Đây là những gì bạn sẽ trải qua:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>🚀 Ngày 1: Nhìn Thẳng Sự Thật</h4>
                <p style={{ color: 'var(--muted)', marginBottom: '8px' }}><strong>Hành động:</strong> Tự chấm điểm chỉ số sẵn sàng AI của doanh nghiệp (từ quy trình, nhân sự đến dữ liệu) bằng thang điểm y tế. Khai báo 3 điểm đau lớn nhất đang đốt thì giờ mỗi ngày.</p>
                <p style={{ color: '#32d74b' }}><strong>Kết quả:</strong> Bắt đúng bệnh. Hệ thống trả về bức tranh trần trụi nhất về thực trạng doanh nghiệp, dẹp bỏ mọi sự mơ hồ tốn kém.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>📊 Ngày 2: Mở Tung Sổ Sách</h4>
                <p style={{ color: 'var(--muted)', marginBottom: '8px' }}><strong>Hành động:</strong> Lôi toàn bộ báo cáo doanh thu, quỹ lương nhân sự, và chi phí vận hành ra. Biến cảm giác "hình như đang khó khăn" thành những con số lạnh lùng đanh thép.</p>
                <p style={{ color: '#32d74b' }}><strong>Kết quả:</strong> Có sẵn mọi dữ liệu đầu vào cốt lõi làm mồi nổ để máy tính tự động tính toán ra lợi nhuận quy đổi (ROI) ở Ngày 6.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>🎤 Ngày 3: Bắt Mạch Hiện Trường</h4>
                <p style={{ color: 'var(--muted)', marginBottom: '8px' }}><strong>Hành động:</strong> Điền lời khai thực tế từ nhân sự (những người trực tiếp dọn rác vận hành mỗi ngày). 6 Câu hỏi phỏng vấn chuẩn y khoa giúp moi móc những vấn đề mà sếp không hề hay biết.</p>
                <p style={{ color: '#32d74b' }}><strong>Kết quả:</strong> Tách biệt rạch ròi giữa "Những gì Sếp nghĩ" và "Những gì Nhân viên thực làm". Nơi có sự lệch pha, nơi đó là Mỏ Vàng AI.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>⚙️ Ngày 4: Giải Phẫu Vận Hành</h4>
                <p style={{ color: 'var(--muted)', marginBottom: '8px' }}><strong>Hành động:</strong> Vẽ lại toàn bộ công ty thông qua 3 Động cơ lõi: Tìm Khách (Acquisition), Phục Vụ (Delivery), Chăm Sóc (Support). Đánh dấu mọi điểm nghẽn bằng "Lãng phí Thời gian" hoặc "Rủi ro Lỗi".</p>
                <p style={{ color: '#32d74b' }}><strong>Kết quả:</strong> Tấm bản đồ X-Quang chi tiết lộ rõ những "Cổ chai" ngốn máu doanh nghiệp. Bạn biết chính xác chỗ nào cần đập đi xây lại.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>🎯 Ngày 5: Ma Trận Thanh Trừng</h4>
                <p style={{ color: 'var(--muted)', marginBottom: '8px' }}><strong>Hành động:</strong> Loại bỏ các ý tưởng rác rưởi bằng Ma Trận Ưu Tiên 4 Ô. Tách biệt dự án "Tốn Sức - Ít Tiền" (Bỏ qua) và dự án "Dễ Thay Đổi - Nhanh Thấy Tiền" (Chiến thắng nhanh).</p>
                <p style={{ color: '#32d74b' }}><strong>Kết quả:</strong> Chốt hạ được 3 Dự Án AI cốt tử nhất để triển khai tức thì. Không lan man. Không ảo tưởng.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>💰 Ngày 6: Quy Ra Đô La (Nổi Sưng Da Gà)</h4>
                <p style={{ color: 'var(--muted)', marginBottom: '8px' }}><strong>Hành động:</strong> Nhập dự kiến thời gian cắt giảm nhờ AI. Thuật toán của chúng tôi sẽ kết hợp với Dữ Liệu Ngày 2 để chạy công thức tài chính.</p>
                <p style={{ color: '#32d74b' }}><strong>Kết quả:</strong> Bạn nhìn thấy chính xác số Tiền Lương tiết kiệm được mỗi năm, Số giờ dôi dư, và % Tỷ suất hoàn vốn (ROI) hiển thị bằng Việt Nam Đồng thật.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>🗺️ Ngày 7: Bản Đồ Tác Chiến & Báo Cáo Phân Tích</h4>
                <p style={{ color: 'var(--muted)', marginBottom: '8px' }}><strong>Hành động:</strong> Viết xuống 3 hành động cụ thể cho tuần tới, tháng tới. Chuyển đổi mọi thông tin thành Lộ trình triển khai.</p>
                <p style={{ color: '#32d74b' }}><strong>Kết quả:</strong> Hoàn tất toàn bộ hành trình. Hệ thống tự động xuất Báo Cáo Kiểm Toán AI Toàn Diện — tài liệu chiến lược tối cao của CEO.</p>
              </div>
            </div>
          </div>

          {/* 7. AFTER 7 DAYS RESULTS */}
          <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '30px', fontWeight: 700 }}>
            Sau Đúng 7 Ngày Kỷ Luật, Bạn Cầm Trên Tay Thứ Gì?
          </h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: '0 0 60px 0', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            fontSize: '1.1rem'
          }}>
            <li style={{ paddingLeft: '24px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>🔥</span> Danh sách tuyệt mật các <strong>Cơ hội AI tạo Tác động Tài chính lớn nhất</strong> đang bị ẩn giấu trong cỗ máy của bạn.</li>
            <li style={{ paddingLeft: '24px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>🔥</span> Cuốn <strong>Lộ trình Hành động từng bước</strong> với deadline không thể trốn tránh cho các dự án "Chiến Thắng Nhanh".</li>
            <li style={{ paddingLeft: '24px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>🔥</span> Một <strong>Bảng tính Thu Hồi Vốn (ROI)</strong> bằng VND rõ ràng cho từng giải pháp AI — loại bỏ hoàn toàn sự rủi ro phỏng đoán.</li>
            <li style={{ paddingLeft: '24px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>🔥</span> Sự Tự Tin tuyệt đối — <strong>Bạn không còn e sợ khi đàm phán với bất kỳ Vendor công nghệ nào</strong> vì bạn nắm rõ bản đồ của hệ thống.</li>
          </ul>

          {/* 8. SUCCESS STORIES */}
          <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '30px', fontWeight: 700 }}>
            Bằng Chứng Thật. Con Số Thật.
          </h3>
          <div className="home-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '60px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '16px', color: 'var(--muted)' }}>"Trước kia chúng tôi mua 5 cái thẻ ChatGPT và vứt đó. Nhờ áp dụng tấm bản đồ này, tôi khui ra được nút thắt ở khâu làm Báo Giá. Chỉ bằng 1 thủ thuật tự động hóa, quy trình giảm từ 3 ngày xuống 15 phút, tiết kiệm 120 triệu tiền lương thừa mỗi năm."</p>
              <p style={{ fontWeight: 600 }}>- Anh Dũng (CEO Công Ty Xây Dựng, 40 Nhân Sự)</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '16px', color: 'var(--muted)' }}>"Tôi từng định đổ 300 triệu thuê đơn vị viết phần mềm CRM tích hợp AI. Nhưng khi chạy Ma Trận Ngày 5, tôi nhận ra đó là một dự án 'Tốn Sức - Ít Tiền'. Bản đồ đã giúp tôi quay xe tiết kiệm 300 triệu và chọn 1 công cụ có sẵn chi phí chỉ 1 triệu/tháng!"</p>
              <p style={{ fontWeight: 600 }}>- Chị Mai (Founder Chuỗi Bán Lẻ, 8 Cửa Hàng)</p>
            </div>
          </div>

          {/* 9. THE RISK-FREE GUARANTEE */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(50,215,75,0.1) 0%, rgba(0,0,0,0) 100%)', 
            border: '1px solid #32d74b', 
            padding: '40px', 
            borderRadius: '24px',
            marginBottom: '60px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', color: '#fff' }}>🛡️ Cam Kết "Tấm Khiên Thép": Hoàn Tiền 100% Không Cần Lý Do</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '0' }}>
              Trò chơi này KHÔNG CÓ RỦI RO về phía bạn. Nếu bạn hoàn thành 7 ngày tự kiểm toán nhưng cảm thấy bản đồ này vô dụng và không đem lại giá trị nào để cấu trúc lại AI... <strong>Hãy gửi email cho tôi trong vòng 7 ngày kể từ khi thanh toán</strong>. Tôi sẽ chuyển khoản hoàn trả 100% số tiền 50,000 VNĐ cho bạn. Không hỏi thêm một lời nào. Tiền của bạn — hoặc nó sinh ra tiền cho doanh nghiệp của bạn, hoặc nó quay về ví của bạn. 
            </p>
          </div>

          {/* 10. FAQS */}
          <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '30px', fontWeight: 700 }}>
            Câu Hỏi Thường Gặp
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '60px' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Q: Tôi không rành công nghệ, có làm được không?</p>
              <p style={{ color: 'var(--muted)' }}>A: Hoàn toàn được. Cốt lõi của 7 Ngày là chiến lược Kinh Doanh và Dữ liệu sự thật, không phải lập trình. Hệ thống sẽ tự động ghép dính các mảnh toán học phức tạp cho bạn.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Q: Dữ liệu tài chính tôi tiết lộ có bị đánh cắp không?</p>
              <p style={{ color: 'var(--muted)' }}>A: Toàn bộ dữ liệu bạn nhập được mã hóa và lưu trữ cục bộ. Chúng tôi xây dựng mô hình này dạng "Tự mình kiểm toán", không ai ngoài bạn được xem bảng phân tích của bạn.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Q: Tôi có phải làm xong trong đúng 7 ngày không?</p>
              <p style={{ color: 'var(--muted)' }}>A: Bạn thanh toán 1 lần và truy cập Vĩnh Viễn. Bạn có thể làm xong trong 3 ngày, hoặc trải dài ra vài tuần. Tuy nhiên, tính "kỷ luật 7 ngày" tạo ra áp lực tâm lý để đập vỡ sự trì hoãn của doanh nghiệp.</p>
            </div>
          </div>

          {/* 11. PRICE & FINAL CTA */}
          <p style={{ marginBottom: '24px', textAlign: 'center' }}>
            Một Agency thông thường sẽ lấy của bạn <strong>5.000 USD đến 20.000 USD</strong> chỉ để vẽ ra cho bạn chính xác tấm bản đồ này bằng những thuật ngữ hoa mỹ sáo rỗng.
          </p>

          <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '20px', marginTop: '40px' }}>
            Chi phí để Sở Hữu Cỗ Máy Chẩn Đoán này?
          </h3>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: '20px' }}>500.000 VNĐ</h2>

          <p style={{ marginBottom: '60px', textAlign: 'center', color: 'var(--muted)' }}>
            Chỉ nhỉnh hơn tiền một chầu cà phê, bạn có ngay La Bàn thay đổi vận mệnh công ty. Trả một lần - Truy cập vĩnh viễn. Đừng trả tiền cho vòng luẩn quẩn thử nghiệm thất bại.
          </p>

          <div style={{ textAlign: 'center' }}>
            <Link 
              href="/register" 
              className="cta-btn"
            >
              VÀO MỞ KHÓA BẢN ĐỒ AI NGAY LẬP TỨC (50,000đ)
            </Link>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '20px' }}>🔒 Thanh toán tự động qua QR Code Sepay. Kích hoạt tài khoản ngay trong 3 giây.</p>
          </div>
          
        </div>

      </div>
    </div>
  )
}
