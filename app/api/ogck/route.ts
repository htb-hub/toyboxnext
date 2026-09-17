//NEXTの構文：Jsonで返すくん
import { NextResponse } from 'next/server';

//export でFunctionをわたすらしい。
export  async function GET(request: Request){

    
    //URLを解析するらしい。
    const { searchParams } = new URL(request.url);
    const tUrl = searchParams.get('url');
    //URL取れてますか君
    if (!tUrl) {
    return NextResponse.json(
      { error: 'URLが指定されていませんわ' },
      { status: 400 }
    );
    }

    //定義　metaタグ、NCBのデフォルトimgURL、
    const ogTags = ["og:title", "og:description", "og:type", "og:url", "og:image", "og:site_name"];
    const specificImageUrl = "https://www.ncbank.co.jp/assets/images/ogp.webp";
    //ワンちゃんいらない。
    let displayRows: string[][] = [];
    let hasError = false;
    let errorDetails: string[] = [];

    //スクレイピングの本体
    const res = await fetch(tUrl, {
    headers: {
        // 一般的なブラウザのフリをしてリクエストを送りますわ
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    });

    // 3. 取得したHTMLをテキストとして読み込みます
  const html = await res.text();


    //meta判定
    ogTags.forEach(tag => {
      const regex = new RegExp('<meta[^>]+property=["\']' + tag + '["\'][^>]+content=["\']([^"\']+)["\']', 'i');
      const match = html.match(regex);
      
      let content = match ? match[1] : "設定なし";
      let status = "○";

      // 個別リスク判定
      if (content === "設定なし") {
        status = "×";
        hasError = true;
        if (tag === "og:title") errorDetails.push("・og:titleなし：シェア時にページタイトルが表示されず、何のページか伝わりません。");
        if (tag === "og:description") errorDetails.push("・og:descriptionなし：説明文が出ない可能性があります。");
        if (tag === "og:image") errorDetails.push("・og:imageなし：画像が表示されず、タイムライン上で完全に無視されてしまいます。");
        if (tag === "og:url") errorDetails.push(" ・og:urlなし：シェアされた際のリンク構造が不安定になる恐れがあります。");
      } else if (tag === "og:image") {
        if (content === specificImageUrl) {
          status = "×";
          hasError = true;
          errorDetails.push("・og:image不備：デフォルト画像です。");
        } else if (!content.match(/^https?:\/\//)) {
          status = "×";
          hasError = true;
          errorDetails.push("・og:image相対パス：外部サービスから画像が読み込めず、画像なしの状態と同じになってしまいます。");
        }
      }

      displayRows.push([tag, content, status]);
    });
        // 依頼文の生成（B13セル）
    let requestText = "";
    if (hasError) {
      requestText = "【OGP設定修正の至急依頼】\n" +
                    "下記URLのOGP設定に不備が確認されました。\n" +
                    "対象URL：" + tUrl + "\n\n" +
                    "■確認された不備と影響：\n" +
                    errorDetails.join("\n") + "\n\n" +
                    "【修正のお願い】\n" +
                    "特に画像は絶対パス（https://〜）で、各ページに最適なものを設定してください。修正完了をお待ちします";
    } else {
      requestText = "すべてのOGP設定が適切になされています。ご対応ありがとうございます。"+ "\n\n" +"もし修正後の対応でしたら、こちらでキャッシュクリアをお願いします。"+"\n\n" +"https://cards-dev.x.com/validator";
    }





  // 4. 最後にレスポンスとして結果を返しますわ
  return NextResponse.json({ errorDetails, displayRows,requestText });

}
