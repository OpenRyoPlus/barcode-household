console.log("main.js!!");

$(document).ready(() => {
  console.log("Ready!!");

  const applicationId = "1072753919144124850";  // ← 君の楽天アプリID
  const fetchProductInfo = async (jan) => {
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${applicationId}&keyword=${jan}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.Items && data.Items.length > 0) {
        const item = data.Items[0].Item;
        return {
          name: item.itemName,
          price: item.itemPrice
        };
      } else {
        return { name: "商品情報なし", price: "不明" };
      }
    } catch (e) {
      console.error("APIエラー:", e);
      return { name: "エラー", price: "―" };
    }
  };

  $("#my_start").click(() => {
    console.log("Start!!");

    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#my_quagga"),
        constraints: {
          facingMode: "environment"
        }
      },
      decoder: {
        readers: ["ean_reader"]
      }
    }, err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Initialization finished!!");
      Quagga.start();
    });

    Quagga.onDetected(async (result) => {
      const code = result.codeResult.code;
      console.log("JANコード:", code);
      $("#my_result").text(`JANコード: ${code}`);
      $("#my_barcode div").barcode(code, "ean13");

      const product = await fetchProductInfo(code);
      const productText = `商品名: ${product.name}<br>価格: ${product.price}円`;
      $("#my_result").html(`JANコード: ${code}<br>${productText}`);
    });
  });

  $("#my_stop").click(() => {
    console.log("Stop!!");
    Quagga.stop();
  });
});
