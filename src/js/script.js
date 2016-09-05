$(document).ready(function() {

    /**
     * Manages state of all tasks
     */
    function State() {

        var data = {};

        /**
         * Save in local browser cache.
         */
        this.save = function() {
            return this;
        }

        /**
         * Load from local browser cache
         */
        this.load = function() {
            return this;
        }

        /**
         * Get status for a task.
         *
         * :param int task_id: ID of the task in question
         * :return: boolean value, true if task completed
         */
        this.get = function(i) {
            if (i in data) {
                return data.get(i);
            }
            return false;
        }

        /**
         * Set status for a task.
         *
         * :param int task_id: ID of the task in question
         * :param bool value: whether or not the task has been completed
         */
        this.set = function(i, value) {
            data[i] = value;
            return this;
        }
    }

    state = new State().load();

    /**
     * Updates the GUI.
     */
    function updateGUI() {
        $('.task').each(function() {
            var id = parseInt($(this).attr('id'));
            $(this).find('input').prop('checked', state.get(id));
        });
    }

    /**
     * Retrieves task given id.
     */
    function get_task(id) {
        return $('.task[id="' + id + '"]');
    }

    /**
     * Updates the state when checkbox clicked.
     */
    $('input').on('change', function() {
        var id = parseInt($(this).attr('no'));
        state.set(id, $(this).prop('checked'));
        get_task(id).toggleClass('inactive');
    });
})