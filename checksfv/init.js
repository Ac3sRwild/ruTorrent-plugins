 /*
 * PLUGIN CHECKSFV
 *
 * Author: AceP1983 (Mostly just a hack of the mediainfo plugin by Novik)
 */
 
plugin.loadLang();

if(plugin.canChangeMenu()) 
{
	theWebUI.checkSFV = function( hash, no ) 
	{
		theWebUI.startConsoleTask( "checksfv", plugin.name, { "hash": hash, "no": no }, { noclose: true } );
	}

	plugin.createFileMenu = theWebUI.createFileMenu;
	theWebUI.createFileMenu = function( e, id ) 
	{
		if(plugin.createFileMenu.call(this, e, id)) 
		{
			if(plugin.enabled) 
			{
//				theContextMenu.add([CMENU_SEP]);
				var fno = null;
				var table = this.getTable("fls");
				if((table.selCount == 1)  && (theWebUI.dID.length==40))
				{
					var fid = table.getFirstSelected();
					if(this.settings["webui.fls.view"])
					{
						var arr = fid.split('_f_');
						fno = arr[1];
					}
					else
					if(!this.dirs[this.dID].isDirectory(fid))
						fno = fid.substr(3);
					if(fno!=null) {
					if(!(/.*\.sfv$/i).test(this.files[this.dID][fno].name))
						fno = null;
					}
				}
				theContextMenu.add( [theUILang.checksfv,  (fno==null) ? null : "theWebUI.checkSFV('" + theWebUI.dID + "',"+fno+")"] );
			}
			return(true);
		}
		return(false);
	}
}
