# MalaysiaDemo

## 客戶主機設定


主機清單：

* 台東 IP: 139.162.68.114，帳號：app

密碼不方便寫出來，有需要可以再問相關人

* 6002port / desktop
* 6003port / admin

#### 環境變數

`SSL_KEY`: 設定啟動 server 時使用的 https key

`SSL_CERT`: 設定啟用 server 時使用的 https cert

`REACT_APP_HOST`: 設定網站的 domain

`REACT_APP_GOOGLE_RECAPTCHA_KEY`: 前台 google 驗證的 key

`REACT_APP_OPEN_RECAPTCHA_CHECK`: 是否啟用 google 驗證

`REACT_APP_DEFAULT_MAP_LAT`, `REACT_APP_DEFAULT_MAP_LNG`: 設定地圖預設的中心點位

`REACT_APP_GOOGLE_MAP_KEY`: google maps 的 key

`REACT_APP_API_ROOT`: 設定 api 位址

除了 `SSL_KEY` 和 `SSL_CERT` 是在打包成功後，要將系統啟動起來時使用，其他的參數都是在打包時使用的

範例 1: 指定讀取 key 路徑

`SSL_KEY=/path/to/privkey.pem SSL_CERT=/path/to/fullchain.perm npm run start:server`

範例 2: 設定 domain

`REACT_APP_HOST=xxx.trackerplusweb.co npm run build`

範例 3: 設定地圖中心點

`REACT_APP_DEFAULT_MAP_LAT=123 REACT_APP_DEFAULT_MAP_LNG=456 npm run build`
        
see [issue 343](https://github.com/muzee-git/DPlus/issues/343) for more detail.



