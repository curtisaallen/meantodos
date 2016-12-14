import { Component, OnInit } from '@angular/core';
import {TodoService} from '../services/todo.service';
import {Todo} from '../Todo';

@Component({
    moduleId: module.id,
    selector: 'todos',
    templateUrl: 'todos.component.html'
})
export class TodosComponent implements OnInit {
    todos: Todo[];
    constructor(private _todoService: TodoService) {

    }

    addTodo(event, todotext) {
        var result;
        var newTodo = {
            text: todotext.value,
            isCompleted: false
        };

        result = this._todoService.saveTodo(newTodo);
        result.subscribe(x => {
           this.todos.push(newTodo);
           todotext.value = '';
        });
    }

    setEditState(todo, state) {
        if(state) {
            todo.isEditMode = state;
        } else {
            delete todo.isEditMode;
        }
    }

    updateStatus(todo) {
        var _todo = {
            _id:todo._id,
            text: todo.text,
            isCompleted: !todo.isCompleted
        };
        this._todoService.updateTodo(_todo)
            .subscribe(data => {
                todo.isCompleted = !todo.isCompleted;
            });
    }

    updateTodoText(event, todo) {
        if(event.which === 13) {
           todo.text = event.target.value;
            var _todo = {
                _id:todo._id,
                text: todo.text,
                isCompleted: todo.isCompleted
            };
            this._todoService.updateTodo(_todo)
                .subscribe(data => {
                    this.setEditState(todo, false);
                });
        }
    }

    deleteTodo(todo) {
        var todos = this.todos;

        this._todoService.deleteTodo(todo._id)
            .map(res => res.json())
            .subscribe(data => {
                if (data.n == 1) {
                    // save a n/w call by updating the local array
                    // instead of making a GET call again to refresh the data
                    for (var i = 0; i < todos.length; i++) {
                        if (todos[i]._id == todo._id) {
                            todos.splice(i, 1);
                        }
                    };
                }
            });
    }


    ngOnInit() {
        this.todos = [];
        this._todoService.getTodos()
            .subscribe(todos => {
                console.log(todos);
                this.todos = todos;
            });

    }
}
