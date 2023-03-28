$(function() {
	'use strict';
	var ctx1 = document.getElementById('chartBar1').getContext('2d');
	new Chart(ctx1, {
		type: 'bar',
		data: {
			labels: ['1.5', '2', '2.5', '3', '3.5', '4','4.5'],
			datasets: [{
				label: '# Kgs',
				data: [700, 1250, 5500, 9500, 15000, 5000,1500],
				backgroundColor: '#285cf7'
			}]
		},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			legend: {
				display: false,
				labels: {
					display: false
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 10,
						max: 25000,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}],
				xAxes: [{
					barPercentage: 0.6,
					ticks: {
						beginAtZero: true,
						fontSize: 11,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}]
			}
		}
	});

	var ctx4 = document.getElementById('chartBar4').getContext('2d');
	new Chart(ctx4, {
		type: 'horizontalBar',
		data: {
			labels: ['1A', 'BA', '2A', '3A', 'AA', '4A','5A','6A'],
			datasets: [{
				label: '# Diametros',
				data: [300, 7000, 8500, 13500, 12000, 8000, 7000, 8500],
				backgroundColor: ['#285cf7', '#f10075', '#f7557a', '#673ab7', '#ffc107', '#7987a1', '#f7557a', '#673ab7']
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					display: false
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 10,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}],
				xAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 11,
						max: 20000,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}]
			}
		}
	});
	var ctx10 = document.getElementById('chartBar10').getContext('2d');
	new Chart(ctx10, {
		type: 'horizontalBar',
		data: {
			labels: ['00 Base', '01 Piso ', '02 Piso ', ' 03 Piso', '04 Piso', '05 Piso','06 Piso','Base'],
			datasets: [{
				label: '# Diametros',
				data: [1500, 5000, 6500, 8500, 8200, 6500, 5856, 4580],
				backgroundColor: ['#285cf7', '#f10075', '#f7557a', '#673ab7', '#ffc107', '#7987a1', '#f7557a', '#673ab7']
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					display: false
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 10,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}],
				xAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 11,
						max: 20000,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}]
			}
		}
	});

	var ctx11 = document.getElementById('chartBar11').getContext('2d');
	new Chart(ctx11, {
		type: 'horizontalBar',
		data: {
			labels: ['6m', '6<L<7 ', '7<L<8 ', ' >=12m'],
			datasets: [{
				label: '# Diametros',
				data: [989, 1560, 5457, 2587],
				backgroundColor: ['#285cf7', '#f10075', '#f7557a', '#673ab7']
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					display: false
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 10,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}],
				xAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 11,
						max: 20000,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}]
			}
		}
	});

	var ctx12 = document.getElementById('chartBar12').getContext('2d');
	new Chart(ctx12, {
		type: 'horizontalBar',
		data: {
			labels: ['Enero', 'Febrero ', 'marzo ', ' Abril', ' Mayo', ' Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
			datasets: [{
				label: '# Peso Pedidos',
				data: [8560, 11560, 8879, 7895,9876,10256,13256,7845,6589,13254,14689,4569],
				backgroundColor: ['#285cf7', '#f10075', '#f7557a', '#673ab7','#ffc107', '#7987a1', '#f7557a', '#673ab7','#285cf7', '#f10075', '#f7557a', '#673ab7']
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					display: false
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 10,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}],
				xAxes: [{
					ticks: {
						beginAtZero: true,
						fontSize: 11,
						max: 20000,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}]
			}
		}
	});

	/** STACKED BAR CHART **/

	/* 
	var ctx6 = document.getElementById('chartStacked1');
	new Chart(ctx6, {
		type: 'bar',
		data: {
			labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
			datasets: [{
				data: [10, 24, 20, 25, 35, 50],
				backgroundColor: '#007bff',
				borderWidth: 1,
				fill: true
			}, {
				data: [13, 27, 67, 2, 60, 10],
				backgroundColor: '#58a2f1',
				borderWidth: 1,
				fill: true
			}, {
				data: [20, 30, 28, 33, 45, 65],
				backgroundColor: '#c9e1fb',
				borderWidth: 1,
				fill: true
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					display: false
				}
			},
			scales: {
				yAxes: [{
					stacked: true,
					ticks: {
						beginAtZero: true,
						fontSize: 11,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}],
				xAxes: [{
					barPercentage: 0.5,
					stacked: true,
					ticks: {
						fontSize: 11,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}]
			}
		}
	});

*/
/*
	var ctx7 = document.getElementById('chartStacked2');
	new Chart(ctx7, {
		type: 'horizontalBar',
		data: {
			labels: ['NVL 0', 'NVL 1', 'NVL 2', 'NVL 3', 'NVL 4', 'NVL 5'],
			datasets: [{
				data: [10, 24, 20, 25, 35, 50],
				backgroundColor: '#007bff',
				borderWidth: 1,
				fill: true
			}, {
				data: [10, 24, 20, 25, 35, 50],
				backgroundColor: '#58a2f1',
				borderWidth: 1,
				fill: true
			}, {
				data: [20, 30, 28, 33, 45, 65],
				backgroundColor: '#c9e1fb',
				borderWidth: 1,
				fill: true
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false,
				labels: {
					display: false
				}
			},
			scales: {
				yAxes: [{
					stacked: true,
					ticks: {
						beginAtZero: true,
						fontSize: 10,
						max: 80,
						fontColor: "rgba(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}],
				xAxes: [{
					stacked: true,
					ticks: {
						beginAtZero: true,
						fontSize: 11,
						fontColor: "rgb(171, 167, 167,0.9)",
					},
					gridLines: {
						display: true,
						color: 'rgba(171, 167, 167,0.2)',
						drawBorder: false
					},
				}]
			}
		}
	});
	 */
	/* LINE CHART */

	/** AREA CHART **/

	/** PIE CHART **/
	var datapie = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
		datasets: [{
			data: [20, 20, 30, 5, 25],
			backgroundColor: ['#285cf7', '#f10075', '#8500ff', '#7987a1', '#74de00']
		}]
	};
	var optionpie = {
		maintainAspectRatio: false,
		responsive: true,
		legend: {
			display: false,
		},
		animation: {
			animateScale: true,
			animateRotate: true
		}
	};
	// For a doughnut chart
	var ctx6 = document.getElementById('chartPie');
	var myPieChart6 = new Chart(ctx6, {
		type: 'doughnut',
		data: datapie,
		options: optionpie
	});
	// For a pie chart
	var ctx7 = document.getElementById('chartDonut');
	var myPieChart7 = new Chart(ctx7, {
		type: 'pie',
		data: datapie,
		options: optionpie
	});
});