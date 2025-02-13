// src/pages/SummaryTranslate.js
import React, { useState } from 'react';
import Header from '../components/Header';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import Footer from '../components/Footer';

const SummaryTranslate = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [translation, setTranslation] = useState('');
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Xử lý tóm tắt
  const handleSummarize = async () => {
    try {
      // Gọi API thật ở đây (ví dụ: axios.post('/api/summarize', { text: inputText }))
      // const response = await axios.post('/api/summarize', { text: inputText });
      // setSummary(response.data.summary);
      // setHistory([...history, { type: 'Tóm tắt', text: inputText, result: response.data.summary }]);

      // Hiện tại, để trống cho đến khi tích hợp backend
      alert('Chức năng tóm tắt chưa được tích hợp.');
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  // Xử lý dịch thuật
  const handleTranslate = async () => {
    try {
      // Gọi API thật ở đây (ví dụ: axios.post('/api/translate', { text: inputText }))
      // const response = await axios.post('/api/translate', { text: inputText });
      // setTranslation(response.data.translation);
      // setHistory([...history, { type: 'Dịch thuật', text: inputText, result: response.data.translation }]);

      // Hiện tại, để trống cho đến khi tích hợp backend
      alert('Chức năng dịch thuật chưa được tích hợp.');
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  // Xóa nội dung
  const handleClear = () => {
    setInputText('');
    setSummary('');
    setTranslation('');
  };

  // Xóa lịch sử
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Sao chép kết quả
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã sao chép vào clipboard!');
    });
  };

  // Tải xuống kết quả
  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Thêm vào yêu thích
  const handleFavorite = (item) => {
    setFavorites([...favorites, item]);
  };

  // Chia sẻ qua Facebook
  const handleShareFacebook = (text) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Chia sẻ qua Twitter
  const handleShareTwitter = (text) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  // Chia sẻ qua Email
  const handleShareEmail = (text) => {
    const subject = 'Kết quả tóm tắt/dịch thuật';
    const body = `Xem kết quả tại: ${window.location.href}\n\n${text}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-purple-50 font-sans">
      <Header />
      <div className="flex-grow container mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tóm tắt và Dịch thuật
          </h1>
          <TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập văn bản cần tóm tắt hoặc dịch..."
            maxWords={500}
          />
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              onClick={handleSummarize}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Tóm tắt
            </Button>
            <Button
              onClick={handleTranslate}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Dịch
            </Button>
            <Button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Xóa
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Tóm tắt</h2>
              {summary && (
                <>
                  <p className="text-gray-700">{summary}</p>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={() => handleCopy(summary)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Sao chép
                    </Button>
                    <Button
                      onClick={() => handleDownload(summary, 'tom-tat.txt')}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Tải xuống
                    </Button>
                    <Button
                      onClick={() => handleFavorite({ type: 'Tóm tắt', text: inputText, result: summary })}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Yêu thích
                    </Button>
                    <Button
                      onClick={() => handleShareFacebook(summary)}
                      className="bg-facebook hover:bg-facebook-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Facebook
                    </Button>
                    <Button
                      onClick={() => handleShareTwitter(summary)}
                      className="bg-twitter hover:bg-twitter-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Twitter
                    </Button>
                    <Button
                      onClick={() => handleShareEmail(summary)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Email
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">Dịch thuật</h2>
              {translation && (
                <>
                  <p className="text-gray-700">{translation}</p>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={() => handleCopy(translation)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Sao chép
                    </Button>
                    <Button
                      onClick={() => handleDownload(translation, 'dich-thuat.txt')}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Tải xuống
                    </Button>
                    <Button
                      onClick={() => handleFavorite({ type: 'Dịch thuật', text: inputText, result: translation })}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Yêu thích
                    </Button>
                    <Button
                      onClick={() => handleShareFacebook(translation)}
                      className="bg-facebook hover:bg-facebook-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Facebook
                    </Button>
                    <Button
                      onClick={() => handleShareTwitter(translation)}
                      className="bg-twitter hover:bg-twitter-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Twitter
                    </Button>
                    <Button
                      onClick={() => handleShareEmail(translation)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Email
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Lịch sử</h2>
              <Button
                onClick={handleClearHistory}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Xóa lịch sử
              </Button>
            </div>
            {history.map((item, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{item.type}</h3>
                <p className="text-gray-700"><strong>Văn bản gốc:</strong> {item.text}</p>
                <p className="text-gray-700"><strong>Kết quả:</strong> {item.result}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Yêu thích</h2>
            {favorites.map((item, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{item.type}</h3>
                <p className="text-gray-700"><strong>Văn bản gốc:</strong> {item.text}</p>
                <p className="text-gray-700"><strong>Kết quả:</strong> {item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SummaryTranslate;