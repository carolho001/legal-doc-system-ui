import React, { useState, useEffect } from 'react';
import { List, Card, Button, Spin, Empty, message, Typography, Divider } from 'antd';
import { FileText, Copy, Check, BookOpen, ScrollText } from 'lucide-react';
import { getAllLaws, getLawSummary } from '../services/api';

const { Title, Text } = Typography;

const TabSummary = () => {
  const [laws, setLaws] = useState([]);
  const [selectedLaw, setSelectedLaw] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadLaws();
  }, []);

  const loadLaws = async () => {
    setLoadingList(true);
    const data = await getAllLaws();
    setLaws(data);
    setLoadingList(false);
  };

  const handleSelectLaw = async (law) => {
    setSelectedLaw(law);
    setLoading(true);
    const sum = await getLawSummary(law.id);
    setSummary(sum);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      message.success('Đã sao chép nội dung tóm tắt!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-[calc(100vh-160px)] p-4 md:p-6">
      <div className="max-w-6xl mx-auto h-full flex gap-6">
        {/* Left Panel - Law List */}
        <Card 
          title={
            <span className="flex items-center gap-2 font-semibold text-[#2d2d2d] font-['Playfair_Display']">
              <BookOpen size={18} className="text-[#8b1a2b]" /> Danh sách văn bản
            </span>
          }
          className="w-1/3 h-full overflow-hidden flex flex-col shadow-md border-[#e8e4e0] rounded-xl"
          bodyStyle={{ padding: 0, overflow: 'auto', flex: 1 }}
        >
          <Spin spinning={loadingList}>
            <List
              dataSource={laws}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer px-4 py-4 hover:bg-[#faf5f0] transition-colors border-l-4 ${
                    selectedLaw?.id === item.id 
                      ? 'bg-[#faf5f0] border-[#8b1a2b]' 
                      : 'border-transparent'
                  }`}
                  onClick={() => handleSelectLaw(item)}
                >
                  <div>
                    <Text strong className={selectedLaw?.id === item.id ? 'text-[#8b1a2b]' : 'text-[#2d2d2d]'}>
                      {item.title}
                    </Text>
                    <div className="text-xs text-[#9a8478] mt-1">{item.type} • {item.year}</div>
                  </div>
                </List.Item>
              )}
            />
          </Spin>
        </Card>

        {/* Right Panel - Summary */}
        <Card 
          title={
            <span className="flex items-center gap-2 font-semibold text-[#2d2d2d] font-['Playfair_Display']">
              <ScrollText size={18} className="text-[#8b1a2b]" /> 
              {selectedLaw ? 'Tóm tắt văn bản' : 'Nội dung tóm tắt'}
            </span>
          }
          className="w-2/3 h-full overflow-hidden flex flex-col shadow-md border-[#e8e4e0] rounded-xl"
          bodyStyle={{ overflow: 'auto', flex: 1, padding: '24px' }}
          extra={
            selectedLaw && (
              <Button
                icon={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={handleCopy}
                type={copied ? 'default' : 'primary'}
                ghost={!copied}
                className="rounded-lg"
              >
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </Button>
            )
          }
        >
          {!selectedLaw ? (
            <Empty description="Vui lòng chọn một văn bản để xem tóm tắt" />
          ) : (
            <Spin spinning={loading} tip="Đang tóm tắt...">
              <div>
                <Title level={4} className="text-[#8b1a2b] mb-4 font-['Playfair_Display']">
                  {selectedLaw.title}
                </Title>
                <Divider className="border-[#e8e4e0]" />
                <div className="text-[#4a4a4a] leading-8 text-base whitespace-pre-line">
                  {summary}
                </div>
                <Divider className="border-[#e8e4e0]" />
                <Text type="secondary" className="text-xs text-[#9a8478]">
                  Nguồn: Hệ thống tra cứu luật (Dữ liệu mô phỏng)
                </Text>
              </div>
            </Spin>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TabSummary;