'use strict';

{  
   /************************************
         タスクオブジェクトのクラス
   ************************************/
   class Task {
      constructor(id, comment) {
         this._id = id;
         this._comment = comment;
         this._status = true;
      }

      get id() {
         return this._id;
      }

      get comment() {
         return this._comment;
      }

      get status() {
         return this._status;
      }

      set id(id) {
         this._id = id;
      }

      set status(status) {
         this._status = status;
      }
   }

   /************************************
          タスクを表示するクラス
   ************************************/
   class ScreenManager {
      constructor(main) {
         // タスクの表示場所を取得する
         this.taskContainer = document.getElementById('taskContainer');
         this.main = main;
      }

      // タスクの表示
      printScreen(task) {
         // 1つのタスクを表示するための行を追加
         const taskRow = this.taskContainer.insertRow();
         
         // タスクの各部品を配列にまとめる
         const taskItems = [document.createTextNode(task.id),
                            document.createTextNode(task.comment),
                            this.makeStatusButton(task),
                            this.makeDeleteButton(taskRow)];

         // 行に列を作成して、タスクの各部品をセットする
         taskItems.forEach(taskItem => {
            const taskCell = taskRow.insertCell();
            taskCell.appendChild(taskItem);
         });
      }

      // タスクの表示場所を空白にする
      cleanScreen() {
         while(this.taskContainer.firstChild) {
            this.taskContainer.removeChild(this.taskContainer.firstChild);
         }
      }

      // タスクの状態を表示するボタンを作成
      makeStatusButton(task) {
         const statusButton = document.createElement('button');
         statusButton.textContent = task.status ? '実行中': '完了';

         statusButton.addEventListener('click', () => {
            // ボタンの表示を反転して、該当のタスクをMainオブジェクトに渡す
            statusButton.textContent = task.status ? '完了': '実行中';
            this.main.sendChangeStatus(task);
         });

         return statusButton;
      }

      // タスクを削除するボタンを作成
      makeDeleteButton(taskRow) {
         const deleteButton = document.createElement('button');
         deleteButton.textContent = '削除';

         deleteButton.addEventListener('click', () => {
            // 削除するタスクのIDを取得してMainオブジェクトに渡す
            const taskId = taskRow.firstChild.textContent;
            this.main.sendDeleteTargetId(taskId);
         });

         return deleteButton;
      }
   }

   /************************************
       タスクとリストを処理するクラス
   ************************************/
   class TaskManager {
      constructor(screenManager) {
         this.taskList = [];
         this.screenManager = screenManager;
      }

      // タスクオブジェクトを作成してリストに追加
      makeTask(commnet) {
         this.taskList.push(new Task(this.taskList.length, commnet));
      }

      // タスクリストからタスクを削除
      deleteTask(taskId) {
         this.taskList.splice(taskId, 1);
         return this;
      }

      // タスクのIDを振り振り直す
      resetTaskId() {
         this.taskList.forEach((task, index) => {
            task.id = index;
         });
      }

      // タスクのステータスを反転する
      changeTaskStatus(task) {
         task.status = !task.status;
      }

      // スクリーン管理者にタスクを渡して表示する
      sendTaskToScreen(selectedStatus) {
         this.screenManager.cleanScreen();

         // 表示の切り替えを、引数で受けとった値とタスクのステータスで判定する
         this.taskList.forEach(task => {
            if(selectedStatus === 'statusAll') {
               this.screenManager.printScreen(task);
            } else if(selectedStatus === 'statusRunning' && task.status) {
               this.screenManager.printScreen(task);
            } else if(selectedStatus === 'statusFinished' && !task.status) {
               this.screenManager.printScreen(task);
            }
         });
      }
   }

   /************************************
              メインクラス
   ************************************/
   class Main {
      constructor() {
         this.screenManager = new ScreenManager(this);
         this.taskManager = new TaskManager(this.screenManager);
         // 表示を切り替えるための変数
         this.selectedStatus = 'statusAll';

         // 入力した文字列をタスク管理者に渡してタスクを作成、表示する
         document.querySelector('form').addEventListener('submit', e => {
            e.preventDefault();
            this.taskManager.makeTask(document.getElementById('commnet').value);
            document.getElementById('commnet').value = '';
            this.taskManager.sendTaskToScreen(this.selectedStatus);
         });

         // 表示の切り替えボタンを押したら、再表示のための値をタスク管理者に渡す
         document.getElementById('selectedDiplayStatus').addEventListener('click', e => {
            this.selectedStatus = e.target.value;
            this.taskManager.sendTaskToScreen(this.selectedStatus);
         });  
      }

      // 引数で受けとったIDを持つタスクを削除して、再表示のための値をタスク管理者に渡す
      sendDeleteTargetId(taskId) {
         // 覚えたばかりのメソッドチェーンを意味もなく試してみる
         this.taskManager.deleteTask(taskId).resetTaskId();
         this.taskManager.sendTaskToScreen(this.selectedStatus);
      }

      // 引数で受けとったタスクのステータスを反転して、再表示のための値をタスク管理者に渡す
      sendChangeStatus(task) {
         this.taskManager.changeTaskStatus(task);
         this.taskManager.sendTaskToScreen(this.selectedStatus);
      }
   }

   new Main();
}