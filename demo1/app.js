(function () {
  var db = new Dexie("todos-dexie");
  var input = document.querySelector('input');
  var ul = document.querySelector('ul');
  document.body.addEventListener('submit', onSubmit);
  document.body.addEventListener('click', onClick);

  db.version(1).stores({todo: '_id'});
  db.open()
    .then(refreshView);

  function onClick(e) {
    e.preventDefault();
    if (e.target.hasAttribute('id')) {
      db.todo.where('_id').equals(e.target.getAttribute('id')).delete()
        .then(refreshView);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    db.todo.put({text: input.value, _id: String(Date.now())})
      .then(function () {
              input.value = '';
            })
      .then(refreshView);
  }

  function refreshView() {
    return db.todo.toArray()
      .then(renderAllTodos);
  }

  function renderAllTodos(todos) {
    var html = '';
    todos.forEach(function (todo) {
      html += todoToHtml(todo);
    });
    ul.innerHTML = html;
  }

  function todoToHtml(todo) {
    return '<li><button id="' + todo._id + '">delete</button>' + todo.text + '</li>';
  }

  function AppController($scope) {
    var ctrl = this;
    ctrl.todos = [];
    ctrl.newTitle = '';
    db.todo.toArray(function (todos) {
      $scope.$apply(function () {
        ctrl.todos = todos;
      })
    });

    ctrl.addToDo = function (newTitle) {
      $scope.$apply(function () {
        db.todo.put({text: newTitle, _id: String(Date.now())})
          .then(function () {
                  ctrl.newTitle = '';
                });
      });
    };

    ctrl.deleteToDo = function (id) {
      $scope.$apply(function () {
        db.todo.where('_id').equals(id).delete()
          .then(refreshView);
      });
    };
  }

  angular.module('app', [])
    .controller('AppController', AppController);


}());
