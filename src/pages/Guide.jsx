import React, { useState } from 'react';
import styled from 'styled-components';

const GuidePage = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' hoặc 'play'

  return (
    <GuideContainer>
      <TabContainer>
        <TabButton 
          $isActive={activeTab === 'create'} 
          onClick={() => setActiveTab('create')}
        >
          Hướng dẫn tạo ô chữ
        </TabButton>
        <TabButton 
          $isActive={activeTab === 'play'} 
          onClick={() => setActiveTab('play')}
        >
          Hướng dẫn chơi
        </TabButton>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'create' ? (
          <GuideContent>
            <WelcomeText>
              Chào bạn, chào mừng bạn đến với hệ thống Trò chơi Ô Chữ! Cảm ơn bạn đã cập nhật thông tin và sau đây là hướng dẫn chi tiết để bạn có thể dễ dàng tạo ô chữ trên hệ thống.
            </WelcomeText>

            <Divider />

            <Section>
              <SectionTitle>1. Bắt đầu tạo ô chữ</SectionTitle>
              <Paragraph>
                • Tại Trang chủ, nhấn vào nút "Tạo Ô Chữ" để bắt đầu tiến trình.
              </Paragraph>
              <ImageContainer>
                <GuideImage src="/images/guide/G1.jpg" alt="Bắt đầu tạo ô chữ" />
              </ImageContainer>
              <Paragraph>
                • Sau khi nhấn, hệ thống sẽ hiển thị bảng thông tin tạo ô chữ. Hãy điền đầy đủ thông tin được yêu cầu để tiến hành khởi tạo.
              </Paragraph>
              <ImageContainer>
                <GuideImage src="/images/guide/G2.jpg" alt="Bảng thông tin tạo ô chữ" />
              </ImageContainer>
            </Section>

            <Section>
              <SectionTitle>2. Thông tin cần cung cấp</SectionTitle>
              <Paragraph>
                • Tên ô chữ: Tên không được vượt quá 32 ký tự và không được trùng lặp với tên ô chữ đã có. Nếu trùng, hệ thống sẽ cảnh báo và bạn không thể tiếp tục.
              </Paragraph>
              <Paragraph>
                • Trạng thái:
              </Paragraph>
              <SubList>
                <ListItem>Công khai: Cho phép mọi người tìm thấy và chơi.</ListItem>
                <ListItem>Không công khai: Chỉ mình bạn có thể thấy và chơi.</ListItem>
              </SubList>
              <Paragraph>
                • Cấp lớp: Chọn cấp lớp phù hợp với nội dung ô chữ.
              </Paragraph>
              <Paragraph>
                • Môn học: Dựa trên cấp lớp đã chọn, hệ thống sẽ đề xuất danh sách môn học phù hợp.
              </Paragraph>
              <ImageContainer>
                <GuideImage src="/images/guide/G3.jpg" alt="Thông tin cần cung cấp" />
              </ImageContainer>
            </Section>

            <Section>
              <SectionTitle>3. Tạo nội dung ô chữ</SectionTitle>
              <Paragraph>
                • Sau khi hoàn tất thông tin, nhấn "Tạo mới" để chuyển đến trang khởi tạo nội dung.
              </Paragraph>
              <ImageContainer>
                <GuideImage src="/images/guide/G4.jpg" alt="Trang khởi tạo nội dung" />
              </ImageContainer>
              <Paragraph>
                • Tại đây, bạn có thể bắt đầu nhập từ khoá trong ô trên cùng. Số ký tự của từ khóa sẽ quyết định số lượng câu hỏi tương ứng.
              </Paragraph>
              <SubList>
                <ListItem>Từ khóa phải có độ dài từ 3-16 ký tự, hệ thống không nhận khoảng trắng, ký tự đặc biệt hay dấu câu.</ListItem>
              </SubList>
              <ImageContainer>
                <GuideImage src="/images/guide/G5.jpg" alt="Nhập từ khóa" />
              </ImageContainer>
            </Section>

            <Section>
              <SectionTitle>4. Nhập câu hỏi và câu trả lời</SectionTitle>
              <Paragraph>
                • Nhấn vào từng nút bên trái để nhập thông tin:
              </Paragraph>
              <SubList>
                <ListItem>Câu hỏi: Tối đa 150 ký tự. Hệ thống hỗ trợ gõ tiếng Việt có dấu và ký tự đặc biệt.</ListItem>
                <ListItem>Đáp án: Dài từ 2-14 ký tự, phải chứa ký tự khớp với từ khóa hàng dọc. Đáp án không được dài hơn 9 ký tự tính từ vị trí ký tự khớp.</ListItem>
              </SubList>
              <ImageContainer>
                <GuideImage src="/images/guide/G6.jpg" alt="Nhập câu hỏi và đáp án" />
              </ImageContainer>
              <Paragraph>
                • Hệ thống không bắt buộc thứ tự nhập câu hỏi. Hệ thống sẽ tự động ghi nhớ và hiển thị khi bạn quay lại chỉnh sửa từng câu hỏi.
              </Paragraph>
              <Paragraph>
                • Khi đã hoàn tất, nút "Lưu lại" sẽ khả dụng. Nhấn vào để lưu.
              </Paragraph>
              <ImageContainer>
                <GuideImage src="/images/guide/G7.jpg" alt="Lưu ô chữ" />
              </ImageContainer>
            </Section>

            <Section>
              <SectionTitle>5. Quản lý ô chữ trong quá trình tạo</SectionTitle>
              <Paragraph>
                • Nếu nhấn "Quay lại" trong lúc tạo, ô chữ sẽ được khởi tạo với thông tin bạn đã nhập nhưng nội dung trống. Bạn có thể chỉnh sửa hoặc xóa trong Trang Tài khoản.
              </Paragraph>
              <ImageContainer>
                <GuideImage src="/images/guide/G8.jpg" alt="Quản lý ô chữ" />
              </ImageContainer>
              <Paragraph>
                • Nếu rời khỏi hoặc làm mới trang khởi tạo, hệ thống sẽ lưu tiến trình trong vòng 1 giờ. Sau thời gian này, dữ liệu sẽ bị xóa.
              </Paragraph>
            </Section>

            <Section>
              <SectionTitle>6. Chỉnh sửa và xóa ô chữ</SectionTitle>
              <Paragraph>
                • Truy cập Trang Tài Khoản để quản lý ô chữ:
              </Paragraph>
              <SubList>
                <ListItem>Chỉnh sửa thông tin: Đổi tên, trạng thái, cấp lớp, và môn học.</ListItem>
                <ListItem>Chỉnh sửa nội dung: Thay đổi nội dung từ khóa và câu hỏi.</ListItem>
                <ListItem>Xóa: Xóa hoàn toàn ô chữ (không thể khôi phục lại).</ListItem>
              </SubList>
              <ImageContainer>
                <GuideImage src="/images/guide/G9.jpg" alt="Chỉnh sửa và xóa ô chữ" />
              </ImageContainer>
            </Section>

            <Section>
              <SectionTitle>Lưu ý cuối cùng</SectionTitle>
              <Paragraph>
                • Tính năng "Tạo Ô Chữ" hiện chỉ khả dụng tại Trang chủ.
              </Paragraph>
              <Paragraph>
                • Cảm ơn bạn đã theo dõi hướng dẫn. Hãy tiếp tục khám phá Hướng dẫn chơi để biết cách tham gia và các luật chơi trên hệ thống!
              </Paragraph>
            </Section>
          </GuideContent>
        ) : (
          <GuideContent>
            <WelcomeText>
              Xin chào! Dưới đây là hướng dẫn chi tiết cách chơi trò chơi ô chữ trên hệ thống. Tất cả các ô chữ ở trạng thái Công khai sẽ được hiển thị tại Thư viện, nơi bạn có thể lựa chọn và tham gia chơi theo bất kỳ chế độ nào. Trong mọi chế độ, hệ thống không tính thời gian, giúp bạn thoải mái suy nghĩ và đưa ra đáp án hợp lý nhất.
            </WelcomeText>

            <Divider />

            <Section>
              <SectionTitle>1. Chế độ Chơi một mình</SectionTitle>
              <Paragraph>
                • Đây là chế độ lý tưởng để bạn khám phá kiến thức thông qua các ô chữ.
              </Paragraph>
              <Paragraph>
                • Chọn chế độ Chơi một mình và nhấn Bắt đầu chơi để khởi động.
              </Paragraph>
              
              <SubSection>
                <SubSectionTitle>Cách chơi:</SubSectionTitle>
                <Paragraph>
                  • Chọn câu hỏi: Nhấn vào các nút bên trái để chọn câu hỏi. Lưu ý, bạn phải hoàn thành câu hỏi hiện tại trước khi chọn câu khác.
                </Paragraph>
                <ImageContainer>
                  <GuideImage src="/images/guide/P1.jpg" alt="Chọn câu hỏi" />
                </ImageContainer>
                
                <Paragraph>
                  • Lượt trả lời: Bạn có tối đa 2 lượt trả lời cho mỗi câu hỏi. Nếu trả lời sai lần thứ 2, hàng ngang đó sẽ bị khóa. Nội dung hàng ngang có thể được mở sau khi bạn giải được từ khóa chính.
                </Paragraph>
                <Paragraph>
                  • Bỏ qua: Nếu không có đáp án, bạn có thể nhấn Bỏ qua.
                </Paragraph>
                <ImageContainer>
                  <GuideImage src="/images/guide/P2.jpg" alt="Bỏ qua câu hỏi" />
                </ImageContainer>
                
                <Paragraph>
                  • Trả lời từ khóa: Bạn có thể thử trả lời từ khóa chính bất kỳ lúc nào. Không giới hạn số lần thử.
                </Paragraph>
                <ImageContainer>
                  <GuideImage src="/images/guide/P3.jpg" alt="Trả lời từ khóa" />
                </ImageContainer>
                
                <Paragraph>
                  • Chơi lại: Bạn có thể nhấn nút Chơi lại từ đầu để bắt đầu lại thay vì thoát ra và vào lại.
                </Paragraph>
                <ImageContainer>
                  <GuideImage src="/images/guide/P4.jpg" alt="Chơi lại" />
                </ImageContainer>
              </SubSection>
            </Section>

            <Section>
              <SectionTitle>2. Chế độ Chơi theo đội</SectionTitle>
              <Paragraph>
                • Chế độ này cho phép bạn tổ chức trò chơi cho nhiều người tham gia, kể cả khi bạn không biết đáp án của ô chữ.
              </Paragraph>

              <SubSection>
                <SubSectionTitle>Bắt đầu:</SubSectionTitle>
                <Paragraph>
                  • Chọn chế độ Chơi theo đội và đặt tên cho các đội để kích hoạt. Nếu không đặt tên, đội sẽ bị ẩn. Cần ít nhất 2 đội để bắt đầu.
                </Paragraph>
                <Paragraph>
                  • Hệ thống hỗ trợ âm thanh. Bạn có thể bật hoặc tắt tùy ý.
                </Paragraph>
                <ImageContainer>
                  <GuideImage src="/images/guide/P5.jpg" alt="Thiết lập đội" />
                </ImageContainer>
              </SubSection>

              <SubSection>
                <SubSectionTitle>Luật chơi:</SubSectionTitle>
                <Paragraph>Câu hỏi thường:</Paragraph>
                <Paragraph>
                  • Nhấn vào bảng đội để xác định lượt chơi. Điểm sẽ được cộng hoặc trừ cho đội đang được chọn.
                </Paragraph>
                <ImageContainer>
                  <GuideImage src="/images/guide/P7.jpg" alt="Chọn đội" />
                </ImageContainer>
                
                <Paragraph>• Điểm thưởng:</Paragraph>
                <SubList>
                  <ListItem>Trả lời đúng lần đầu: +10 điểm</ListItem>
                  <ListItem>Trả lời sai lần đầu: Không bị trừ điểm, quyền trả lời chuyển cho đội khác.</ListItem>
                </SubList>
                <ImageContainer>
                  <GuideImage src="/images/guide/P8.jpg" alt="Điểm thưởng" />
                </ImageContainer>

                <Paragraph>• Đội khác nếu được chọn trả lời (lần thứ 2):</Paragraph>
                <SubList>
                  <ListItem>Trả lời đúng: +5 điểm</ListItem>
                  <ListItem>Trả lời sai: -5 điểm</ListItem>
                  <ListItem>Nếu không có đáp án: Nhấn Bỏ qua.</ListItem>
                </SubList>
                <Paragraph>
                  • Sau 2 lần trả lời sai, câu hỏi sẽ bị khóa.
                </Paragraph>

                <Paragraph>Từ khóa:</Paragraph>
                <Paragraph>
                  • Mỗi đội chỉ được trả lời từ khóa 1 lần duy nhất.
                </Paragraph>
                <Paragraph>• Điểm thưởng:</Paragraph>
                <SubList>
                  <ListItem>Công thức: 5 × (số ký tự từ khóa) - 5 × (số ký tự đã hiện).</ListItem>
                </SubList>
                <ImageContainer>
                  <GuideImage src="/images/guide/P10.jpg" alt="Điểm từ khóa" />
                </ImageContainer>
                
                <Paragraph>
                  • Nếu trả lời sai: Không bị trừ điểm.
                </Paragraph>
                <Paragraph>
                  • Người tổ chức có thể chọn hình phạt cho đội trả lời sai từ khóa, bao gồm:
                </Paragraph>
                <SubList>
                  <ListItem>Không được trả lời từ khóa nữa.</ListItem>
                  <ListItem>Không được chọn câu hỏi nữa.</ListItem>
                  <ListItem>Có hoặc không có quyền giành lượt khi đội khác trả lời sai.</ListItem>
                </SubList>
              </SubSection>

              <SubSection>
                <SubSectionTitle>Kết thúc trò chơi:</SubSectionTitle>
                <Paragraph>
                  • Bạn có thể kết thúc bất kỳ lúc nào bằng cách nhấn Tổng kết điểm ở góc phải màn hình. Hệ thống sẽ thông báo đội chiến thắng.
                </Paragraph>
                <ImageContainer>
                  <GuideImage src="/images/guide/P11.jpg" alt="Kết thúc trò chơi" />
                </ImageContainer>
              </SubSection>
            </Section>
          </GuideContent>
        )}
      </ContentContainer>
    </GuideContainer>
  );
};

