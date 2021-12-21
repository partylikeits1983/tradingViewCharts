var fivemData;
var hourData;
var fourhData;
var dayData;


async function getData(_callback) {

	// 5m, 1hr, 4hr, 24h
  // 5m 
  fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=100`)
    .then(res => res.json())
    .then(data => {
    cdata = data.map(d => {
      return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
    });
    fivemData = cdata;
  })
    .catch(err => log(err))
    
  //1h
  fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100`)
    .then(res => res.json())
    .then(data => {
    cdata = data.map(d => {
      return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
    });
    hourData = cdata;
  })
    .catch(err => log(err))
 
   // 4h
  fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=4h&limit=100`)
    .then(res => res.json())
    .then(data => {
    cdata = data.map(d => {
      return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
    });
    fourhData = cdata;
  })
    .catch(err => log(err))
    
    // 24h
  fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=100`)
    .then(res => res.json())
    .then(data => {
    cdata = data.map(d => {
      return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
    });
    dayData = cdata;
  })
    .catch(err => log(err))
    

    _callback(); 
  
}




function createSimpleSwitcher(items, activeItem, activeItemChangedCallback) {
	
	var switcherElement = document.createElement('div');
	switcherElement.classList.add('switcher');

	var intervalElements = items.map(function(item) {
		var itemEl = document.createElement('button');
		itemEl.innerText = item;
		itemEl.classList.add('switcher-item');
		itemEl.classList.toggle('switcher-active-item', item === activeItem);
		itemEl.addEventListener('click', function() {
			onItemClicked(item);
		});
		switcherElement.appendChild(itemEl);
		return itemEl;
	});

	function onItemClicked(item) {
		if (item === activeItem) {
			return;
		}

		intervalElements.forEach(function(element, index) {
			element.classList.toggle('switcher-active-item', items[index] === item);
		});

		activeItem = item;

		activeItemChangedCallback(item);
	}

	return switcherElement;
}

var intervals = ['5m', '1h', '4h', '1d'];








var switcherElement = createSimpleSwitcher(intervals, intervals[0], syncToInterval);

var chartElement = document.createElement('div');

var chart = LightweightCharts.createChart(chartElement, {
	width: 1000,
  height: 600,
	layout: {
		backgroundColor: '#000000',
		textColor: '#919eb4',
	},
	grid: {
		vertLines: {
			color: '#0c0e13',
		},
		horzLines: {
			color: '#0c0e13',
		},
	},
	rightPriceScale: {
		borderVisible: false,
	},
	timeScale: {
		borderVisible: false,
	},
	crosshair: {
		horzLine: {
			visible: true,
		},
	},
});

document.body.appendChild(chartElement);
document.body.appendChild(switcherElement);

var candleSeries = null;

function myClick() {
  setTimeout(
    function() {
      syncToInterval();
    }, 1000);
}
 
myClick();

function syncToInterval(interval) {
	getData(function() {
  		console.log(weekData);
  }
  );
  
  var seriesesData = new Map([
    ['5m', fivemData ],
    ['1h', hourData ],
    ['4h', fourhData ],
    ['1d', dayData ],
  ]);
  
  
  
	if (candleSeries) {
		chart.removeSeries(candleSeries);
		candleSeries = null;
	}
  candleSeries = chart.addCandlestickSeries({
    upColor: '#54eed8',
    downColor: '#f92988',
    borderDownColor: '#f92988',
    borderUpColor: '#54eed8',
    wickDownColor: '#f92988',
    wickUpColor: '#54eed8',
  });


	candleSeries.setData(seriesesData.get(interval));
}

syncToInterval(intervals[0]);

console.log(weekData)


