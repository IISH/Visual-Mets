<?php
/**
 * @version 1.7
 * @name  Dirhandler
 * haald een drectory met files op met root verwijzing 
 * in een asositive array format 
 * zie : http://us2.php.net/manual/en/spl.iterators.php
 */	
class Dirhandler
{

		public $php_sorter = 'sort';
		public $recursive = true;
		private $mainpath = '';
		private $file_hidden_prefix = '[hidden]';





		public function formatBytes($bytes, $precision = 2) {
		    $units = array('bytes', 'KB', 'MB', 'GB', 'TB');

		    $bytes = max($bytes, 0);
		    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
		    $pow = min($pow, count($units) - 1);

		    $bytes /= pow(1024, $pow);

		    return round($bytes, $precision) . ' ' . $units[$pow];
		}

		private function isHiddenDir($value){
			return (strstr($value, $this->file_hidden_prefix))? true : false;
		}

		private function formatDS($path, $trim_path="") {
			$ab_path = preg_replace("/(%5C)/", "%2F", urlencode($path));
			$rel_path = urldecode($ab_path);
			return preg_replace("/(".$trim_path.")$/","", $rel_path);
		}
		

		/**
		 * @return  array
		 * @param target destination the file to be find
		 * recusrive method zorcht er voor dat de directory wordt opgehaald en 
		 * terug gegeven in een asositive array
		 */		
		public function getDir($target){

			   $array_result = array();
			   if(is_dir($target)){
					if ($handler = opendir($target)){
						
						while (false !== ($read = readdir($handler))){
							
							if ($read != '.' && $read != '..'){
							   
				               $array_result[$target][] = $read;
							   $var = (string)$this->php_sorter;
				               $var($array_result[$target]);

				               self::getDir($target.'/'.$read);
								
							}
						}
						closedir($handler);
					}
			   }
				return isset($array_result) ? $array_result : false;
		}
		
		
		
		private function handler($dir, $sorter, $getfile, $getinfo){
			$counter=0;
 			$data_dirs = array();
 			$data_files = array();
 			if(is_object($dir)){
			  foreach ( $dir as $node ){
			  	
			    if ( $node->isDir() && !$node->isDot() ){
			    	if($this->recursive)
			    		if(!self::isHiddenDir($node->getFilename()))
			      			$data_dirs[$node->getFilename()] = self::handler( new DirectoryIterator( $node->getPathname() ), $sorter, $getfile, $getinfo);
			      	else{
			      		if(!self::isHiddenDir($node->getFilename()))
			      			$data_files[] = $node->getFilename();
			      	}
			    }else if ( $node->isFile() ){
			    	if($getfile){
			    		if(!$getinfo){
			    			if(!self::isHiddenDir($node->getFilename()))
			      			  $data_files[] = $node->getFilename();			      			
			    		}else{
			    			if(!self::isHiddenDir($node->getFilename())){
						      $data_files[] = array(
						      	'file' 		=> $node->getFilename(),
						      	'path' 		=> self::formatDS(substr_replace($node->getPath(), '',0, strlen($this->mainpath))).'/',
						      	'fullpath'  => $node->getPath(),
						      	'size' 		=> self::formatBytes($node->getSize()),
						      	'modification' => filemtime($node->getPathname())	
						      );
			    			}
			    		}			      		
			    	}      
			    }
			    $sorter($data_dirs);	
			  }
		}		  
			  return   array_merge($data_dirs, $data_files);					
		}
		


