
(function() {

	var app = {
		init: function() {
			app.storage('get');

			document.querySelector('.app-insert input').addEventListener('keyup', function(e) {
				if ( e.which === 13 && this.value !== '' ) {
					app.addTask(this.value);
					app.storage('update');
					this.value = '';
				}
			}, false);

			document.querySelector('.app-list').addEventListener('click', function(e) {
				// Remove task
				if ( e.target.classList.contains('remove-task') ) {
					app.removeTask(e.target.parentNode);

				} else if ( e.target.classList.contains('task') ) {
					app.completeTask(e.target);
				}
			}, false);
		},
		addTask: function (task) {
			var new_task = document.createElement('li');
				new_task.setAttribute('class', 'task');
				new_task.innerHTML = task + '<a href="javascript:;" class="remove-task">remove</a>';
				
			var $list = document.querySelector('.app-list ul');
				$list.appendChild(new_task);
		},
		removeTask: function (task) {
			task.style.opacity = 0;
			setTimeout(function() {
				task.remove();
				app.storage('update');
			}, 400);
		},
		completeTask: function (task) {
			task.classList.toggle('task-complete');
			app.storage('update');
		},
		storage: function(type) {
			if ( type === 'get' ) {
				if ( localStorage.getItem('simpletodo') !== null ) {
					document.querySelector('.app-list').innerHTML = localStorage.getItem('simpletodo');
				}
			} else if ( type === 'update' ) {
				var str = document.querySelector('.app-list').innerHTML;
				localStorage.setItem('simpletodo', str);
			}
		}
	};
	app.init();

})();