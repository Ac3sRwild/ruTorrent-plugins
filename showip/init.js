plugin.loadMainCSS();
plugin.checkIP = function() {
if (plugin.enabled)
        plugin.addPaneToStatusbar("ip-td",$("<div>").attr("id","ip-holder").
                append( $("<div>").attr("align","center").attr("id","ip-cont").html(
                        "<td class='sthdr'>IP:&nbsp</td>"+
                        "<td class='stval' id='ip-text'></td>") ).get(0),3);
                $("#ip-text").text(this.ip);
				$("#ip-td").prop("title", 'WAN: '+this.ip+'\nLAN: '+this.lan_ip);
}

plugin.onRemove = function()
{
	plugin.removePaneFromStatusbar("ip-td");
}

plugin.checkIP();
