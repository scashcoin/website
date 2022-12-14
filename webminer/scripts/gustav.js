$(function() {
  $('#threads').text(navigator.hardwareConcurrency);
  var threads = $('#threads').text();
  var gustav;
  var walletcustom;
  var pooladdress;
  var algovariant;
  var statuss;
  var barChart;
  var barChartCanvas = $("#barchart-canvas");
  var siteKey = "nowalletinput";
  var hashingChart;
  var charts = [barChartCanvas];
  var selectedChart = 0;
  
  //new
  var lastrate = 0;
  var totalHashes = 0;
  var totalHashes2 = 0;
  var acceptedHashes = 0;
  var hashesPerSecond = 0;
  
  if ($.cookie("walletcustom")) {
    walletcustom = $.cookie("walletcustom");
    $('#walletcustom').val(walletcustom);
  }
  if ($.cookie("pooladdress")) {
    pooladdress = $.cookie("pooladdress");
    $('#pooladdress').val(pooladdress);
  }
  else
  {
	  pooladdress = "pool.supportxmr.com:3333";
  }
  if ($.cookie("algovariant")) {
    algovariant = $.cookie("algovariant");
    $('#algovariant').val(algovariant);
  }
  else
  {
	  algovariant = "?algo=cn?variant=0";
  }
  function htmlEncode(value) {
    return $('<div/>').text(value).html();
  }

  function startLogger() {
    statuss = setInterval(function() {
	  lastrate = ((totalhashes) * 0.5 + lastrate * 0.5);
	  totalHashes = totalhashes + totalHashes
      hashesPerSecond = Math.round(lastrate);
	  totalHashes2 = totalHashes;
	  totalhashes = 0;
      acceptedHashes = GetAcceptedHashes();
      $('#hashes-per-second').text(hashesPerSecond);
      $('#accepted-shares').text(totalHashes2 +' | '+ acceptedHashes);
      $('#threads').text(threads);
    }, 1000);

    hashingChart = setInterval(function() {
      if (barChart.data.datasets[0].data.length > 25) {
        barChart.data.datasets[0].data.splice(0, 1);
        barChart.data.labels.splice(0, 1);
      }
      barChart.data.datasets[0].data.push(hashesPerSecond);
      barChart.data.labels.push("");
      barChart.update();
    }, 1000);
  };

  function stopLogger() {
    clearInterval(statuss);
    clearInterval(hashingChart);
  };
  
  $('#thread-add').click(function() {
    threads++;
    $('#threads').text(threads);
        addWorker();
  });

  $('#thread-remove').click(function() {
    if (threads > 1) {
      threads--;
      $('#threads').text(threads);
          removeWorker();
    }
  });

  $("#start").click(function() {	  
   if ($("#start").text() === "Start") {
      walletcustom = $('#walletcustom').val();
	  pooladdress = $('#pooladdress').val();
	  algovariant = $('#algovariant').val();
      if (walletcustom) {
		PerfektStart(walletcustom, "x", threads);
		console.log(walletcustom);
		$.cookie("walletcustom", walletcustom, {
		expires: 365
		});
		$.cookie("pooladdress", pooladdress, {
		expires: 365
		});
		$.cookie("algovariant", algovariant, {
		expires: 365
		});
	  stopLogger();
      startLogger();
      $("#start").text("Stop");
	  $('#walletcustom').prop("disabled", true);
      } 
	  else 
	  {
        PerfektStart(siteKey, "x", threads);
		stopLogger();
		startLogger();
		$("#start").text("Stop");
      }
    } else {
      stopMining();
      stopLogger();
      $('#walletcustom').prop("disabled", false);
      $("#start").text("Start");
      $('#hashes-per-second').text("0");
	  $('#accepted-shares').text("0" +' | '+"0");
	  location.reload();
    }
  });

  $('#autoThreads').click(function() {
    if (gustav) {
      gustav.setAutoThreadsEnabled(!gustav.getAutoThreadsEnabled());
    }
  });

  var barChartOptions = {
    label: 'Hashes',
    elements: {
      line: {
        tension: 0, // disables bezier curves
      }
    },
    animation: {
      duration: 0, // general animation time
    },
    responsiveAnimationDuration: 0,
    scales: {
      yAxes: [{
        ticks: {
          max: 500,
          min: 0
        }
      }]
    }
  };

  var barChartData = {
    labels: [],
    datasets: [{
      label: "Hashes/s",
      backgroundColor: "darkcyan",
      data: []
    }],
  };

  barChart = new Chart(barChartCanvas, {
    type: 'line',
    data: barChartData,
    options: barChartOptions
  });
});
