import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import CountdownTimer from './components/countdown-timer';

export const metadata: Metadata = {
  title: 'Bản Đồ 7 Ngày Thay Đổi Doanh Nghiệp Bằng AI | STRIVER.AI.VN',
  description: 'Tự kiểm toán - Dữ liệu thật - Kết quả thật. Bản đồ hành động 7 ngày xây dựng AI cho doanh nghiệp.',
}

export default function Home() {
  return (
    <div style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh', paddingBottom: '100px', marginTop: '-16px' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .apple-3d-card {
          position: relative;
        }
        .apple-3d-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2) !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
      `}} />

      {/* 1. PRE-HEAD / CALL-OUT */}
      <div style={{ backgroundColor: '#111', color: '#fff', textAlign: 'center', padding: '16px 24px', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '54px' }}>
        🔥 DÀNH RIÊNG CHO CHỦ DOANH NGHIỆP KHÔNG BIẾT BẮT ĐẦU AI TỪ ĐÂU...🔥
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
          <br />AI Cho Doanh Nghiệp Của Bạn Trong Năm 2026.
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
          <strong>7 ngày hành động thật • Dữ liệu thật • Kết quả thật</strong><br />
          Không phải lý thuyết. Không phải xu hướng. Đừng trả tiền cho thử nghiệm AI nữa, hãy trả tiền cho kết quả.
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

        {/* CTA BUTTON UNDER VIDEO */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Link href="/register" className="cta-btn" style={{ fontSize: '1.2rem', padding: '20px 48px', margin: '0 auto', display: 'inline-block' }}>
            Truy Cập Bản Đồ Ngay Lập Tức
          </Link>
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
            AI không phải là phép màu. AI không phải là con đường tắt.<br />
            AI là một CÔNG CỤ - giống như Excel, như CRM, như ERP.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600, marginBottom: '8px' }}>
              Công cụ đúng + bài toán đúng = Kết quả khổng lồ.
            </p>
            <p style={{ fontSize: '1.2rem', color: '#86868b', fontWeight: 600, margin: 0 }}>
              Công cụ đúng + bài toán SAI = Phí tiền.
            </p>
          </div>

          <p style={{ marginBottom: '40px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 600, color: '#f5f5f7' }}>
            Hành trình này giúp bạn tìm ra BÀI TOÁN ĐÚNG.
          </p>

          <p style={{ marginBottom: '24px' }}>
            Tôi đã làm việc với hàng chục doanh nghiệp - từ startup 5 người đến công ty 200+ nhân viên. Và tôi thấy một khuôn mẫu lặp đi lặp lại:
          </p>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
            SAI LẦM PHỔ BIẾN NHẤT:
          </h3>

          <div style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.05)', marginBottom: '30px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0, color: '#d2d2d7' }}>
              Chủ Doanh nghiệp nghe về AI <br />↓<br /> Mua tool / thuê vendor <br />↓<br /> Triển khai <br />↓<br /> <span style={{ color: '#fff', fontWeight: 700 }}>Thất bại.</span>
            </p>
          </div>

          <p style={{ marginBottom: '16px' }}>Tại sao? <strong>Vì họ BỎ QUA BƯỚC QUAN TRỌNG NHẤT:</strong></p>
          <p style={{ marginBottom: '32px', fontSize: '1.4rem', fontWeight: 600, color: '#fff' }}>Đó là hiểu rõ vấn đề thực sự của doanh nghiệp.</p>

          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px' }}>
            <li style={{ paddingLeft: '24px', position: 'relative', marginBottom: '12px', color: '#a1a1a6' }}><span style={{ position: 'absolute', left: 0, color: '#86868b' }}>✕</span> Họ chữa bệnh mà chưa chẩn đoán.</li>
            <li style={{ paddingLeft: '24px', position: 'relative', color: '#a1a1a6' }}><span style={{ position: 'absolute', left: 0, color: '#86868b' }}>✕</span> Họ mua thuốc mà chưa biết bị bệnh gì.</li>
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
              <strong>Hành trình này chính là bước “chẩn đoán.”</strong> Nó giúp bạn nhìn thật sâu vào doanh nghiệp của mình, tìm ra chính xác đâu là những nơi AI có thể tạo ra thay đổi THẬT SỰ, và xây dựng một kế hoạch hành động dựa trên dữ liệu của chính bạn.
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
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>3. Hành động thật</h4>
              <p style={{ color: '#a1a1a6', fontSize: '0.95rem' }}>Mỗi ngày nối tiếp ngày trước. Bỏ 1 ngày = mất nền.</p>
            </div>
          </div>

          <p style={{ marginBottom: '40px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>
            Tôi cần bạn hiểu điều này rất rõ:
          </p>
          <p style={{ marginBottom: '60px', color: '#a1a1a6', textAlign: 'center', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 50px' }}>
            Đây là HÀNH TRÌNH để LÀM THỰC TẾ TẠO KẾT QUẢ THẬT. Mỗi ngày có bài tập. Mỗi bài tập yêu cầu bạn lôi dữ liệu thực của công ty ra. Không có chuyện “làm cho biết.” Nếu bạn chỉ lướt qua mà không làm, bạn sẽ không có gì sau 7 ngày.
          </p>

          {/* 6.5. 5-STAGE TRANSFORMATION PROCESS */}
          <div style={{ marginBottom: '80px', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '40px', fontWeight: 700, color: '#f5f5f7' }}>
              Quy Trình Chuyển Hóa Cốt Lõi Của Hành Trình
            </h3>

            {/* Desktop Horizontal Flex, Mobile Vertical */}
            <div className="process-flow" style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>

              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #000)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>1</div>
                <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Thu Thập<br />Dữ Liệu</p>
                <p style={{ color: '#a1a1a6', fontSize: '0.85rem', marginTop: '8px' }}>Nội bộ doanh nghiệp</p>
              </div>

              <div className="flow-arrow" style={{ color: '#555', fontSize: '1.5rem' }}>➔</div>

              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #000)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>2</div>
                <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Nhận Diện<br />Cơ Hội</p>
                <p style={{ color: '#a1a1a6', fontSize: '0.85rem', marginTop: '8px' }}>Chuyển hóa dữ liệu</p>
              </div>

              <div className="flow-arrow" style={{ color: '#555', fontSize: '1.5rem' }}>➔</div>

              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #000)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>3</div>
                <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Ma Trận<br />Ưu Tiên</p>
                <p style={{ color: '#a1a1a6', fontSize: '0.85rem', marginTop: '8px' }}>Lọc dự án Tốn Sức</p>
              </div>

              <div className="flow-arrow" style={{ color: '#555', fontSize: '1.5rem' }}>➔</div>

              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #000)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>4</div>
                <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Xây Dựng<br />Lộ Trình</p>
                <p style={{ color: '#a1a1a6', fontSize: '0.85rem', marginTop: '8px' }}>Kế hoạch thực thi</p>
              </div>

              <div className="flow-arrow" style={{ color: '#555', fontSize: '1.5rem' }}>➔</div>

              <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #444, #111)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px', color: '#fff', boxShadow: '0 0 15px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.4)' }}>5</div>
                <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Hoàn Vốn<br />Tài Chính (ROI)</p>
                <p style={{ color: '#d2d2d7', fontSize: '0.85rem', marginTop: '8px' }}>Mục tiêu tối thượng</p>
              </div>

            </div>

            <style dangerouslySetInnerHTML={{
              __html: `
              @media (max-width: 768px) {
                .process-flow { flex-direction: column !important; gap: 24px !important; }
                .flow-arrow { transform: rotate(90deg); margin: 8px 0; }
              }
            `}} />
          </div>

          {/* 7. DAY BY DAY BREAKDOWN */}
          <div style={{ marginBottom: '80px' }}>
            <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '16px', fontWeight: 800, color: '#fff' }}>
              Bản Đồ 7 Ngày: Hành Động Và Kết Quả
            </h3>
            <p style={{ textAlign: 'center', color: '#a1a1a6', marginBottom: '40px', fontSize: '1.1rem' }}>
              Chỉ mất 30-45 phút mỗi ngày. Trung thực 100%. Kế hoạch AI từ dữ liệu giả sẽ cho ra hướng đi giả. Mà hướng đi giả thì đốt tiền thật. Đây là những gì bạn sẽ trải qua:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Day 1 */}
              <div
                className="apple-3d-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(20,20,20,0.8) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '24px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>NGÀY 1 : Nhìn Thẳng Sự Thật</h4>
                  <p style={{ color: '#a1a1a6', marginBottom: '12px', lineHeight: 1.6 }}><strong>Hành động:</strong> Tự chấm điểm chỉ số sẵn sàng AI của doanh nghiệp (từ quy trình, nhân sự đến dữ liệu) bằng thang điểm. Khai báo 3 điểm đau lớn nhất đang đốt thì giờ mỗi ngày.</p>
                  <p style={{ color: '#f5f5f7', margin: 0, fontWeight: 500 }}><strong>Kết quả:</strong> Bắt đúng bệnh. Hệ thống trả về bức tranh trần trụi nhất về thực trạng doanh nghiệp, dẹp bỏ mọi sự mơ hồ tốn kém.</p>
                </div>
              </div>

              {/* Day 2 */}
              <div
                className="apple-3d-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(20,20,20,0.8) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '24px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>NGÀY 2 : Mở Tung Sổ Sách</h4>
                  <p style={{ color: '#a1a1a6', marginBottom: '12px', lineHeight: 1.6 }}><strong>Hành động:</strong> Lôi toàn bộ báo cáo doanh thu, quỹ lương nhân sự, và chi phí vận hành ra. Biến cảm giác "hình như đang khó khăn" thành những con số lạnh lùng đanh thép.</p>
                  <p style={{ color: '#f5f5f7', margin: 0, fontWeight: 500 }}><strong>Kết quả:</strong> Có sẵn mọi dữ liệu đầu vào cốt lõi làm mồi nổ để máy tính tự động tính toán ra lợi nhuận quy đổi (ROI) ở Ngày 6.</p>
                </div>
              </div>

              {/* Day 3 */}
              <div
                className="apple-3d-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(20,20,20,0.8) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '24px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>NGÀY 3 : Bắt Mạch Hiện Trường</h4>
                  <p style={{ color: '#a1a1a6', marginBottom: '12px', lineHeight: 1.6 }}><strong>Hành động:</strong> Điền lời khai thực tế từ nhân sự (những người trực tiếp dọn rác vận hành mỗi ngày). Trả lời các câu hỏi phỏng vấn chuẩn y khoa giúp moi móc những vấn đề mà sếp không hề hay biết.</p>
                  <p style={{ color: '#f5f5f7', margin: 0, fontWeight: 500 }}><strong>Kết quả:</strong> Tách biệt rạch ròi giữa "Những gì Sếp nghĩ" và "Những gì Nhân viên thực làm". Nơi có sự lệch pha, nơi đó là Mỏ Vàng AI.</p>
                </div>
              </div>

              {/* Day 4 */}
              <div
                className="apple-3d-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(20,20,20,0.8) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '24px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>NGÀY 4 : Giải Phẫu Vận Hành</h4>
                  <p style={{ color: '#a1a1a6', marginBottom: '12px', lineHeight: 1.6 }}><strong>Hành động:</strong> Vẽ lại toàn bộ công ty thông qua 3 Động cơ lõi: Tìm Khách (Acquisition), Phục Vụ (Delivery), Chăm Sóc (Support). Đánh dấu mọi điểm nghẽn bằng "Lãng phí Thời gian" hoặc "Rủi ro Lỗi".</p>
                  <p style={{ color: '#f5f5f7', margin: 0, fontWeight: 500 }}><strong>Kết quả:</strong> Tấm bản đồ X-Quang chi tiết lộ rõ những "Cổ chai" ngốn máu doanh nghiệp. Bạn biết chính xác chỗ nào cần đập đi xây lại.</p>
                </div>
              </div>

              {/* Day 5 */}
              <div
                className="apple-3d-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(20,20,20,0.8) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '24px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>NGÀY 5 : Ma Trận Ưu Tiên</h4>
                  <p style={{ color: '#a1a1a6', marginBottom: '12px', lineHeight: 1.6 }}><strong>Hành động:</strong> Loại bỏ các ý tưởng rác rưởi bằng Ma Trận Ưu Tiên 4 Ô. Tách biệt dự án "Tốn Sức - Ít Tiền" (Bỏ qua) và dự án "Dễ Thay Đổi - Nhanh Thấy Tiền" (Chiến thắng nhanh).</p>
                  <p style={{ color: '#f5f5f7', margin: 0, fontWeight: 500 }}><strong>Kết quả:</strong> Chốt hạ được Dự Án AI cốt tử nhất để triển khai tức thì. Không lan man. Không ảo tưởng.</p>
                </div>
              </div>

              {/* Day 6 */}
              <div
                className="apple-3d-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(20,20,20,0.8) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '24px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>NGÀY 6 : Quy Ra Đô La</h4>
                  <p style={{ color: '#a1a1a6', marginBottom: '12px', lineHeight: 1.6 }}><strong>Hành động:</strong> Nhập dự kiến thời gian cắt giảm nhờ AI. Thuật toán của chúng tôi sẽ kết hợp với Dữ Liệu Ngày 2 để chạy công thức tài chính.</p>
                  <p style={{ color: '#f5f5f7', margin: 0, fontWeight: 500 }}><strong>Kết quả:</strong> Bạn nhìn thấy chính xác số Tiền Lương tiết kiệm được mỗi năm, Số giờ dôi dư, và % Tỷ suất hoàn vốn (ROI) hiển thị bằng hiện kim.</p>
                </div>
              </div>

              {/* Day 7 */}
              <div
                className="apple-3d-card"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(10,10,12,0.9) 100%)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderTop: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '24px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #fff, #86868b)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(255,255,255,0.06), transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', fontWeight: 700 }}>NGÀY 7 : Bản Đồ Tác Chiến & Báo Cáo Phân Tích</h4>
                  <p style={{ color: '#a1a1a6', marginBottom: '12px', lineHeight: 1.6 }}><strong>Hành động:</strong> Viết xuống 3 hành động cụ thể cho tuần tới, tháng tới. Chuyển đổi mọi thông tin thành Lộ trình triển khai.</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}><strong>Kết quả:</strong> Hoàn tất toàn bộ hành trình. Hệ thống tự động xuất Báo Cáo Tổng Thể — Hành động chiến lược dành riêng cho CEO.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(180deg, rgba(20,20,22,1) 0%, rgba(10,10,10,1) 100%)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '80px' }}>
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
              <li style={{ paddingLeft: '32px', position: 'relative', color: '#d2d2d7' }}><span style={{ position: 'absolute', left: 0, color: '#fff' }}>✔</span> <strong>Bức tranh toàn cảnh</strong> về hiệu quả vận hành của Doanh nghiệp</li>
              <li style={{ paddingLeft: '32px', position: 'relative', color: '#d2d2d7' }}><span style={{ position: 'absolute', left: 0, color: '#fff' }}>✔</span> Danh sách cụ thể các <strong>cơ hội AI có tác động cao</strong></li>
              <li style={{ paddingLeft: '32px', position: 'relative', color: '#d2d2d7' }}><span style={{ position: 'absolute', left: 0, color: '#fff' }}>✔</span> Con số <strong>ROI</strong> tính từ lương và giờ làm thật của công ty</li>
              <li style={{ paddingLeft: '32px', position: 'relative', color: '#d2d2d7' }}><span style={{ position: 'absolute', left: 0, color: '#fff' }}>✔</span> Lộ trình hành động với <strong>deadline cụ thể</strong></li>
              <li style={{ paddingLeft: '32px', position: 'relative', color: '#d2d2d7' }}><span style={{ position: 'absolute', left: 0, color: '#fff' }}>✔</span> <strong>Sự tự tin</strong> để nói chuyện với vendor AI bất kỳ</li>
            </ul>

            <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#a1a1a6', margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>
              "Đó là những thứ mà nhiều công ty phải trả 5,000–20,000 USD cho một đội tư vấn AI để có được. Bạn sẽ tự làm được với hành trình này."
            </p>
          </div>

          {/* 8. SUCCESS STORIES */}
          <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px', fontWeight: 800, color: '#fff' }}>
            Bằng Chứng Thật. Kết Quả Thật.
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '80px' }}>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', color: '#fff', marginBottom: '16px', letterSpacing: '4px' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', marginBottom: '24px', color: '#a1a1a6', lineHeight: 1.6 }}>
                "Trước kia chúng tôi mua 3 tài khoản ChatGPT và vứt đó. Nhờ áp dụng tấm bản đồ này, tôi khui ra được nút thắt ở khâu làm Báo Giá. Chỉ bằng 1 thủ thuật tự động hóa, quy trình giảm từ 3 ngày xuống 15 phút, tiết kiệm 120 triệu tiền lương thừa mỗi năm."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>D</div>
                <div>
                  <p style={{ margin: 0, color: '#fff', fontWeight: 600 }}>Anh Dũng</p>
                  <p style={{ margin: 0, color: '#86868b', fontSize: '0.85rem' }}>CEO Công Ty Xây Dựng (40 Nhân Sự)</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', color: '#fff', marginBottom: '16px', letterSpacing: '4px' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', marginBottom: '24px', color: '#a1a1a6', lineHeight: 1.6 }}>
                "Tôi từng định đổ 300 triệu thuê đơn vị viết phần mềm CRM tích hợp AI. Nhưng khi chạy Ma Trận Ngày 5, tôi nhận ra đó là một dự án 'Tốn Sức - Ít Tiền'. Bản đồ đã giúp tôi quay xe tiết kiệm 300 triệu và chọn 1 công cụ có sẵn chi phí chỉ 1 triệu/tháng!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>M</div>
                <div>
                  <p style={{ margin: 0, color: '#fff', fontWeight: 600 }}>Chị Mai</p>
                  <p style={{ margin: 0, color: '#86868b', fontSize: '0.85rem' }}>Founder Chuỗi Bán Lẻ (8 Cửa Hàng)</p>
                </div>
              </div>
            </div>

          </div>



          {/* 10. FAQs */}
          <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px', fontWeight: 800, color: '#fff' }}>
            Câu Hỏi Thường Gặp
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '80px' }}>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>1. Tôi Không Dành Về Kỹ Thuật Lập Trình Thì Có Dùng Được AI Map Này Không?</h4>
              <p style={{ color: '#a1a1a6', margin: 0, lineHeight: 1.6 }}>Bản Đồ 7 Ngày tập trung vào tư duy kinh doanh và dữ liệu, không phải code lập trình. Bạn chỉ cần nhập số liệu và trả lời câu hỏi, hệ thống sẽ giúp bạn kết nối các mảng logic lại thành một chiến lược tài chính tự động.</p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>2. Thông Tin Doanh Nghiệp Có Bị Lộ Ra Ngoài Không?</h4>
              <p style={{ color: '#a1a1a6', margin: 0, lineHeight: 1.6 }}>Ứng dụng không yêu cầu chia sẻ tên cụ thể đối tác hay bí mật thương mại. Các con số bạn điền vào tài khoản sẽ được mã hóa với chuẩn bảo mật độc lập từ hệ thống Supabase Database, chỉ duy nhất bạn xem được Báo cáo của riêng mình.</p>
            </div>

            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>3. Nếu Bỏ Lỡ Ngày Chơi Thì Có Bị Khoá Tài Khoản Không?</h4>
              <p style={{ color: '#a1a1a6', margin: 0, lineHeight: 1.6 }}>Bạn được quyền truy cập tài khoản Vĩnh Viễn ngay sau khi thanh toán. Số 7 Ngày mang ý nghĩa tạo giới hạn kỷ luật giúp bạn tập trung và sớm đạt kết quả. Bạn có thể dành 2 ngày cho một bước nếu thấy bộn việc, không sao cả.</p>
            </div>
          </div>

          {/* 10. PRICE & FINAL CTA */}
          <div style={{ textAlign: 'center', padding: '60px 40px', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <p style={{ fontSize: '1.1rem', color: '#a1a1a6', marginBottom: '16px' }}>
              Một Agency thông thường sẽ lấy của bạn <span style={{ textDecoration: 'line-through' }}>5.000 - 20.000 USD</span> để vẽ ra bản đồ này.
            </p>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', color: '#fff', fontWeight: 700 }}>Chi phí để Bắt Đầu Hành Trình Của Bạn:</h3>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '30px' }}>
              <div style={{ color: '#86868b', fontSize: '1.5rem', textDecoration: 'line-through', fontWeight: 500 }}>3.000.000 VNĐ</div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>
                500.000<span style={{ fontSize: '2rem', verticalAlign: 'top' }}>đ</span>
              </h2>
            </div>

            {/* Urgent Tag & Countdown via Client Component */}
            <CountdownTimer />

            <p style={{ color: '#a1a1a6', marginBottom: '40px', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
              Trả một lần. Truy cập vĩnh viễn hệ thống phần mềm.
              <br />Đừng trả thêm tiền ngu cho vòng luẩn quẩn định hướng sai lầm.
            </p>

            <Link href="/register" className="cta-btn" style={{ fontSize: '1.2rem', padding: '20px 48px', margin: '0 auto' }}>
              Truy Cập Bản Đồ Ngay Lập Tức
            </Link>
            <p style={{ fontSize: '0.9rem', color: '#86868b', marginTop: '24px' }}>
              🔒 Sau khi hoàn tất thanh toán sẽ được kích hoạt tự động.
            </p>
          </div>

          {/* GUARANTEE SECTION (MOVED TO BOTTOM) */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(10,10,12,0.8) 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderTop: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '24px',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
            marginTop: '80px',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #fff, #86868b)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Bảo Chứng Hoàn Tiền 100% Trong 7 Ngày
              </h3>
              <p style={{ color: '#a1a1a6', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto 8px' }}>
                Không lý thuyết. Chỉ có <strong>Kết Quả</strong>. Nếu sau 7 ngày thực hành mà bạn không thấy lộ trình tiết kiệm hoặc kiếm lại ít nhất GẤP ĐÔI số tiền đã bỏ ra, chúng tôi hoàn lại 100% chi phí không hỏi thêm.
              </p>
              <p style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '1.2rem' }}>
                Rủi ro = 0. Tiết kiệm tiền tỷ, hoặc nhận lại tiền.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
