'use client';
import Image from "next/image";
import { useState } from 'react';

export default function Home() {
 //箱準備
  const [inputUrl, setInputUrl] = useState('');
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [displayRows, setDisplayRows] = useState<string[][]>([]);
  
  const getOg = async () => {
    if (!inputUrl) {
      alert('URLを入力してくださいませ！');
      return;
    }
    

    // 先ほど作ったAPI（route.ts）を呼び出しますわ
    const res = await fetch(`/api/ogck?url=${encodeURIComponent(inputUrl)}`);
    const data = await res.json();

    // 2. APIから返ってきた errorDetails を state にぶち込み（保存し）ますわ！
      if (data.errorDetails) setErrorDetails(data.errorDetails);
      if (data.displayRows) setDisplayRows(data.displayRows);
      if (data.requestText) setRequestText(data.requestText);
    console.log('取得したデータ:', data);

  };

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="max-w-lg mx-auto  p-2 text-center">
        <h1 className="text-3xl mb-3 mt-3 text-gray-700">OGPチェックちゃん　IN　NEXTJS</h1>
          <p className="text-gray-600 mb-5">OGP（Open Graph Protocol）の設定状況をチェックできますわ</p>
          <div className="flex justify-center items-center">
           <Image src="/character.png" alt="説明" width={300} height={200} />
          </div>
        <div className="">
          <div className="">
            {/* 入力（inputurl君を格納） */}
            <input type="url" placeholder="https://example.com" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 outline-none focus:ring-2 focus:ring-orange-400 mb-2"></input>
            <br />
            <button className="px-4 py-2 bg-orange-400 text-white rounded" onClick={getOg}>Get OGP</button>
          
          </div>

        </div>
        {/* 判定結果くん */}
        <h2 className="text-2xl pb-2 text-gray-700 border-b-2 border-b-gray-300 mb-5 mt-5">判定結果ですわ！</h2>
        {displayRows.length > 0 && !loading && (
          <div className="text-left mb-5">
            {displayRows.map((row, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b border-gray-200">
                <div>
                  <p className="text-xs font-mono font-bold text-gray-500">{row[0]}</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{row[1]}</p>
                </div>
                <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                  row[2] === '○' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {row[2]}
                </span>
              </div>
            ))}
          </div>
        )}

        {displayRows.length > 0 && errorDetails.length === 0 && !loading && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">OGP設定は問題なしですわ！</p>
          <p>もし表示されなければこちらをお伝えいただければ解決ですわよ。</p>
          <p className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap font-mono text-sm text-black">
          {requestText}
        </p>
        </div>
        
       )}
        {errorDetails.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="font-bold text-red-700 mb-2">改善ポイントが見つかりましたわ：</h2>
          <ul className="space-y-1 text-sm text-red-600">
            {errorDetails.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul> 
          <div>
            <h3>ベンダーさんへの依頼分はこちらですわ！</h3>
          {requestText && (
        <p className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap font-mono text-sm text-black">
          {requestText}
        </p>
        )}
          </div>
        </div>

      )}



      </main>
    </div>
  );
}
