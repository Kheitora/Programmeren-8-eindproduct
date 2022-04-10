const canvas = document.getElementById('myChart')
let myChart

export function createChart(columns) {
    const config = {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Cholesterol vs the presence of heart disease',
                data: columns,
                backgroundColor: 'rgb(99, 99, 255)'
            }]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: 'Cholesterol' }
                },
                y: {
                    title: { display: true, text: 'Presence of heart disease (0 is absent and 1 is present)' }
                },
              
                
            },
            layout: {
                padding: 30,
                
            }
        }
    }
    

    if (canvas){
    myChart = new Chart(canvas, config)
    }
}

// update an existing chart
// https://www.chartjs.org/docs/latest/developers/updates.html
export function updateChart(label, data) {
    myChart.data.datasets.push({
        label,
        data,
        backgroundColor: 'rgb(255, 99, 55)'
    })
    myChart.update()

}