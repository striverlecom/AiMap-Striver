import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Bản Đồ 7 Ngày Thay Đổi Doanh Nghiệp Bằng AI | STRIVER.AI.VN',
  description: 'Tự kiểm toán - Dữ liệu thật - Kết quả thật. Bản đồ hành động 7 ngày xây dựng AI cho doanh nghiệp.',
}

export default function Home() {
  return (
    <div style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh', paddingBottom: '100px', marginTop: '-16px' }}>

      {/* 1. PRE-HEAD / CALL-OUT */}
      <div style={{ backgroundColor: '#111', color: '#fff', textAlign: 'center', padding: '16px 24px', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '54px' }}>
        ⚠️ DÀNH RIÊNG CHO CHỦ DOANH NGHIỆP ĐANG BỐI RỐI KHÔNG BIẾT BẮT ĐẦU AI TỪ ĐÂU......
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
          Đây Là Bản Đồ Hành Động
          <br/>Cho Doanh Nghiệp Của Bạn.
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
          <strong>7 ngày • Dữ liệu thật • Kết quả thật</strong><br/>
          Không phải lý thuyết. Không phải xu hướng.
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
          <style dangerouslySetInnerHTML={{ __html: `wistia-player[media-id='5rzow3zfkd']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/5rzow3zfkd/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }` }} />

          {/* @ts-ignore */}
          <wistia-player media-id="5rzow3zfkd" aspect="1.7777777777777777" style={{ width: '100%', height: '100%', display: 'block' }}></wistia-player>
        </div>

        {/* 5. AGITATE THE PAIN (Dan Kennedy approach) */}
        <div style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--foreground)' }}>

          <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '30px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
            TẠI SAO BẠN CẦN BẮT ĐẦU HÀNH TRÌNH NÀY?
          </h3>

          <p style={{ marginBottom: '24px' }}>
            Bạn nghe nhiều về AI. Bạn biết nó đang thay đổi mọi thứ. Nhưng bạn không biết bắt đầu từ đâu cho doanh nghiệp của mình. Hoặc bạn đã thử - mua một vài tool, cho nhân viên dùng ChatGPT - nhưng không thấy thay đổi gì rõ rệt. Hoặc bạn thấy đối thủ đang làm gì đó với AI và bạn lo lắng mình sẽ bị bỏ lại phía sau.
          </p>

          <p style={{ marginBottom: '24px' }}>
            Dù lý do là gì, tôi muốn nói thẳng với bạn:
          </p>

          <p style={{ marginBottom: '16px', fontSize: '1.3rem', fontWeight: 600, color: '#fff', textAlign: 'center' }}>
            AI không phải là phép màu. AI không phải là con đường tắt.<br/>
            AI là một CÔNG CỤ - giống như Excel, như CRM, như ERP.
          </p>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '1.2rem', color: '#32d74b', fontWeight: 600, marginBottom: '8px' }}>
              Công cụ đúng + bài toán đúng = kết quả khổng lồ.
            </p>
            <p style={{ fontSize: '1.2rem', color: '#ff453a', fontWeight: 600, margin: 0 }}>
              Công cụ đúng + bài toán SAI = phí tiền.
            </p>
          </div>

          <p style={{ marginBottom: '40px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 600, color: '#0071e3' }}>
            Hành trình này giúp bạn tìm ra BÀI TOÁN ĐÚNG.
          </p>

          <p style={{ marginBottom: '24px' }}>
            Tôi đã làm việc với hàng chục doanh nghiệp - từ startup 5 người đến công ty 200+ nhân viên. Và tôi thấy một khuôn mẫu lặp đi lặp lại:
          </p>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
            SAI LẦM PHỔ BIẾN NHẤT:
          </h3>

          <div style={{ padding: '24px', border: '1px solid #ff453a', borderRadius: '16px', background: 'rgba(255, 69, 58, 0.05)', marginBottom: '30px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0, color: '#ff9f0a' }}>
              Chủ Doanh nghiệp nghe về AI <br/>↓<br/> Mua tool/thuê vendor <br/>↓<br/> Triển khai <br/>↓<br/> <span style={{ color: '#ff453a', fontWeight: 700 }}>Thất bại.</span>
            </p>
          </div>

          <p style={{ marginBottom: '16px' }}>Tại sao? <strong>Vì họ BỎ QUA BƯỚC QUAN TRỌNG NHẤT:</strong></p>
          <p style={{ marginBottom: '32px', fontSize: '1.4rem', fontWeight: 600, color: '#fff' }}>Đó là hiểu rõ vấn đề thực sự của doanh nghiệp.</p>

          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px' }}>
            <li style={{ paddingLeft: '24px', position: 'relative', marginBottom: '12px' }}><span style={{ position: 'absolute', left: 0, color: '#ff453a' }}>✕</span> Họ chữa bệnh mà chưa chẩn đoán.</li>
            <li style={{ paddingLeft: '24px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#ff453a' }}>✕</span> Họ mua thuốc mà chưa biết bị bệnh gì.</li>
          </ul>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            padding: '32px',
            borderRadius: '24px',
            marginBottom: '60px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#fff', margin: 0 }}>
              <strong>Tài liệu này chính là bước “chẩn đoán.”</strong> Nó giúp bạn nhìn thật sâu vào doanh nghiệp của mình, tìm ra chính xác đâu là những nơi AI có thể tạo ra thay đổi THẬT SỰ, và xây dựng một kế hoạch hành động dựa trên dữ liệu của chính bạn.
            </p>
          </div>

          <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '24px', fontWeight: 700, color: '#fff' }}>
            CÁCH HÀNH TRÌNH GIÚP BẠN ĐẠT HIỆU QUẢ
          </h3>
          <p style={{ textAlign: 'center', marginBottom: '40px', color: '#a1a1a6' }}>
            Mỗi ngày mất 30-45 phút. Không cần chuyên môn kỹ thuật. Chỉ cần:
          </p>

          <div className="home-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '60px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🤫</div>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>1. Sự thành thật</h4>
              <p style={{ color: '#a1a1a6', fontSize: '0.95rem' }}>Không tô hồng, không giấu vấn đề.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📊</div>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>2. Dữ liệu thật</h4>
              <p style={{ color: '#a1a1a6', fontSize: '0.95rem' }}>Số từ báo cáo, không phải “khoảng.”</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>3. 7 ngày liên tục</h4>
              <p style={{ color: '#a1a1a6', fontSize: '0.95rem' }}>Mỗi ngày nối tiếp ngày trước. Bỏ 1 ngày = mất nền.</p>
            </div>
          </div>

          <p style={{ marginBottom: '24px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>
            Tôi cần bạn hiểu điều này rất rõ:
          </p>
          <p style={{ marginBottom: '50px', color: '#a1a1a6', textAlign: 'center', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 50px' }}>
            Đây là HÀNH TRÌNH để LÀM THỰC TẾ TẠO KẾT QUẢ THẬT. Mỗi ngày có bài tập. Mỗi bài tập yêu cầu bạn lôi dữ liệu thực của công ty ra. Không có chuyện “làm cho biết.” Nếu bạn chỉ lướt qua mà không làm, bạn sẽ không có gì sau 7 ngày.
          </p>


          {/* 7. AFTER 7 DAYS RESULTS */}
          <div style={{ background: 'linear-gradient(180deg, rgba(20,20,22,1) 0%, rgba(10,10,10,1) 100%)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '40px', fontWeight: 700, color: '#fff' }}>
              Nhưng nếu bạn làm nghiêm túc, sau 7 ngày bạn sẽ có:
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 40px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              fontSize: '1.15rem'
            }}>
              <li style={{ paddingLeft: '32px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#32d74b' }}>✔</span> <strong>Bức tranh toàn cảnh</strong> về hiệu quả vận hành của Doanh nghiệp</li>
              <li style={{ paddingLeft: '32px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#32d74b' }}>✔</span> Danh sách cụ thể các <strong>cơ hội AI có tác động cao</strong></li>
              <li style={{ paddingLeft: '32px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#32d74b' }}>✔</span> Con số <strong>ROI</strong> tính từ lương và giờ làm thật của công ty</li>
              <li style={{ paddingLeft: '32px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#32d74b' }}>✔</span> Lộ trình hành động với <strong>deadline cụ thể</strong></li>
              <li style={{ paddingLeft: '32px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: '#32d74b' }}>✔</span> <strong>Sự tự tin</strong> để nói chuyện với vendor AI bất kỳ</li>
            </ul>

            <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#a1a1a6', margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>
              "Đó là những thứ mà nhiều công ty phải trả 5,000–20,000 USD cho một đội tư vấn AI để có được. Bạn sẽ tự làm được với hành trình này."
            </p>
          </div>

          {/* 11. PRICE & FINAL CTA */}
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