export default GuidePage;

const GuideContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px 40px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 15px;
  font-size: 1.2rem;
  font-weight: 500;
  border: none;
  background-color: ${props => props.$isActive ? '#4CAF50' : '#e0e0e0'};
  color: ${props => props.$isActive ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$isActive ? '#45a049' : '#d0d0d0'};
  }

  &:first-child {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const ContentContainer = styled.div`
  background: white;
  padding: 60px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 800px;
`;

const GuideContent = styled.div`
  padding: 40px;
  font-size: 1.5rem;
`;

const WelcomeText = styled.p`
  font-size: 1.65rem;
  line-height: 1.6;
  margin-bottom: 40px;
  text-indent: 4em;
`;

const Divider = styled.hr`
  margin: 60px 0;
  border: 0;
  border-top: 2px solid #eee;
`;

const Section = styled.section`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-size: 2.1rem;
  color: #2c3e50;
  margin-bottom: 40px;
  font-weight: 600;
`;

const Paragraph = styled.p`
  margin: 30px 0;
  line-height: 1.6;
  text-indent: 4em;
  font-size: 1.5rem;
`;

const SubList = styled.ul`
  margin-left: 8em;
  margin-bottom: 30px;
  font-size: 1.5rem;
`;

const ListItem = styled.li`
  margin: 16px 0;
  line-height: 1.5;
  font-size: 1.5rem;
`;

const ImageContainer = styled.div`
  margin: 40px 0;
  text-align: center;
`;

const GuideImage = styled.img`
  max-width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const SubSection = styled.div`
  margin: 30px 0 50px 0;
`;

const SubSectionTitle = styled.h3`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 500;
`;