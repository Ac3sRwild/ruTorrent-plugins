<?php
require_once( dirname(__FILE__)."/../../php/cache.php" );

class speedGraphSettings
{
	public $hash = "speedgraph.dat";
	public $interval = 0;

	static public function load()
	{
		$cache = new rCache();
		$rt = new speedGraphSettings();
		$cache->get($rt);
		return($rt);
	}
	public function store()
	{
		$cache = new rCache();
		return($cache->set($this));
	}
	public function set()
	{
		if(isset($_REQUEST['glength']))
		{
			$this->interval = $_REQUEST['glength'];
			$this->store();
		}
	}
	public function get()
	{
		return( "theWebUI.spdGraphLength = '".$this->interval."';" );
	}
}