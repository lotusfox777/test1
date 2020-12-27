# DPlus 後台管理系統

## How to start

#### 正式機

三個站的更新方式都是一樣的，只差在執行 script 的參數和 screen 的名稱，這裡以更新桌面版為例（每台主機更新方式也一樣）：

1. 以 ssh 連入主機
2. `cd dplus_malaysiaDemo`
3. `git pull` (記得先切到要拉 code 的 branch)
4. `screen -r 897.dashboard_malaysia`
5. `cd ~/dplus_malaysiaDemo`
6. `source build_web_app.sh dashboard`

7. `cd ~/dplus_malaysiaDemo`
8. `sudo -s`
9. `source run_admin_malaysia.sh`
