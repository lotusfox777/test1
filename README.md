# MalaysiaDemo

## 客戶主機設定

因為站台不少，且以後可能會更多，如果是用 MAC OS 建議可以裝 [Termius](https://termius.com/) 管理 host

主機清單：

* 台東 IP: 139.162.68.114，帳號：app

密碼不方便寫出來，有需要可以再問相關人

* 5000port / desktop
* 5050port / mobile
* 8000port / admin

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


#### 測試機
http://59.120.53.132:3003 

有兩種方式：

#### 在本地端將code打包好傳到 testing2 後，再連接到 testing2 打開服務

1. 在本地端的 `dplus` 專案，切到 `frontend` 目錄後，分別進入 `newportal`、`mobile` 和 `dashboard`
2. 各別執行 `yarn install --ignore-engines`
2. 各別執行 `npm run deploy:staging`
3. 透過 `ssh` 進入 `testing2` 機器
4. run `screen -r` 分別進入 *不同 screen*

手機

1. `screen -S 21338.dplus-front-mobile`
2. `cd /root/dPlus_front/frontend/mobileportal`
3. `PORT=3005 yarn start:server`

桌面版

1. `screen -S 9272.dplus-front-portal`
2. `cd /root/dPlus_front/frontend/newportal`
3. `PORT=3003 yarn start:server`

後台

1. `screen -S 8727.dplus-front-dashboard`
2. `cd /root/dPlus_front/frontend/dashboard `
3. `PORT=3004 yarn start:server`


#### 在 testing2 做程式碼打包和啟動服務

1. 透過 `ssh` 進入 `testing2` 機器
2. cd ~/dPlus_front
3.. git pull origin branch_name ex: git pull origin Web/features (前端最新code通常都在 Web/features)
4. run `screen -r` 分別進入 *不同 screen*
    
手機

1. `screen -S 21338.dplus-front-mobile`
2. `cd /root/dPlus_front/frontend/mobileportal`
3. `yarn install --ignore-engines`
4. `yarn run build:staging`
5. `PORT=3005 yarn start:server`

桌面版

1. `screen -S 9272.dplus-front-portal`
2. `cd /root/dPlus_front/frontend/newportal`
3. `yarn install --ignore-engines`
4. `yarn run build:staging`
5. `PORT=3003 yarn start:server`

後台

1. `screen -S 8727.dplus-front-dashboard`
2. `cd /root/dPlus_front/frontend/dashboard `
3. `yarn install --ignore-engines`
4. `yarn run build:staging`
5. `PORT=3004 yarn start:server`

