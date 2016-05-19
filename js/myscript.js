$(document).ready(function(){
	var html = "";
	$("#resultHolder").html(html);
	$("#submitURL").click(function(){
		$("#resultHolder").html(html);
		getComments();
	});
	function getComments(){
		var url = $("#vidURL").val();
		var vid = url.split("=");
		//console.log(vid);
		if(url.length<2)
			html = "Invalid URL!";
		else
		{
			var id = vid[1];
			//console.log(id);
			var parseURL = "part=snippet%2Creplies&maxResults=100&order=relevance&key=AIzaSyDCdQcdnQe7fEQTDyUrNKhYi0VnPNAbF8Y&videoId="+id;
			//console.log(parseURL);
			$.ajax({		
				url: "https://www.googleapis.com/youtube/v3/commentThreads",
				data: parseURL,
				type: 'GET',
				success: function(output){
					//console.log(output);
					if(output.items.length==0)
						html = "Sorry, no comments posted!";
					else{
						var text = "";
						for(var i=0; i<output.items.length; i++)
						{
					//		console.log("Comment: "+ output.items[i].snippet.topLevelComment.snippet.textDisplay.replace(/<(?:.|\n)*?>/gm, ' '));
							text+=output.items[i].snippet.topLevelComment.snippet.textDisplay.replace(/<(?:.|\n)*?>/gm, ' ')+" ";
							if(output.items[i].replies){
					//			console.log("# of replies: "+ output.items[i].replies.comments.length);
								for(var j = 0; j<output.items[i].replies.comments.length; j++){
					//				console.log("Reply: "+ output.items[i].replies.comments[j].snippet.textDisplay.replace(/<(?:.|\n)*?>/gm, ' '));
									text+=output.items[i].replies.comments[j].snippet.textDisplay.replace(/<(?:.|\n)*?>/gm, ' ')+" ";
								}
							}
						}
						getAnalysis(text.toLowerCase());
					}

				},
				error: function(jqXHR, textStatus, errorThrown){
					html = "Please check the entered URL!";
					//console.log(html);
				}
			});
		}
		$("#resultHolder").html("<strong>"+html+"</strong>");
	}
	function getAnalysis(text){
		$.ajax({		
				url: "TextEmotions/test/analyze.php",
				data: {text: text},
				type: 'POST',
				success: function(output){
					$("#resultHolder").html(output);
					output = JSON.parse(output);
					//console.log(output);
					drawCharts(output);
				},
				error: function(jqXHR, textStatus, errorThrown){
					//console.log("Some error occured while analysing the data!");
				}
			});
	}
	function drawCharts(obj){
		html ="<div class='col-xs-6'>";
			html+="<h2 class='row' id='title1'>Sentiment Analysis</h2>";
			html+="<canvas id='myChart1' width='400' height='400'></canvas>";
		html+="</div>";
		html+="<div class='col-xs-6'>";
			html+="<h2 class='row' id='title2'>Emotion Analysis</h2>";
			html+="<canvas id='myChart2' width='400' height='400'></canvas>";
		html+="</div>";
		$("#resultHolder").html(html);
		var ctx1 = document.getElementById("myChart1").getContext("2d");
		var ctx2 = document.getElementById("myChart2").getContext("2d");
		var pos = (100*obj.positivity/(obj.positivity + obj.negativity)).toFixed(2);
		var neg = (100*obj.negativity/(obj.positivity + obj.negativity)).toFixed(2);
		var emotions = obj.feeling.fear+obj.feeling.anger+obj.feeling.sadness+obj.feeling.joy+obj.feeling.disgust+obj.feeling.trust+obj.feeling.anticipation+obj.feeling.surprise;
		var fear = (100*obj.feeling.fear/emotions).toFixed(2);
		var anger = (100*obj.feeling.anger/emotions).toFixed(2);
		var sadness = (100*obj.feeling.sadness/emotions).toFixed(2);
		var joy = (100*obj.feeling.joy/emotions).toFixed(2);
		var disgust = (100*obj.feeling.disgust/emotions).toFixed(2);
		var trust = (100*obj.feeling.trust/emotions).toFixed(2);
		var anticipation = (100*obj.feeling.anticipation/emotions).toFixed(2);
		var surprise = (100*obj.feeling.surprise/emotions).toFixed(2);
		var data1 = [
		    {
		        value: pos,
		        color:"#46BFBD",
		        highlight: "#5AD3D1",
		        label: "Positivity"
		    },
		    {
		        value: neg,
		        color: "#F7464A",
		        highlight: "#FF5A5E",
		        label: "Negativity"
		    }
		];
		var data2 = [
			{
				value: fear,
		        color:"#3377ff",
		        highlight: "#6699ff",
		        label: "Fear"
			},
			{
				value: anger,
		        color:"#F7464A",
		        highlight: "#FF5A5E",
		        label: "Anger"
			},
			{
				value: sadness,
		        color: "#46BFBD",
		        highlight: "#5AD3D1",
		        label: "Sadness"
			},
			{
				value: joy,
		        color: "#FDB45C",
        		highlight: "#FFC870",
		        label: "Joy"
			},
			{
				value: disgust,
		        color: "#66ff1a",
		        highlight: "#88ff4d",
		        label: "Disgust"
			},
			{
				value: trust,
		        color: "#9966ff",
		        highlight: "#bb99ff",
		        label: "Trust"
			},
			{
				value: anticipation,
		        color: "#ffcc99",
		        highlight: "#ffd9b3",
		        label: "Anticipation"
			},
			{
				value: surprise,
		        color: "#ff9900",
		        highlight: "#ffad33",
		        label: "Surprise"
			}
		];
		var options = {
		    //Boolean - Whether we should show a stroke on each segment
		    segmentShowStroke : true,

		    //String - The colour of each segment stroke
		    segmentStrokeColor : "#fff",

		    //Number - The width of each segment stroke
		    segmentStrokeWidth : 2,

		    //Number - The percentage of the chart that we cut out of the middle
		    percentageInnerCutout : 50, // This is 0 for Pie charts

		    //Number - Amount of animation steps
		    animationSteps : 100,

		    //String - Animation easing effect
		    animationEasing : "easeOutBounce",

		    //Boolean - Whether we animate the rotation of the Doughnut
		    animateRotate : true,

		    //Boolean - Whether we animate scaling the Doughnut from the centre
		    animateScale : false,

		    //String - A legend template
		    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

		}
		var myPieChart1 = new Chart(ctx1).Pie(data1,options);
		options = {};
		var myPieChart2 = new Chart(ctx2).Pie(data2,options);

	}
});