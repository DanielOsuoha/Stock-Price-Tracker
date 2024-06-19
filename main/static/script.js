var tickers = JSON.parse(localStorage.getItem("tickers")) || [];
var lastPrices = {};
var counter = 10;

function startUpdateCycle(){
    updatePrices();
    setInterval(function (){
        counter--;
        $('#counter').text(counter)
        if(counter === 0){
            updatePrices();
            counter = 30;
        }
    }, 1000);

}

$(document).ready(function(){
    tickers.forEach(function(ticker){
        addTickerTOGrid(ticker);
    });
    updatePrices();

    $("#add-ticker-form").submit(function(event) {
        event.preventDefault();
        var ticker = $("#new-ticker").val().toUpperCase();
        if (!tickers.includes(ticker)) {
            tickers.push(ticker);
            localStorage.setItem("tickers", JSON.stringify(tickers));
            addTickerTOGrid(ticker);
        }
        $("#new-ticker").val("");
        updatePrices();
    });

    $("#tickers-grid").on("click", ".remove-btn", function(){
        var tickerTorRemove = $(this).data('ticker');
        tickers = tickers.filter(t => t !== tickerTorRemove);
        localStorage.setItem("tickers", JSON.stringify(tickers));
        $(`#${tickerTorRemove}`).remove();
    });
    
    startUpdateCycle();

});

function addTickerTOGrid(ticker){
    var tickerDiv = $(`<div class="stock-box" id="${ticker}"></div>`);
    tickerDiv.append(`<h3>${ticker}</h3>`);
    tickerDiv.append(`<p id="${ticker}-price"></p> <p id="${ticker}-pct"></p>`);
    tickerDiv.append(`<button class="remove-btn" data-ticker="${ticker}">Remove</button>`);
    // tickerDiv.append(`<div class="ticker-price"></div>`);
    $("#tickers-grid").append(tickerDiv);
}

function updatePrices() {
    tickers.forEach(function(ticker) {
        $.ajax({
            url: "/get_stock_data",  
            type: "POST",
            data: JSON.stringify({"ticker": ticker}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                var changePercent = ((data.currentPrice - data.openPrice)/ data.openPrice) * 100;
                var colorClass;
                if (changePercent <= -2){
                    colorClass = 'dark-red';
                }else if (changePercent < 0){
                    colorClass ='red';
                }else if (changePercent == 0){
                    colorClass = 'gray';
                }else if (changePercent <= 2){
                    colorClass = 'green';
                }else{
                    colorClass = 'dark-green';
                }
                $(`#${ticker}-price`).text(`$${data.currentPrice.toFixed(2)}`);
                $(`#${ticker}-pct`).text(`${changePercent.toFixed(2)}%`);
                $(`#${ticker}-price`).removeClass('dark-red red gray green dark-green').addClass(colorClass);
                $(`#${ticker}-pct`).removeClass('dark-red red gray green dark-green').addClass(colorClass);

                var flashClass;
                if (lastPrices[ticker] > data.currentPrice){
                    flashClass = 'red-flash';
                }else if (lastPrices[ticker] < data.currentPrice) {
                    flashClass = 'green-flash';
                }else{
                    flashClass = 'gray-flash';
                }
                lastPrices[ticker] = data.currentPrice;

                $(`#${ticker}`).addClass(flashClass);
                setTimeout(function(){
                    $(`#${ticker}`).removeClass(flashClass);
                }, 1500);
            },
        });
    });
}