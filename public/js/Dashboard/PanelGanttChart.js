class GanttChart extends DashboardGanttChart {
    constructor(tasks) {
      //  super();
        //this.tasks = tasks;
    }

    load(parentDivId, viewer, modelData) {
        //if (!super.load(parentDivId, this.constructor.name, viewer, modelData)) return;
        //this.drawChart();
    }

    drawChart() {
        var _this = this; // need this for the onClick event

     /*   this.chart = new Gantt('#gantt', _this.tasks, {
            header_height: 40,
            column_width: 30,
            step: 24,
            view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
            bar_height: 15,
            bar_corner_radius: 7,
            arrow_curve: 5,
            padding: 10,
            view_mode: 'Month',   
            date_format: 'YYYY-MM-DD',
            on_click: function (task) {
                console.log(task);
                console.log(_this.viewer);
                console.log(task.id);
                _this.viewer.isolate(_this.modelData.getIds("4D_Task_ID", task.id.toString(2)));
            },
            custom_popup_html: function(task) {
                // the task object will contain the updated
                // dates and progress value
                return `
                <div class="details-container" style="width: 300px; padding: 15px">
                    <h5>${task.name}</h5>
                    <p>Expected to finish by ${task.end}</p>
                    <p>${task.progress}% completed!</p>
                    <p>4D task ID: ${task.id}</p>
                </div>
                `;
            }
        });*/
    }
}
