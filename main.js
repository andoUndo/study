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

      // リストのタスクをすべて表示する
      printScreen(taskList) {
         // 表示しているタスクを画面から削除
         while(this.taskContainer.firstChild) {
            this.taskContainer.removeChild(this.taskContainer.firstChild);
         }

         taskList.forEach(task => {
            // タスクの表示場所に行を追加
            const taskRow = this.taskContainer.insertRow();
            
            // タスクの各項目を配列にまとめる
            const taskItems = [document.createTextNode(task.id),
                               document.createTextNode(task.comment),
                               this.makeStatusButton(task),
                               this.makeDeleteButton(taskRow)];

            // 行に列を作成して各項目を追加
            taskItems.forEach(taskItem => {
               const taskCell = taskRow.insertCell();
               taskCell.appendChild(taskItem);
            });
         });
      }

      // タスクの状態を表示するボタンを作成
      makeStatusButton(task) {
         const statusButton = document.createElement('button');
         statusButton.textContent = task.status? '実行中': '完了';

         statusButton.addEventListener('click', () => {
            // ボタンの表示を反転する
            statusButton.textContent = task.status? '完了': '実行中';
            this.main.sendChangeStatus(task);
         });

         return statusButton;
      }

      // タスクを削除するボタンを作成
      makeDeleteButton(taskRow) {
         const deleteButton = document.createElement('button');
         deleteButton.textContent = '削除';

         deleteButton.addEventListener('click', () => {
            // 削除するタスクのIDを表示要素から取得
            const taskId = taskRow.firstChild.textContent;
            taskRow.remove();
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
         this.screenManager.printScreen(this.taskList);
      }

      // タスクリストからタスクを削除
      deleteTask(taskId) {
         this.taskList.splice(taskId, 1);
         this.resetTaskId();
      }

      // タスクのIDを振り直してタスクを再表示
      resetTaskId() {
         this.taskList.forEach((task, index ) => {
            task.id = index;
         });

         this.screenManager.printScreen(this.taskList);
      }

      // タスクのステータスを反転する
      changeTaskStatus(task) {
         task.status = !task.status;
      }
   }

   /************************************
              メインクラス
   ************************************/
   class Main {
      constructor() {
         this.screenManager = new ScreenManager(this);
         this.taskManager = new TaskManager(this.screenManager);

         // 入力したタスクをタスクマネージャーに渡す
         document.querySelector('form').addEventListener('submit', e => {
            e.preventDefault();
            this.taskManager.makeTask(document.getElementById('commnet').value);
            document.getElementById('commnet').value = '';
         });
      }

      // タスクIDをタスクマネージャーに渡す
      sendDeleteTargetId(taskId) {
         this.taskManager.deleteTask(taskId);
      }

      // タスクオブジェクトをタスクマネージャーに渡す
      sendChangeStatus(task) {
         this.taskManager.changeTaskStatus(task);
      }
   }

   new Main();
}