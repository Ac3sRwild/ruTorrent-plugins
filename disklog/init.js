plugin.checkDisk = function()
{
	if (plugin.enabled)
		log("Disk Used: "+theConverter.bytes(plugin.full-plugin.free));
}
plugin.checkDisk();
