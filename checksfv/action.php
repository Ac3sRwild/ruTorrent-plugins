<?php

require_once( dirname(__FILE__).'/../_task/task.php' );
eval( getPluginConf( 'checksfv' ) );

$ret = array( "status"=>255, "errors"=>array("Can't retrieve information") );

if(isset($_REQUEST['hash']) && 
	isset($_REQUEST['no']) &&
	isset($_REQUEST['cmd']))
{
	switch($_REQUEST['cmd'])
	{
		case "checksfv":
		{
			$req = new rXMLRPCRequest( new rXMLRPCCommand( "f.get_frozen_path", array($_REQUEST['hash'],intval($_REQUEST['no']))) );
			if($req->success())
			{
				$filename = $req->val[0];
				if($filename=='')
				{
					$req = new rXMLRPCRequest( array(
						new rXMLRPCCommand( "d.open", $_REQUEST['hash'] ),
						new rXMLRPCCommand( "f.get_frozen_path", array($_REQUEST['hash'],intval($_REQUEST['no'])) ),
						new rXMLRPCCommand( "d.close", $_REQUEST['hash'] ) ) );
					if($req->success())
						$filename = $req->val[1];
				}
				if($filename!=='')
				{
					$commands = array();
					$task = new rTask( array
					( 
						'arg'=>call_user_func('end',explode('/',$filename)),					
						'requester'=>'checksfv',
						'name'=>'checksfv', 
						'hash'=>$_REQUEST['hash'], 
						'no'=>$_REQUEST['no'] 
					) );					
					$commands[] = getExternal("cksfv")." -g ".escapeshellarg($filename);
					$ret = $task->start($commands, rTask::FLG_ONE_LOG);
				}
			}
			break;
		}
	}
}

cachedEcho(json_encode($ret),"application/json");
