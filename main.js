'use strict';

{  
   /************************************
         タスクオブジェクトのクラス
   ************************************/
   class Task {
      constructor(id, comment) {
         this._id = id;
         this._comment = comment;
         this._status = '実行中';
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
   }

   /************************************
          タスクを表示するクラス
   ************************************/
   class ScreenPrinter {
      constructor() {
         // タスクの表示場所を取得する
         this.taskContainer = document.getElementById('taskContainer');
      }

      // リストのタスクをすべて表示する
      printScreen(taskList) {
         // 表示しているタスクを画面から削除
         this.resetScreen();

         taskList.forEach(task => {
            // タスクの表示場所に行を追加
            const taskRow = this.taskContainer.insertRow();
            
            // タスクの各項目を配列にまとめる
            const taskItems = [document.createTextNode(task.id), document.createTextNode(task.comment),
                               this.makeStatusButton(task.status), this.makeDeleteButton()];

            // 行に列を作成して各項目を追加
            taskItems.forEach(taskItem => {
               const taskCell = taskRow.insertCell();
               taskCell.appendChild(taskItem);
            });
         });
      }

      // タスクの状態を表示するボタンを作成
      makeStatusButton(status) {
         const statusButton = document.createElement('button');
         statusButton.textContent = status;

         return statusButton;
      }

      // タスクを削除するボタンを作成
      makeDeleteButton() {
         const deleteButton = document.createElement('button');
         deleteButton.textContent = '削除';

         return deleteButton;
      }

      resetScreen() {
         while(this.taskContainer.firstChild) {
            this.taskContainer.removeChild(this.taskContainer.firstChild);
         }
      }
   }

   /************************************
         タスクのリストを持つクラス
   ************************************/
   class TaskManager {
      constructor() {
         this.taskList = [];
         this.taskId = 0;
         this.screenPrinter = new ScreenPrinter();
      }

      // タスクオブジェクトを作成してリストに追加
      makeTask(commnet) {
         this.taskList.push(new Task(this.taskId, commnet));
         this.taskId++;

         // タスクの表示
         this.screenPrinter.printScreen(this.taskList);
      }
   }

   /************************************
            初期化するクラス
   ************************************/
   class Initialize {
      constructor() {
         // タスクのリストを持つマネージャーオブジェクトを初期化
         this.taskManager = new TaskManager();

         // 入力したタスクの値をマネージャーオブジェクトに渡す
         document.querySelector('form').addEventListener('submit', e => {
            e.preventDefault();
            this.taskManager.makeTask(document.getElementById('commnet').value);
            document.getElementById('commnet').value = '';
         });
      }
   }

   new Initialize();
}