		/**
		 * get files from a directory
		 *
		 * @param $path         String 	            		the path (dir) to search in
		 * @param $file         String|array 	    		the file to catch 			        default "*"     string backward compatible!
		 * @param $recursive    Boolean             	    search in directoryes recusrive	 	default true
		 * @param $data         Array 	            		the data to loop true
		 * @param $subdir       String 	            		the subdir's
		 * @param $type         String 	            		the subdir's                        file or dir
		 * @return Array
		 */			
		 private function getArrayList($path, $file, $recursive, $data, $subdir, $type){
			$output = array();
			$data = empty($data)?  self::get($path) : $data;

			foreach($data as  $key => $files){
				
				if(is_array($files) && !empty($files)){
					if($recursive){
						
						$result = self::getArrayList($path, $file, $recursive, $files, $subdir.$key.'/', $type);
						$output = array_merge($output, $result);
					}
				}else{

					if($file =='*' || $file[0]=='*'){
							if($type == 'file'){
								if(strrpos($subdir.$files, 'Array') === false)
									$output[] = $subdir.$files;	
							}else if($type == 'dir'){
								if(!in_array($subdir, $output)){			
									$output[] = $subdir;
								}
							}					
					}else{
                        if(is_string($file)){
                            if(strrpos($subdir.$files, $file) !== false){
                                if($type == 'file'){
                                    if(strrpos($subdir.$files, 'Array') === false)
                                        $output[] = $subdir.$files;
                                }else if($type == 'dir'){
                                    if(!in_array($subdir, $output)){
                                        $output[] = $subdir;
                                    }
                                }
                            }
                        }else{
                            $file_parts  = pathinfo($files);
                            if (in_array($file_parts['extension'],$file)){
                                if($type == 'file'){
                                    if(strrpos($subdir.$files, 'Array') === false)
                                        $output[] = $subdir.$files;
                                }else if($type == 'dir'){
                                    if(!in_array($subdir, $output)){
                                        $output[] = $subdir;
                                    }
                                }
                            }
                        }
					}
				}
			}
			return $output;
		}
		
			
		/**
		 * maakt gebruikt van de php Iterator added by php 5.0 
		 * 
		 */
		public function get( $path, $sorter='ksort'){
			try{
			  return self::handler(new DirectoryIterator( $path ), $sorter, $getfile=true, $getinfo=false);	
			  }catch(Exception $e){
			 	trigger_error('directory not found!'.'<b><br></b>path:</b>'.$path.'</b>', E_USER_ERROR);
			 	return false;
			}			
		}		
		
		/**
		 * maakt gebruikt van de php Iterator added by php 5.0 
		 * 
		 */
		public function getDirs( $path, $sorter='ksort'){
			try{
			 return self::handler(new DirectoryIterator( $path ), $sorter, $getfile=false, $getinfo=false);
			 }catch(Exception $e){
			 	trigger_error('directory not found!'.'<b><br></b>path:</b>'.$path.'</b>', E_USER_ERROR);
			 	return false;
			}					
		}
		
		public function getFiles($path, $file='*', $recursive=true){
			try{
			return self::getArrayList($path, $file, $recursive, $data=array(), $subdir='', $type='file');
			}catch(Exception $e){
			 	trigger_error('directory not found!'.'<b><br></b>path:</b>'.$path.'</b>', E_USER_ERROR);
			 	return false;
			}		
		}
		
		public function getDirPaths( $path, $recursive=true){
			try{
			 return self::getArrayList($path, $file='*', $recursive, $data=array(), $subdir='', $type='dir');
			 }catch(Exception $e){
			 	trigger_error('directory not found!'.'<b><br></b>path:</b>'.$path.'</b>', E_USER_ERROR);
			 	return false;
			}				
		}	
			
		/**
		 * maakt gebruikt van de php Iterator added by php 5.0 
		 * 
		 */
		public function getWithInfo( $path, $sorter='ksort'){	
			try{
			 	return self::handler(new DirectoryIterator( $path ), $sorter, $getfile=true, $getinfo=true);
			}catch(Exception $e){
			 	trigger_error('directory not found!'.'<b><br></b>path:</b>'.$path.'</b>', E_USER_ERROR);
			 	return false;
			}						
		}		

		
}





/* =================[ VOORBEELD VAN DE DIR HANDLER CLASS ] ======================

	$getdirr = new Dirhandler();
	 $path = $_SERVER['DOCUMENT_ROOT'].'RCRM/modules/media_manager/uploads/';
	$getdirr->target = 'plugins';
	$getdirr->getDir($path);

	--------------------------------------------------------------------------------
	

	 echo '<pre>';
		print_r($dir->get( $path ));
	 echo '</pre>';
	 
*/


?>