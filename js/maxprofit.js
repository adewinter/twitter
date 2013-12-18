/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function inputToArray(el) {
    var raw = $(el).val().split(',');
    return raw.map(function (x) {
        return parseInt(x, 10)
    }); //can't use parseInt as the map function as it expects 
    //two arguments :(
}

function maxPriceOne(series) {
    var min,
        maxProfit = 0,
        currentPrice,
        outputString;

    if (series.length < 2) {
        return 0; //we can't make a profit with fewer than two prices.
    }
    min = series[0];

    for (var i = 0; i < series.length; i++) {
        currentPrice = series[i];
        if (min > currentPrice) {
            min = currentPrice;
        }
        if ((currentPrice - min) > maxProfit) {
            maxProfit = currentPrice - min;
        }
    }

    outputString = "For Series: " + series + " <br />Maximum Profit is: " + maxProfit;

    return outputString;

}

/**
    Returns an array of indexes giving location of all minima found in the input series.

    The way it works:
    Looks at previous point in series: if we're rolling downwards assume there will be a minima
    eventually.  If we're starting to roll upwards, log last known minima (in the return index array) 
    and clear that variable.  If we start rolling downwards again, start tracking that value again
    in case we go up again.

    **/
function findLocalMinima(series) {
    //Could some form of Newton's method work here?
    var minIdxs = [],
        curMin,
        curMax,
        curVal,
        prevVal;
    if (series.length < 2) {
        return [];
    }
    curMin = series[0];
    prevVal = series[0]; //sort of a hack. We work here based on never having negative numbers, and that if we're at the 
    //bottom of the hill at the start, it's a minima.

    for (var i = 1; i < series.length; i++) { //start one forward so we can immediately work with the gradient
        curVal = series[i];
        if (curVal < prevVal) { //we're rolling downwards!
            curMin = curVal;
        } else if (curVal > prevVal) { //We're rolling uphill.
            if (curMin != null) { //if this is the first time we're in this condition, log the last known min now.
                minIdxs.push(i - 1); //we're already 'up' the hill, so log the previous value!
                curMin = null; //clear the tracker.
            }
        } else {
            //it's flat, not necessarily a minima or a maxima, so do nothing.
        }
        prevVal = curVal;
    }

    console.log('Found some minima: ', minIdxs);
    return minIdxs
}

/*
    Returns an array of index values indicating the local maxima.
    Similar operation to findLocalMinima but for local maxima.
*/
function findLocalMaxima(series) {
    if (series.length < 2) {
        return [];
    } //error checking.

    var maxIdxs = [],
        curMin,
        curMax,
        curVal,
        prevVal;

    curMin = series[0];
    prevVal = series[0]; //We work here based on never having negative values, and that if we're at the 
                         //bottom of the hill at the start, it's a minima.
    for (var i = 1; i < series.length; i++) { //start one forward so we can immediately work with the gradient
        curVal = series[i];
        if (curVal < prevVal) { //we're rolling downwards!
            if (curMax != null) {    //we could combine this if statement with above, but left for clarity.
                maxIdxs.push(i - 1); //push last index since we've hit the local max
                curMax = null;
            }
        } else if (curVal > prevVal) { //We're rolling upwards!
            curMax = curVal;
        } else {
            //it's flat, not necessarily a minima or a maxima, so do nothing.
        }
        prevVal = curVal;
    }

    return maxIdxs
}


function maxPriceTwo(series) {
    if (series.length < 2) {
        return [];
    }

    var maxs = findLocalMaxima(series),
        mins = findLocalMinima(series),
        max,
        min,
        profits = [],
        profit,
        outputString;

    for (var i = 0; i < mins.length; i++) {
        if ((maxs.length - 1) < i) {
            break; //no corresponding max to sell at. Stop.
        }
        max = maxs[i];
        min = mins[i];
        profits.push((series[max] - series[min]))
    }

    if (profits.length > 0) {
        profit = profits.reduce(function (a, b) {return a + b;}); //Sum the array.
    } else {
        profit = 0;
    }

    outputString = "For Series: " + series + " <br />Maximum Profit is: " + profit;
    return outputString;
}

$(document).ready(function () {
    $('#random-series-gen').click(function (e) {
        e.preventDefault();
        var length;
        var result = [];
        length = getRandomInt(2, 20);
        for (var i = 0; i < length; i++) {
            result.push(getRandomInt(0, 200));
        }
        $('.input-data').val(result);
    });

    $('#clear-all').click(function (e) {
        e.preventDefault();
        $('.input-data').val('');
        $('.output-data').html('');
    });

    $('#example-one-submit').click(function (e) {
        e.preventDefault();
        var series = inputToArray($('#example-one-input'));
        var result = maxPriceOne(series);
        $('#example-one-output').html(result);
    });

    $('#example-two-submit').click(function (e) {
        e.preventDefault();
        var series = inputToArray($('#example-two-input'));
        var result = maxPriceTwo(series);
        $('#example-two-output').html(result);
    });
});