$(document).ready(function() {

    TASK_DATA_PARAM = 'cs70inboxtasks';

    /**
     * Manages state of all tasks
     */
    function State() {

        data = {};

        /**
         * Save in local browser cache.
         */
        this.save = function() {
            localStorage.setItem(TASK_DATA_PARAM, JSON.stringify(data));
            return this;
        }

        /**
         * Load from local browser cache
         */
        this.load = function() {
            raw = localStorage.getItem(TASK_DATA_PARAM);
            if (raw) {
                data = JSON.parse(raw);
                console.log('Loaded state: ' + raw);
            }
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
                return data[i];
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
            this.save();
            return this;
        }
    }

    /**
     * Updates the GUI.
     */
    function updateGUI() {
        $('.task').each(function() {
            var id = parseInt($(this).attr('id'));
            $(this).find('input').prop('checked', state.get(id));
            if (state.get(id)) {
                $(this).addClass('inactive');
            } else {
                $(this).removeClass('inactive');
            }
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

    state = new State().load();
    updateGUI();
})