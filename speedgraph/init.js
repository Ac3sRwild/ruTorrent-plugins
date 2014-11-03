plugin.loadLang();

if(plugin.canChangeOptions())
{
	plugin.addAndShowSettings = theWebUI.addAndShowSettings;
	theWebUI.addAndShowSettings = function( arg )
	{
        	if(plugin.enabled)
	        {
		        $('#sg_length').val(theWebUI.spdGraphLength);
		}
		plugin.addAndShowSettings.call(theWebUI,arg);
	}

	theWebUI.sgraphWasChanged = function()
	{
		return(	$('#sg_length').val()!=theWebUI.spdGraphLength );
	}

	plugin.setSettings = theWebUI.setSettings;
	theWebUI.setSettings = function()
	{
		plugin.setSettings.call(this);
		if( plugin.enabled && this.sgraphWasChanged() )
			this.request("?action=setglength",[theWebUI.reload, theWebUI]);
	}
	
	rTorrentStub.prototype.setglength = function()
	{
		this.content = "glength="+$('#sg_length').val();
		this.contentType = "application/x-www-form-urlencoded";
		this.mountPoint = "plugins/speedgraph/action.php";
		this.dataType = "script";
	}
	
	rTorrentStub.prototype.getglength = function()
	{
		this.content = "glength="+$('#sg_length').val();
		this.contentType = "application/x-www-form-urlencoded";
		this.mountPoint = "plugins/speedgraph/action.php";
		this.dataType = "script";
	}
	
	plugin.speedCreate = rSpeedGraph.prototype.create;
	rSpeedGraph.prototype.create = function( aOwner )
	{
        plugin.speedCreate.call(this,aOwner);
		var gint = theWebUI.spdGraphLength;
		var tint = 60;
		if(gint == 0)
			gint = 600;
		if(gint == 1)
			gint = 1800
			tint = 120;
		if(gint == 2)
			gint = 3200
			tint = 300;
		if(gint == 3)
			gint = 9600
			tint = 600;
        this.maxSeconds = gint;
	}
	
	plugin.speedDraw = rSpeedGraph.prototype.draw;
	rSpeedGraph.prototype.draw = function()
	{
		plugin.speedDraw.call(this);
		var self = this;
		$(function() 
		{
			if((theWebUI.activeView=='Speed') &&
				self.owner.height() && self.owner.width())
			{
				clearCanvas( self.owner.get(0) );
				self.owner.empty();
	
				function xTick(n) 
				{
					var dt = new Date(n*1000);
					var h = dt.getHours();
					var m = dt.getMinutes();
					var s = dt.getSeconds();
					h = (h < 10) ? ("0" + h) : h;
					m = (m < 10) ? ("0" + m) : m;
					s = (s < 10) ? ("0" + s) : s;
					return( h+":"+m+":"+s );
				}
	
				$.plot(self.owner, self.getData(),
				{ 
					colors: self.getColors(),
					lines:
					{
						show: true
					},
					grid:
					{
						color: self.gridColor,
						backgroundColor: self.backgroundColor,
						hoverable: true
					},
					xaxis: 
					{ 
						min: (self.seconds-self.startSeconds>=self.maxSeconds) ? null : self.startSeconds,
						max: (self.seconds-self.startSeconds>=self.maxSeconds) ? null : self.maxSeconds+self.startSeconds,
						tickSize: self.tint,
						tickFormatter: xTick
					},
					yaxis: 
					{ 
						min: 0,
						minTickSize: 5*1024,
						tickFormatter: function(n) { return(theConverter.speed(n)) } 
					}
				});
	
				function showTooltip(x, y, contents)
				{
						$('<div id="tooltip">' + contents + '</div>').css( {
						position: 'absolute',
						display: 'none',
						top: y + 5,
						left: x + 5,
						border: '1px solid #fdd',
						padding: '2px',
						'background-color': '#fee',
						'color': 'black',
						'font-size': '11px',
						'font-weight': 'bold',
						'font-family': 'Tahoma, Arial, Helvetica, sans-serif',
						opacity: 0.80
					}).appendTo("body").fadeIn(200);
				}
	
				self.owner.off("plothover"); 
				self.owner.on("plothover", 
					function (event, pos, item) 
					{ 
						if(item)
						{
							if(previousSpeedPoint != item.datapoint)
							{
								previousSpeedPoint = item.datapoint;
								$("#tooltip").remove();
								showTooltip(item.pageX, item.pageY,
									item.series.label + " " + xTick(item.datapoint[0]) + " = " + theConverter.speed(item.datapoint[1]));
							}
						}
						else
						{
							$("#tooltip").remove();
							previousSpeedPoint = null;
						}
					}
				);
	
				$('#'+self.owner.attr('id')+' .legendColorBox').before("<td class='legendCheckBox'><input type='checkbox'></td>");
				$.each($('#'+self.owner.attr('id')+' .legendCheckBox input'),function(ndx,element)
				{
					$(element).click( function() 
					{
						self.checked[ndx] = !self.checked[ndx];
						self.draw();
					}).attr("checked",self.checked[ndx]);
				});
	
			}
		});
	}
}

plugin.onLangLoaded = function() 
{
	this.attachPageToOptions($('<div>').attr("id","st_spdGraph").html(
		"<fieldset>"+
			"<legend>"+theUILang.spdGraphName+"</legend>"+
			"<table>"+
			"<tr><td>"+theUILang.spdGraphLength+'</td><td class="alr"><select id="sg_length" class="TextboxShort">'+
				"<option value='0'>10 min</option>"+
				"<option value='1'>30 min</option>"+
				"<option value='2'>1 hr</option>"+
				"<option value='3'>3 hrs</option>"+
				'</select></td></tr>'+
			"</table>"+
		"</fieldset>")[0],theUILang.spdGraphName);
}

plugin.onRemove = function()
{
	this.removePageFromOptions("st_spdGraph");
}